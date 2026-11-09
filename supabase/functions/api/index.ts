import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";
import { jwtVerify, SignJWT } from "npm:jose@5.9.6";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "DONOR" | "RECEIVER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  created_at: string | null;
};

type Donor = {
  id: number;
  user_id: number;
  blood_group: string;
  location: string | null;
  phone: string | null;
  availability: boolean;
  last_donated: string | null;
};

class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const jwtSecretValue = Deno.env.get("JWT_SECRET");

if (!supabaseUrl || !serviceRoleKey || !jwtSecretValue) {
  throw new Error(
    "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and JWT_SECRET function secrets.",
  );
}
if (new TextEncoder().encode(jwtSecretValue).length < 32) {
  throw new Error("JWT_SECRET must be at least 32 bytes long.");
}

const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const jwtSecret = new TextEncoder().encode(jwtSecretValue);
const allowedOrigins = new Set([
  "https://emergency-blood-finder-system.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function response(
  body: unknown,
  status = 200,
  origin: string | null = null,
): Response {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Vary": "Origin",
  });
  if (origin && allowedOrigins.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function databaseError(error: { code?: string; message: string }): never {
  console.error("Supabase database operation failed:", error.message);
  if (error.code === "23505") {
    throw new ApiError(409, "A record with these details already exists");
  }
  if (error.code === "23503") {
    throw new ApiError(400, "The referenced record does not exist");
  }
  throw new ApiError(500, "Database operation failed");
}

function requireData<T>(
  result: { data: T | null; error: { code?: string; message: string } | null },
): T {
  if (result.error) databaseError(result.error);
  if (result.data === null) throw new ApiError(404, "Record not found");
  return result.data;
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "A JSON object is required");
  }
  return value as Record<string, unknown>;
}

