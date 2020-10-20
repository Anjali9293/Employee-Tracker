create database EmployeeTracker;
use EmployeeTracker;
create table Department (
ID int primary key,
`Name` varchar(30)
);

create table `Role` (
ID int primary key,
Title varchar(30),
Salary decimal,
Department_id int
);

create table Employee (
ID int primary key,
First_Name varchar(30),
Last_Name varchar(30),
Role_id int,
Manager_id int
);



