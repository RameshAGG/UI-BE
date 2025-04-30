CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT
);


CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100)
);


INSERT INTO employees (employee_id, name, department_id) VALUES
(1, 'Mageshwaran', 102),
(2, 'Nanthu', 103),
(3, 'Balaji', 104),
(4, 'Maha', 105),
(5, 'Sathya', 104),
(6, 'Arun', 103),
(7, 'Divya', 101),
(8, 'Ramesh', 102),
(9, 'Priya', 105),
(10, 'Karthick', 100);



INSERT INTO departments (department_id, department_name) VALUES
(100, 'Manager'),
(101, 'HR'),
(102, 'Developer'),
(103, 'Designer'),
(104, 'Tester'),
(105, 'Marketing');


SELECT * FROM employees;

alter table employees add column age int;

alter table employees add column salary int;

SELECT * FROM employees
WHERE age > 25;


SELECT e.name, e.age, d.department_name
FROM employees e
INNER JOIN departments d
ON e.department_id = d.department_id;


SELECT d.department_name, AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d
ON e.department_id = d.department_id
GROUP BY d.department_name;


SELECT * FROM employees
ORDER BY salary ASC;

SELECT * FROM employees
LIMIT 3;

SELECT DISTINCT department_id
FROM employees;



SELECT * FROM employees
WHERE name LIKE 'M%';

SELECT * FROM employees
WHERE name LIKE '%a';

SELECT * FROM employees
WHERE name LIKE 'm%';


SELECT * FROM employees
WHERE department_id IN (103, 105);


SELECT * FROM employees
WHERE department_id = 102 OR salary < 1000;



SELECT * FROM employees
WHERE age < 25 AND department_id = 102;


SELECT department_id, COUNT(*) AS num_employees
FROM employees
GROUP BY department_id;


SELECT department_id, MAX(salary) AS max_salary
FROM employees
GROUP BY department_id;

SELECT department_id, MIN(salary) AS min_salary
FROM employees
GROUP BY department_id;

SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;


SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id
HAVING SUM(salary) > 1000;


SELECT department_name
FROM departments d
WHERE EXISTS (
    SELECT 1
    FROM employees e
    WHERE e.department_id = d.department_id
);




SELECT 
    e.employee_id,
    e.name,
    e.department_id,
    d.department_name
FROM 
    employees e
INNER JOIN 
    departments d ON e.department_id = d.department_id;

	

SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d
ON e.department_id = d.department_id;



SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d
ON e.department_id = d.department_id;



SELECT * FROM employees;

