-- create database
CREATE DATABASE lms_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- create teacher schema
CREATE SCHEMA teacher
    AUTHORIZATION postgres;

-- create teacher table
CREATE TABLE IF NOT EXISTS teacher.teachers
(
    teacher_id character varying(255) NOT NULL,
    teacher_fname character varying(255) NOT NULL,
    teacher_mname character varying(255),
    teacher_lname character varying(255) NOT NULL,
    teacher_gender character varying(100) NOT NULL,
    teacher_email character varying(255) NOT NULL,
    teacher_password character varying(255) NOT NULL,
    PRIMARY KEY (teacher_id)
);

-- insert dummy teacher's data
INSERT INTO teacher.teachers(teacher_id, teacher_fname, teacher_mname, teacher_lname, 
    teacher_gender, teacher_email, teacher_password)
    VALUES('1', 'John', 'Markez', 'Doe', 'Male', 'johndoe@gmail.com', 'johndoe123');

INSERT INTO teacher.teachers(teacher_id, teacher_fname, teacher_mname, teacher_lname, 
    teacher_gender, teacher_email, teacher_password)
    VALUES('2', 'Mary', 'Jones', 'Doe', 'Female', 'mary@gmail.com', 'johndoe123');

-- create subject table
CREATE TABLE IF NOT EXISTS teacher.subjects
(
    subject_id character varying(255) NOT NULL,
    subject_name character varying(255) NOT NULL,
    teacher_id character varying(255) NOT NULL,
    PRIMARY KEY (subject_id),
    CONSTRAINT teacher_id FOREIGN KEY (teacher_id)
        REFERENCES teacher.teachers (teacher_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- insert dummy subject's data
INSERT INTO teacher.subjects(subject_id, subject_name, teacher_id) VALUES('1', 'Web Development', '1');
INSERT INTO teacher.subjects(subject_id, subject_name, teacher_id) VALUES('2', 'Information Management', '1');

-- count subjects
CREATE FUNCTION teacher.count_subject(id VARCHAR)
RETURNS INT
LANGUAGE plpgsql 
AS
$$
	DECLARE
		count INT;
	BEGIN
		SELECT COUNT(*) INTO count FROM teacher.subjects WHERE teacher_id = id;
		RETURN count;
	END;
$$;

CREATE TABLE IF NOT EXISTS teacher.classes
(
    class_id character varying(255) NOT NULL,
    class_name character varying(255) NOT NULL,
    class_section character varying(255),
    teacher_id character varying(255) NOT NULL,
    subject_id character varying(255) NOT NULL,
    class_school_year character varying(255) NOT NULL,
    PRIMARY KEY (class_id),
    CONSTRAINT teacher_id FOREIGN KEY (teacher_id)
        REFERENCES teacher.teachers (teacher_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT subject_id FOREIGN KEY (subject_id)
        REFERENCES teacher.subjects (subject_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- insert dummy class's data
INSERT INTO teacher.classes(class_id, class_name, teacher_id, subject_id, class_school_year)
VALUES('1', 'class A', '1', '1', (SELECT getacademic_year()));
INSERT INTO teacher.classes(class_id, class_name, teacher_id, subject_id, class_school_year)
VALUES('2', 'class B', '1', '2', (SELECT getacademic_year()));

-- count classes
CREATE FUNCTION teacher.count_class(id VARCHAR)
RETURNS INT
LANGUAGE plpgsql 
AS
$$
	DECLARE
		count INT;
	BEGIN
		SELECT COUNT(*) INTO count FROM teacher.classes WHERE teacher_id = id;
		RETURN count;
	END;
$$;

-- create get acaddemic year function
CREATE FUNCTION teacher.getacademic_year() 
RETURNS VARCHAR
LANGUAGE plpgsql
AS
$$
	DECLARE 
		academic_year VARCHAR;
	BEGIN
		SELECT CONCAT(EXTRACT(YEAR FROM CURRENT_DATE),'/',EXTRACT(YEAR FROM CURRENT_DATE) + 1) INTO academic_year;
		RETURN academic_year;
	END;
$$;

-- create function to get classes of spicific teacher, with its class id, name, section, school year subject id and name
CREATE OR REPLACE FUNCTION teacher.get_classes(t_id VARCHAR)
RETURNS TABLE (
	class_id VARCHAR,
	class_name VARCHAR,
	class_section VARCHAR,
	class_school_year VARCHAR,
	subject_id VARCHAR,
	subject_name VARCHAR
)
LANGUAGE plpgsql AS
$$
	BEGIN
		RETURN QUERY
		SELECT cl.class_id, cl.class_name, cl.class_section, cl.class_school_year, sb.subject_id, sb.subject_name
		FROM teacher.classes AS "cl"
		JOIN teacher.subjects AS "sb" ON cl.subject_id = sb.subject_id
		WHERE cl.teacher_id = t_id
		ORDER BY cl.class_name;
	END;
$$;

-- create student schema
CREATE SCHEMA student
    AUTHORIZATION postgres;

-- create students table in student schema
CREATE TABLE IF NOT EXISTS student.students
(
    student_id character varying(255) NOT NULL,
    student_fname character varying(255) NOT NULL,
    student_mname character varying(255),
    student_lname character varying(255) NOT NULL,
    student_gender character varying(100) NOT NULL,
    student_email character varying(255) NOT NULL,
    student_password character varying(255) NOT NULL,
    PRIMARY KEY (student_id)
);

-- insert dummy teacher's data
INSERT INTO student.students(student_id, student_fname, student_mname, student_lname, 
    student_gender, student_email, student_password)
    VALUES('1', 'Eric', 'Roni', 'Mallo', 'Male', 'eric@gmail.com', 'eric123');

INSERT INTO student.students(student_id, student_fname, student_mname, student_lname, 
    student_gender, student_email, student_password)
    VALUES('2', 'Mary', 'Jane', 'Dope', 'Female', 'mary@gmail.com', 'depe123');


CREATE  TABLE IF NOT EXISTS teacher.students
(
    student_id character varying(255) NOT NULL,
    teacher_id character varying(255) NOT NULL,
    class_id character varying(255) NOT NULL,
    CONSTRAINT student_id FOREIGN KEY (student_id)
        REFERENCES student.students (student_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT teacher_id FOREIGN KEY (teacher_id)
            REFERENCES teacher.teachers (teacher_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
    CONSTRAINT class_id FOREIGN KEY (class_id)
        REFERENCES teacher.classes (class_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- insert dummy data
INSERT INTO teacher.students(student_id, teacher_id, class_id) VALUES('1', '1', '1');
INSERT INTO teacher.students(student_id, teacher_id, class_id) VALUES('2', '1', '1');

-- count students 
CREATE FUNCTION teacher.count_student(id VARCHAR)
RETURNS INT
LANGUAGE plpgsql 
AS
$$
	DECLARE
		count INT;
	BEGIN
		SELECT COUNT(*) INTO count FROM teacher.students WHERE teacher_id = id;
		RETURN count;
	END;
$$;

-- function that selects all student of a spicif teacher, with their id, fname, mname, lname, gender, email
--  class and subject name 
CREATE OR REPLACE FUNCTION teacher.get_students(t_id VARCHAR)
RETURNS TABLE (
	student_id VARCHAR,
	student_fname VARCHAR,
	student_mname VARCHAR,
	student_lname VARCHAR,
	student_gender VARCHAR,
	student_email VARCHAR,
	class_id VARCHAR,
	class_name VARCHAR,
	subject_name VARCHAR
)
LANGUAGE plpgsql AS 
$$
	BEGIN
		RETURN QUERY
		SELECT s.student_id, s.student_fname,s.student_mname,s.student_lname,s.student_gender,s.student_email, cl.class_id, cl.class_name, sb.subject_name
		FROM teacher.students AS "ts"
		JOIN student.students AS "s" ON ts.student_id = s.student_id
		JOIN teacher.classes AS "cl" ON ts.class_id = cl.class_id
		JOIN teacher.subjects AS "sb" ON cl.subject_id = sb.subject_id	
		WHERE ts.teacher_id = t_id
		ORDER BY s.student_fname;
	END;
$$;

-- function that select a student that does not exist or added in a spific class of a spific teacher
CREATE OR REPLACE FUNCTION teacher.get_student_not_exist_in_class(t_id VARCHAR, cl_id VARCHAR)
RETURNS TABLE (
	student_id VARCHAR,
	student_fname VARCHAR,
	student_mname VARCHAR,
	student_lname VARCHAR,
	student_gender VARCHAR,
	student_email VARCHAR
)
LANGUAGE plpgsql AS 
$$	
	BEGIN
		RETURN QUERY
		SELECT s.student_id, s.student_fname, s.student_mname, s.student_lname, s.student_gender, s.student_email FROM student.students AS "s"
		WHERE NOT EXISTS ( SELECT ts.student_id FROM teacher.students AS "ts" 
		WHERE s.student_id = ts.student_id AND ts.teacher_id = t_id AND ts.class_id = cl_id);
	END;
$$;

-- get student classes info and its teacher info
CREATE FUNCTION student.get_classes(st_id VARCHAR)
RETURNS TABLE(
	class_id VARCHAR,
	class_name VARCHAR,
	class_school_year VARCHAR,
	class_section VARCHAR,
	subject_id VARCHAR,
	subject_name VARCHAR,
	teacher_id VARCHAR,
	teacher_fname VARCHAR,
	teacher_mname VARCHAR,
	teacher_lname VARCHAR
)
LANGUAGE plpgsql AS 
$$
	BEGIN
		RETURN QUERY
		SELECT cl.class_id, cl.class_name, cl.class_school_year, cl.class_section, cl.subject_id, s.subject_name, cl.teacher_id,
		t.teacher_fname,t.teacher_mname, t.teacher_lname
		FROM teacher.students AS "ts"
		JOIN teacher.teachers AS "t" ON ts.teacher_id = t.teacher_id
		JOIN teacher.classes AS "cl" ON ts.class_id = cl.class_id
		JOIN teacher.subjects AS "s" ON cl.subject_id = s.subject_id
		WHERE student_id = st_id
		ORDER BY cl.teacher_id;
	END;
$$;

   