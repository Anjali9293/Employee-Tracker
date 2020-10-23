DROP DATABASE IF EXISTS EmployeeTracker;

CREATE DATABASE EmployeeTracker;

USE EmployeeTracker;

CREATE TABLE department (
	`id` INT PRIMARY KEY auto_increment,
	`name` VARCHAR(30)
);

CREATE TABLE `role` (
	`id` INT PRIMARY KEY auto_increment,
	`title` VARCHAR(30),
	`salary` DECIMAL,
	`department_id` INT
);

CREATE TABLE employee (
	`id` INT PRIMARY KEY auto_increment,
	`first_name` VARCHAR(30),
	`last_name` VARCHAR(30),
	`role_id` INT,
	`manager_id` INT
);

INSERT INTO `department` (`id`, `name`) VALUES (1, 'Sales'), (2, 'Engineering'), (3, 'Legal'), (4, 'Finance');
INSERT INTO `role` (`id`, `title`, `salary`, `department_id`) VALUES 
	(1, 'Sales Lead', 100000, 1),
    (2, 'Salesperson', 80000, 1),
    (3, 'Lead Engineer', 150000, 2),
    (4, 'Software Enginner', 120000, 2),
    (5, 'Accountant', 125000, 4),
    (6, 'Legal Team Lead', 250000, 3),
    (7, 'Lawyer', 120000, 3);
INSERT INTO `employee` (`id`, `first_name`, `last_name`, `role_id`, `manager_id`) VALUES 
	(1, 'John', 'Doe', 1, 3),
    (2, 'Mike', 'Chan', 2, 1),
    (3, 'Ashley', 'Rodruguez', 3, null),
    (4, 'Kevin', 'Tupik', 4, 3),
    (5, 'Malia', 'Brown', 5, null),
    (6, 'Sarah', 'Lourd', 6, null),
    (7, 'Tom', 'Allen', 7, 6);
