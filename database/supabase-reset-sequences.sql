-- Run after importing rows with their original IDs from MySQL.
SELECT setval(pg_get_serial_sequence('public.users', 'id'),
              COALESCE(MAX(id), 1), MAX(id) IS NOT NULL)
FROM public.users;

SELECT setval(pg_get_serial_sequence('public.donors', 'id'),
              COALESCE(MAX(id), 1), MAX(id) IS NOT NULL)
FROM public.donors;

SELECT setval(pg_get_serial_sequence('public.blood_banks', 'id'),
              COALESCE(MAX(id), 1), MAX(id) IS NOT NULL)
FROM public.blood_banks;

SELECT setval(pg_get_serial_sequence('public.requests', 'id'),
              COALESCE(MAX(id), 1), MAX(id) IS NOT NULL)
FROM public.requests;
