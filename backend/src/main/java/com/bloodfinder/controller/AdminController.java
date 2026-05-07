package com.bloodfinder.controller;

import com.bloodfinder.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only REST controller.
 * All endpoints require ROLE_ADMIN.
 *
 * GET    /api/admin/stats            — dashboard statistics
 * GET    /api/admin/users            — list all users
 * PUT    /api/admin/users/{id}/block — toggle block status
 * DELETE /api/admin/users/{id}       — delete user
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /** GET /api/admin/stats */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    /** GET /api/admin/users */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /** PUT /api/admin/users/{id}/block */
    @PutMapping("/users/{id}/block")
    public ResponseEntity<Map<String, Object>> toggleBlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBlockUser(id));
    }

    /** DELETE /api/admin/users/{id} */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