function requiredString(
  body: Record<string, unknown>,
  key: string,
): string {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${key} is required`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function bloodGroupCode(label: unknown): string {
  if (typeof label !== "string") {
    throw new ApiError(400, "A valid blood group is required");
  }
  const normalized = label.trim().toUpperCase().replace("+", "_POS").replace(
    "-",
    "_NEG",
  );
  const valid = new Set([
    "A_POS",
    "A_NEG",
    "B_POS",
    "B_NEG",
    "AB_POS",
    "AB_NEG",
    "O_POS",
    "O_NEG",
  ]);
  if (!valid.has(normalized)) {
    throw new ApiError(400, "Unknown blood group");
  }
  return normalized;
}

function bloodGroupLabel(code: string): string {
  return code.replace("_POS", "+").replace("_NEG", "-");
}

function bloodBankResponse(bank: Record<string, unknown>) {
  return {
    id: bank.id,
    name: bank.name,
    location: bank.location,
    contact: bank.contact,
    description: bank.description,
    createdAt: bank.created_at ?? null,
  };
}

function safeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.created_at ?? "",
  };
}

function authResponse(user: User, token: string) {
  return {
    token,
    type: "Bearer",
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function createToken(email: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(jwtSecret);
}

async function currentUser(request: Request): Promise<User> {
  const authorization = request.headers.get("Authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, "Authentication required");

  let email: string;
  try {
    const { payload } = await jwtVerify(token, jwtSecret, {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") {
      throw new ApiError(401, "Invalid or expired token");
    }
    email = payload.sub;
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const result = await db.from("users").select("*").eq("email", email).maybeSingle();
  if (result.error) databaseError(result.error);
  if (!result.data || result.data.status !== "ACTIVE") {
    throw new ApiError(401, "Account is unavailable");
  }
  return result.data as User;
}

async function requireRole(user: User, role: User["role"]): Promise<void> {
  if (user.role !== role) throw new ApiError(403, "Not authorized");
}

async function donorResponse(db: SupabaseClient, donor: Donor) {
  const result = await db.from("users").select("id,name,email,status")
    .eq("id", donor.user_id).single();
  const user = requireData(result);
  return {
    id: donor.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    bloodGroup: bloodGroupLabel(donor.blood_group),
    location: donor.location,
    phone: donor.phone,
    availability: donor.availability,
    lastDonated: donor.last_donated,
    status: user.status,
  };
}

async function donorsResponse(db: SupabaseClient, donors: Donor[]) {
  if (!donors.length) return [];
  const userIds = [...new Set(donors.map((donor) => donor.user_id))];
  const result = await db.from("users").select("id,name,email,status")
    .in("id", userIds);
  const users = requireData(result) as Array<
    Pick<User, "id" | "name" | "email" | "status">
  >;
  const usersById = new Map(users.map((user) => [user.id, user]));
  return donors.map((donor) => {
    const user = usersById.get(donor.user_id);
    if (!user) throw new ApiError(500, "Donor account is missing");
    return {
      id: donor.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      bloodGroup: bloodGroupLabel(donor.blood_group),
      location: donor.location,
      phone: donor.phone,
      availability: donor.availability,
      lastDonated: donor.last_donated,
      status: user.status,
    };
  });
}

async function getDonorForUser(userId: number): Promise<Donor> {
  const result = await db.from("donors").select("*").eq("user_id", userId)
    .maybeSingle();
  if (result.error) databaseError(result.error);
  if (!result.data) throw new ApiError(404, "Donor profile not found");
  return result.data as Donor;
}

async function requestResponses(requests: Array<Record<string, unknown>>) {
  if (!requests.length) return [];
  const donorIds = [...new Set(requests.map((item) => Number(item.donor_id)))];
  const requesterIds = [
    ...new Set(requests.map((item) => Number(item.requester_id))),
  ];
  const [donorResult, requesterResult] = await Promise.all([
    db.from("donors").select("id,user_id,blood_group").in("id", donorIds),
    db.from("users").select("id,name,email").in("id", requesterIds),
  ]);
  const donors = requireData(donorResult) as Array<
    Pick<Donor, "id" | "user_id" | "blood_group">
  >;
  const requesterUsers = requireData(requesterResult) as Array<
    Pick<User, "id" | "name" | "email">
  >;
  const donorUsersResult = donors.length
    ? await db.from("users").select("id,name").in(
      "id",
      [...new Set(donors.map((donor) => donor.user_id))],
    )
    : { data: [], error: null };
  const donorUsers = requireData(donorUsersResult) as Array<
    Pick<User, "id" | "name">
  >;
  const donorById = new Map(donors.map((donor) => [donor.id, donor]));
  const requesterById = new Map(
    requesterUsers.map((user) => [user.id, user]),
  );
  const donorUserById = new Map(donorUsers.map((user) => [user.id, user]));

  return requests.map((item) => {
    const donor = donorById.get(Number(item.donor_id));
    const requester = requesterById.get(Number(item.requester_id));
    const donorUser = donor ? donorUserById.get(donor.user_id) : undefined;
    if (!donor || !requester || !donorUser) {
      throw new ApiError(500, "Request references a missing account");
    }
    return {
      id: item.id,
      message: item.message ?? "",
      status: item.status,
      createdAt: item.created_at ?? "",
      requesterName: requester.name,
      requesterEmail: requester.email,
      donorName: donorUser.name,
      donorId: donor.id,
      bloodGroup: bloodGroupLabel(donor.blood_group),
    };
  });
}

async function parseBody(request: Request) {
  try {
    return asObject(await request.json());
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "Invalid JSON request body");
  }
}

async function routeRequest(
  request: Request,
  route: string,
  url: URL,
): Promise<unknown> {
  const method = request.method.toUpperCase();
  const path = route.split("/").filter(Boolean);

  if (method === "POST" && route === "/auth/register") {
    const body = await parseBody(request);
    const name = requiredString(body, "name");
    const email = requiredString(body, "email").toLowerCase();
    const password = requiredString(body, "password");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError(400, "A valid email is required");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }
    const role = typeof body.role === "string" &&
        body.role.toUpperCase() === "DONOR"
      ? "DONOR"
      : "RECEIVER";
    const bloodGroup = role === "DONOR"
      ? bloodGroupCode(body.bloodGroup)
      : null;
    const hash = await bcrypt.hash(password, 10);
    const userResult = await db.from("users").insert({
      name,
      email,
      password: hash,
      role,
      status: "ACTIVE",
    }).select("*").single();
    if (userResult.error) databaseError(userResult.error);
    const user = userResult.data as User;

    if (role === "DONOR") {
      const donorResult = await db.from("donors").insert({
        user_id: user.id,
        blood_group: bloodGroup,
        location: optionalString(body.location),
        phone: optionalString(body.phone),
        availability: true,
      });
      if (donorResult.error) {
        const rollback = await db.from("users").delete().eq("id", user.id);
        if (rollback.error) {
          console.error("Could not roll back failed donor registration:", rollback.error.message);
        }
        databaseError(donorResult.error);
      }
    }
    return authResponse(user, await createToken(email));
  }

  if (method === "POST" && route === "/auth/login") {
    const body = await parseBody(request);
    const email = requiredString(body, "email").toLowerCase();
    const password = requiredString(body, "password");
    const result = await db.from("users").select("*").eq("email", email)
      .maybeSingle();
    if (result.error) databaseError(result.error);
    const user = result.data as User | null;
    if (!user || !user.password.startsWith("$2") ||
      !await bcrypt.compare(password, user.password)) {
      throw new ApiError(401, "Invalid email or password");
    }
    if (user.status !== "ACTIVE") throw new ApiError(403, "Account is blocked");
    return authResponse(user, await createToken(user.email));
  }

  if (method === "GET" && route === "/donors") {
    const result = await db.from("donors").select("*")
      .order("availability", { ascending: false }).order("id");
    return donorsResponse(db, requireData(result) as Donor[]);
  }

  if (method === "GET" && route === "/donors/search") {
    let query = db.from("donors").select("*")
      .order("availability", { ascending: false }).order("id");
    const bloodGroup = url.searchParams.get("bloodGroup");
    const location = url.searchParams.get("location")?.trim();
    if (bloodGroup) query = query.eq("blood_group", bloodGroupCode(bloodGroup));
    if (location) query = query.ilike("location", `%${location}%`);
    const result = await query;
    return donorsResponse(db, requireData(result) as Donor[]);
  }

  if (method === "GET" && route === "/donors/me") {
    const user = await currentUser(request);
    await requireRole(user, "DONOR");
    return await donorResponse(db, await getDonorForUser(user.id));
  }

  if (method === "POST" && route === "/donors/profile") {
    const user = await currentUser(request);
    await requireRole(user, "DONOR");
    const body = await parseBody(request);
    const existing = await db.from("donors").select("last_donated")
      .eq("user_id", user.id).maybeSingle();
    if (existing.error) databaseError(existing.error);
    const lastDonated = optionalString(body.lastDonated);
    if (lastDonated && !/^\d{4}-\d{2}-\d{2}$/.test(lastDonated)) {
      throw new ApiError(400, "lastDonated must use YYYY-MM-DD format");
    }
    const result = await db.from("donors").upsert({
      user_id: user.id,
      blood_group: bloodGroupCode(body.bloodGroup),
      location: optionalString(body.location),
      phone: optionalString(body.phone),
      availability: typeof body.availability === "boolean"
        ? body.availability
        : true,
      last_donated: lastDonated ?? existing.data?.last_donated ?? null,
    }, { onConflict: "user_id" }).select("*").single();
    return await donorResponse(db, requireData(result) as Donor);
  }

  if (method === "POST" && route === "/donors/quick-add") {
    const body = await parseBody(request);
    const name = requiredString(body, "name");
    const bloodGroup = bloodGroupCode(body.bloodGroup);
    const location = requiredString(body, "location");
    const phone = requiredString(body, "phone");
    const email = optionalString(body.email)?.toLowerCase() ??
      `manual_${crypto.randomUUID()}@bloodfinder.local`;
    const password = "NO_LOGIN_MANUAL_ENTRY";
    const userResult = await db.from("users").insert({
      name,
      email,
      password,
      role: "DONOR",
      status: "ACTIVE",
    }).select("*").single();
    if (userResult.error) databaseError(userResult.error);
    const user = userResult.data as User;
    const donorResult = await db.from("donors").insert({
      user_id: user.id,
      blood_group: bloodGroup,
      location,
      phone,
      availability: true,
    }).select("*").single();
    if (donorResult.error) {
      const rollback = await db.from("users").delete().eq("id", user.id);
      if (rollback.error) {
        console.error("Could not roll back quick-add donor:", rollback.error.message);
      }
      databaseError(donorResult.error);
    }
    return await donorResponse(db, donorResult.data as Donor);
  }

  if (method === "GET" && path[0] === "donors" && path.length === 2) {
    const id = Number(path[1]);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid donor id");
    const result = await db.from("donors").select("*").eq("id", id).maybeSingle();
    if (result.error) databaseError(result.error);
    if (!result.data) throw new ApiError(404, "Donor not found");
    return await donorResponse(db, result.data as Donor);
  }

  if (method === "GET" && route === "/bloodbanks") {
    let query = db.from("blood_banks").select("*").order("id");
    const location = url.searchParams.get("location")?.trim();
    if (location) query = query.ilike("location", `%${location}%`);
    const result = await query;
    return (requireData(result) as Array<Record<string, unknown>>)
      .map(bloodBankResponse);
  }

  if (method === "GET" && path[0] === "bloodbanks" && path.length === 2) {
    const id = Number(path[1]);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid blood bank id");
    const result = await db.from("blood_banks").select("*").eq("id", id)
      .maybeSingle();
    if (result.error) databaseError(result.error);
    if (!result.data) throw new ApiError(404, "Blood bank not found");
    return bloodBankResponse(result.data as Record<string, unknown>);
  }

  if (route === "/bloodbanks" && ["POST", "PUT", "DELETE"].includes(method)) {
    const user = await currentUser(request);
    await requireRole(user, "ADMIN");
    if (method === "POST" || method === "PUT") {
      const body = await parseBody(request);
      const bank = {
        name: requiredString(body, "name"),
        location: requiredString(body, "location"),
        contact: requiredString(body, "contact"),
        description: optionalString(body.description),
      };
      if (method === "POST") {
        const result = await db.from("blood_banks").insert(bank).select("*").single();
        return bloodBankResponse(requireData(result) as Record<string, unknown>);
      }
      const id = Number(url.searchParams.get("id"));
      if (!Number.isSafeInteger(id) || id < 1) {
        throw new ApiError(400, "A valid blood bank id is required");
      }
      const result = await db.from("blood_banks").update(bank).eq("id", id)
        .select("*").maybeSingle();
      if (result.error) databaseError(result.error);
      if (!result.data) throw new ApiError(404, "Blood bank not found");
      return bloodBankResponse(result.data as Record<string, unknown>);
    }
  }

  if (method === "PUT" && path[0] === "bloodbanks" && path.length === 2) {
    const user = await currentUser(request);
    await requireRole(user, "ADMIN");
    const id = Number(path[1]);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid blood bank id");
    const body = await parseBody(request);
    const result = await db.from("blood_banks").update({
      name: requiredString(body, "name"),
      location: requiredString(body, "location"),
      contact: requiredString(body, "contact"),
      description: optionalString(body.description),
    }).eq("id", id).select("*").maybeSingle();
    if (result.error) databaseError(result.error);
    if (!result.data) throw new ApiError(404, "Blood bank not found");
    return bloodBankResponse(result.data as Record<string, unknown>);
  }

  if (method === "DELETE" && path[0] === "bloodbanks" && path.length === 2) {
    const user = await currentUser(request);
    await requireRole(user, "ADMIN");
    const id = Number(path[1]);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid blood bank id");
    const result = await db.from("blood_banks").delete().eq("id", id);
    if (result.error) databaseError(result.error);
    return { message: "Blood bank deleted successfully" };
  }

  if (method === "POST" && route === "/requests") {
    const user = await currentUser(request);
    const body = await parseBody(request);
    const donorId = Number(body.donorId);
    if (!Number.isSafeInteger(donorId) || donorId < 1) {
      throw new ApiError(400, "A valid donorId is required");
    }
    const result = await db.from("requests").insert({
      requester_id: user.id,
      donor_id: donorId,
      message: requiredString(body, "message"),
      status: "PENDING",
    }).select("*").single();
    return (await requestResponses([requireData(result)]))[0];
  }

  if (method === "GET" && route === "/requests/mine") {
    const user = await currentUser(request);
    const result = await db.from("requests").select("*")
      .eq("requester_id", user.id).order("created_at", { ascending: false });
    return await requestResponses(requireData(result) as Array<Record<string, unknown>>);
  }

  if (method === "GET" && route === "/requests/incoming") {
    const user = await currentUser(request);
    const donor = await getDonorForUser(user.id);
    const result = await db.from("requests").select("*").eq("donor_id", donor.id)
      .order("created_at", { ascending: false });
    return await requestResponses(requireData(result) as Array<Record<string, unknown>>);
  }

  if (method === "PUT" && path[0] === "requests" && path[2] === "status") {
    const user = await currentUser(request);
    const donor = await getDonorForUser(user.id);
    const id = Number(path[1]);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid request id");
    const status = url.searchParams.get("status")?.toUpperCase();
    if (status !== "ACCEPTED" && status !== "REJECTED") {
      throw new ApiError(400, "Status must be ACCEPTED or REJECTED");
    }
    const result = await db.from("requests").update({ status }).eq("id", id)
      .eq("donor_id", donor.id).select("*").maybeSingle();
    if (result.error) databaseError(result.error);
    if (!result.data) throw new ApiError(404, "Request not found or not assigned to you");
    return (await requestResponses([result.data]))[0];
  }

  if (route.startsWith("/admin/")) {
    const user = await currentUser(request);
    await requireRole(user, "ADMIN");

    if (method === "GET" && route === "/admin/stats") {
      const counts = await Promise.all([
        db.from("users").select("id", { count: "exact", head: true }),
        db.from("donors").select("id", { count: "exact", head: true }),
        db.from("donors").select("id", { count: "exact", head: true })
          .eq("availability", true),
        db.from("requests").select("id", { count: "exact", head: true }),
        db.from("requests").select("id", { count: "exact", head: true })
          .eq("status", "PENDING"),
        db.from("requests").select("id", { count: "exact", head: true })
          .eq("status", "ACCEPTED"),
        db.from("blood_banks").select("id", { count: "exact", head: true }),
        db.from("users").select("id", { count: "exact", head: true })
          .eq("status", "BLOCKED"),
      ]);
      for (const result of counts) {
        if (result.error) databaseError(result.error);
      }
      return {
        totalUsers: counts[0].count ?? 0,
        totalDonors: counts[1].count ?? 0,
        availableDonors: counts[2].count ?? 0,
        totalRequests: counts[3].count ?? 0,
        pendingRequests: counts[4].count ?? 0,
        acceptedRequests: counts[5].count ?? 0,
        totalBloodBanks: counts[6].count ?? 0,
        blockedUsers: counts[7].count ?? 0,
      };
    }

    if (method === "GET" && route === "/admin/users") {
      const result = await db.from("users").select(
        "id,name,email,role,status,created_at",
      ).order("id");
      const users = requireData(result) as User[];
      return users.map(safeUser);
    }

    if (path[0] === "admin" && path[1] === "users" && path.length === 4 &&
      path[3] === "block" && method === "PUT") {
      const id = Number(path[2]);
      if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid user id");
      const found = await db.from("users").select("id,role,status").eq("id", id)
        .maybeSingle();
      if (found.error) databaseError(found.error);
      if (!found.data) throw new ApiError(404, "User not found");
      if (found.data.role === "ADMIN") {
        throw new ApiError(400, "Cannot block an admin account");
      }
      const status = found.data.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
      const result = await db.from("users").update({ status }).eq("id", id)
        .select("id,status").single();
      return requireData(result);
    }

    if (path[0] === "admin" && path[1] === "users" && path.length === 3 &&
      method === "DELETE") {
      const id = Number(path[2]);
      if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Invalid user id");
      const found = await db.from("users").select("role").eq("id", id)
        .maybeSingle();
      if (found.error) databaseError(found.error);
      if (!found.data) throw new ApiError(404, "User not found");
      if (found.data.role === "ADMIN") {
        throw new ApiError(400, "Cannot delete an admin account");
      }
      const result = await db.from("users").delete().eq("id", id);
      if (result.error) databaseError(result.error);
      return { message: "User deleted successfully" };
    }
  }

  throw new ApiError(404, "API endpoint not found");
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  if (request.method === "OPTIONS") {
    return response({}, 200, origin);
  }

  try {
    const url = new URL(request.url);
    let route = url.pathname.replace(/^\/functions\/v1\/api/, "");
    if (route === "/api" || route.startsWith("/api/")) {
      route = route.slice(4) || "/";
    }
    if (route.length > 1) route = route.replace(/\/+$/, "");
    const result = await routeRequest(request, route, url);
    return response(result, 200, origin);
  } catch (error) {
    if (error instanceof ApiError) {
      return response({ message: error.message }, error.status, origin);
    }
    console.error("Unhandled API error:", error);
    return response({ message: "An unexpected server error occurred" }, 500, origin);
  }
});
