
INSERT INTO language (name) VALUES
  ('Spanish'),
  ('French'),
  ('German'),
  ('Mandarin'),
  ('Japanese');


INSERT INTO level (name) VALUES
  ('Beginner'),
  ('Intermediate'),
  ('Advanced');


INSERT INTO tutor (first_name, last_name, email, phone_number, address) VALUES
  ('Madelyn', 'Walsh', 'maddy.walsh@gmail.com', '293-4955', '123 Main St'),
  ('Caitlyn', 'Johnson', 'caitlynj@virginia.edu', '475-3948', '2 dalphin Drive'),
  ('Carol', 'Nebel', 'carol.nebel@gmail.com', NULL, '789 Forest Ave');


INSERT INTO course (name, description, tutor_id, language_id, format, total_hours, level_id) VALUES
  ('Spanish Beginner', 'Introductory Spanish course', 1, 1, 'In-person', 25, 1),
  ('French Intermediate', 'Intermediate French course', 2, 2, 'Online', 25, 2),
  ('German Advanced', 'Advanced German grammar and conversation', 3, 3, 'In-person', 28, 3);


INSERT INTO student (first_name, last_name, email, phone_number, year, course_id, dlpt_score, level_id, address) VALUES
  ('Tallulah', 'Pitti', 'tpitti22@gmail.com', '222-3947', 2, 1, 85, 1, '101 Blue St'),
  ('Jane', 'Rose', 'janerose@gamil.com', NULL, 3, 2, 90, 2, '357 Georgia Lane'),
  ('Max', 'butter', 'maxb@gmail.com', '283-0394', 1, 3, 95, 3, '418 17th Street');


INSERT INTO scheduled_session (course_id, session_date, start_time, end_time, location, status, approved) VALUES
  (1, '2025-06-15', '09:00', '11:00', 'Room 101', 'Scheduled', 1),
  (2, '2025-06-16', '14:00', '16:00', 'Online', 'Scheduled', 1),
  (3, '2025-06-17', '10:00', '12:00', 'Room 203', 'Scheduled', 0),
  (1, '2025-06-16', '09:00', '11:00', 'Room 101', 'Scheduled', 1),
  (2, '2025-06-17', '14:00', '16:00', 'Online', 'Scheduled', 1),
  (3, '2025-06-15', '10:00', '12:00', 'Room 203', 'Scheduled', 0);


INSERT INTO attendance (session_id, student_id, attended) VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 1);


INSERT INTO test (student_id, score, date, description) VALUES
  (1, 88, '2025-06-01', 'Midterm exam'),
  (2, 92, '2025-06-02', 'Oral proficiency test'),
  (3, 85, '2025-06-03', 'Grammar quiz');


INSERT INTO change_course (course_id, change_type, status, submitted_by, created_at, updated_at) VALUES
  (1, 'Format', 'Pending', 1, '2025-06-01 08:00:00', '2025-06-01 08:00:00'),
  (2, 'Other', 'Approved', 2, '2025-06-02 09:00:00', '2025-06-05 10:00:00');
