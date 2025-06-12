PRAGMA foreign_keys = OFF;

-- delete from all tables
DELETE FROM attendance;
DELETE FROM change_course;
DELETE FROM course;
DELETE FROM language;
DELETE FROM level;
DELETE FROM scheduled_session;
DELETE FROM student;
DELETE FROM test;
DELETE FROM tutor;

PRAGMA foreign_keys = ON;