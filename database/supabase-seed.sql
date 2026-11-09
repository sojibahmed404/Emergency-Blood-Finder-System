-- Run once after database/supabase-schema.sql on a new project.
-- Do not run when importing an existing MySQL/Render dataset.
BEGIN;
INSERT INTO users (name, email, password, role, status) VALUES
  ('Admin', 'admin@bloodfinder.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeMiMwiT/hYv/GXAzJLiUmBNwmYD4kh02',
   'ADMIN', 'ACTIVE');


INSERT INTO users (name, email, password, role, status) VALUES
  ('Md. Rakibul Islam',          'rakibul19980101@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Siam Hossain',               'siamhossain.cse18@gmail.com',      '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Radoun Hossin Mukta',    'redwanhossain957@gmail.com',       '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Shahariar Ahmed Kanon',  'shahariarkanon816@gmail.com',      '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Mst. Anamika Jahan',         'anamikajahann12@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Sojib Ahmed',            'mdsojibahmed544@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Mst. Ananna Khandaker',      'anuananna177@gmail.com',           '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Rakib Hasan Riyad',      'hasanrk2005@gmail.com',            '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Most. Khadija Khatun',       'tanzinmaria0101@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Rezwan Ahmed Ratul',     'rezwanahmedratul007@gmail.com',    '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Maruf Ibna Abdullah Rifat',  'marufibneabdullah51@gmail.com',    '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Rabbi',                  'rabbimollah2269@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Mst. Mushkat Jahan Shila',   'mashkatshila@gmail.com',           '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Ijaj Ahmed Rafi',            'rafi01752@gmail.com',              '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Sabbir Hossain Rahat',   'rahatbabu122@gmail.com',           '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Abid Hasan Hujaifa',         'abidhasanhujaifa1215@gmail.com',   '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Sabiha Rumman Medha',        'sabiha.rumman.10@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Intaj Hassan Nibir',     'intajnibir07@gmail.com',           '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Asif Foysal',            'asifshakhmd@gmail.com',            '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Fardin Khan Sadi',           'fardinkyau@gmail.com',             '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Abir Deb',                   'debabir82@gmail.com',              '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Bashudeb Kumer Paul',        'bashudebpaul9@gmail.com',          '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Abdur Rahim Ratul',      'mdabdurrahimratul2005@gmail.com',  '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Tahsin Tasnim Tandra',       'tandra8281@gmail.com',             '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Maream',                     'mareamtaherakib@gmail.com',        '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Imran Hassain',          'mdimranhossain4777@gmail.com',     '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Abu Sowad Mohammad Ali Siam','siamahmed224ry@gmail.com',         '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Fatima Rahman Shoshi',       'fatimarahmanshoshi31@gmail.com',   '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Rukaiya Rafiq Ulfa',         'rukaiyaulfa@gmail.com',            '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('S. M. Salman Farshi',        'salman.kyau@gmail.com',            '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Tawhidur Rahman Shishir',    'shishirpk07.bd@gmail.com',         '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Samiul Islam Shihab',    'shihab35.kyau@gmail.com',          '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Abu Raihan',             'bd01712692663@gmail.com',          '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Shimul Sarkar',          'shamimsarkar20004@gmail.com',      '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Khairun Nahar Sara',         'khairunnsara@gmail.com',           '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Md. Montasir Monir Alif',    'mr.alifpm16@gmail.com',            '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE'),
  ('Tarak Rahman Shakib',        'tarak3552@gmail.com',              '$2a$10$K/5Oeb6mWwJo2zO2YM2CXeqnvoMx0sax.I4qgTRS1/G/RFEdG1Wgi', 'DONOR', 'ACTIVE');











INSERT INTO donors (user_id, blood_group, location, phone, availability) VALUES
  (2,  'O_POS',  'Belkuchi',        '01643-623400', TRUE),
  (3,  'B_POS',  'Shahjadpur',      '01717-412612', TRUE),
  (4,  'O_POS',  'Ullapara',        '01797-560474', TRUE),
  (5,  'B_POS',  'Sirajganj',       '01845-981362', TRUE),
  (6,  'O_POS',  'Belkuchi',        '01738-128521', TRUE),
  (7,  'B_POS',  'Ullapara',        '01754-301132', TRUE),
  (8,  'AB_POS', 'Sirajganj sodor', '01773-483358', TRUE),
  (9,  'A_POS',  'Sirajganj sodor', '01554-839357', TRUE),
  (10, 'O_POS',  'Belkuchi',        '01861-111297', TRUE),
  (11, 'A_POS',  'Belkuchi',        '01603-521519', TRUE),
  (12, 'O_POS',  'Shahjadpur',      '01870-632063', TRUE),
  (13, 'O_POS',  'Enayetpur',       '01719-712269', TRUE),
  (14, 'A_POS',  'Ullapara',        '01319-737676', TRUE),
  (15, 'O_POS',  'Sirajganj sodor', '01752-909577', TRUE),
  (16, 'O_POS',  'Enayetpur',       '01798-819616', TRUE),
  (17, 'A_POS',  'Enayetpur',       '01302-451935', TRUE),
  (18, 'A_POS',  'Sirajganj sodor', '01814-932244', TRUE),
  (19, 'A_POS',  'Sirajganj sodor', '01721-799926', TRUE),
  (20, 'B_POS',  'Sirajganj sodor', '01754-044354', TRUE),
  (21, 'O_POS',  'Sirajganj sodor', '01787-832872', TRUE),
  (22, 'B_POS',  'Sirajganj sodor', '01916-827826', TRUE),
  (23, 'O_POS',  'Sirajganj',       '01716-049996', TRUE),
  (24, 'O_POS',  'Shahjadpur',      '01786-500883', TRUE),
  (25, 'A_POS',  'Sirajganj sodor', '01786-698281', TRUE),
  (26, 'O_POS',  'Shahjadpur',      '01580-581167', TRUE),
  (27, 'B_POS',  'Enayetpur',       '01330-507488', TRUE),
  (28, 'O_POS',  'Belkuchi',        '01943-079868', TRUE),
  (29, 'O_POS',  'Tangail',         '01341-901709', TRUE),
  (30, 'B_POS',  'Enayetpur',       '01345-166651', TRUE),
  (31, 'B_POS',  'Ullapara',        '01718-896337', TRUE),
  (32, 'B_POS',  'Shahjadpur',      '01819-373433', TRUE),
  (33, 'B_POS',  'Shahjadpur',      '01301-945171', TRUE),
  (34, 'O_POS',  'Sirajganj',       '01637-426116', TRUE),
  (35, 'O_POS',  'Sirajganj',       '01756-351617', TRUE),
  (36, 'B_POS',  'Sirajganj sodor', '01632-886305', TRUE),
  (37, 'AB_POS', 'Belkuchi',        '01824-063908', TRUE),
  (38, 'O_POS',  'Sirajganj',       '01700-000000', TRUE);

INSERT INTO blood_banks (name, location, contact, description) VALUES
  ('Sirajganj District Blood Bank',        'Sirajganj sodor',  '01700-001001', 'Main district blood bank serving Sirajganj city'),
  ('Quantum Foundation Blood Center',      'Sirajganj sodor',  '01700-002002', 'Non-profit blood donation center'),
  ('KYAU Blood Donors Club',               'Sirajganj',        '01700-003003', 'Blood donor club associated with Khwaja Yunus Ali University'),
  ('Belkuchi Upazila Blood Bank',          'Belkuchi',         '01700-004004', 'Upazila-level blood bank for Belkuchi area'),
  ('Shahjadpur Blood Center',              'Shahjadpur',       '01700-005005', 'Blood collection center in Shahjadpur'),
  ('Ullapara Blood Donor Society',         'Ullapara',         '01700-006006', 'Voluntary blood donor organization in Ullapara'),
  ('Enayetpur Blood Bank',                 'Enayetpur',        '01700-007007', 'Blood bank facility in Enayetpur'),
  ('Sandhani – Sirajganj Chapter',         'Sirajganj sodor',  '01700-008008', 'Voluntary blood donation organization chapter'),
  ('Badhan Blood Donors Organization',     'Sirajganj sodor',  '01700-009009', 'University-based voluntary blood donor organization'),
  ('Red Crescent Blood Center Sirajganj',  'Sirajganj',        '01700-010010', 'Bangladesh Red Crescent blood center');
COMMIT;
