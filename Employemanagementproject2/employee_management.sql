-- Employee Management System Database

CREATE DATABASE IF NOT EXISTS employee_db;

USE employee_db;

-- Employee table
CREATE TABLE IF NOT EXISTS employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100),
    salary DOUBLE
);

-- Sample employee data
INSERT INTO
    employee (
        name,
        email,
        department,
        salary
    )
VALUES (
        'Mohd Kaif',
        'kaif@gmail.com',
        'IT',
        50000
    ),
    (
        'Rahul Sharma',
        'rahul@gmail.com',
        'HR',
        45000
    ),
    (
        'Aman Verma',
        'aman@gmail.com',
        'Finance',
        55000
    ),
    (
        'Priya Singh',
        'priya@gmail.com',
        'IT',
        60000
    ),
    (
        'Arjun Kumar',
        'arjun@gmail.com',
        'Marketing',
        48000
    );

-- Show all employees
SELECT * FROM employee;