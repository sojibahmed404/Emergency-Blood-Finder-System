USE blood_finder_db;
UPDATE users SET password = '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeH7SYWXZH.F8M7v0HXj8Gq0JyC9kqf6' WHERE password != 'NO_LOGIN_MANUAL_ENTRY' AND role != 'ADMIN';
