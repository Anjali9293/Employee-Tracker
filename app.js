const inquirer = require( 'inquirer' );
const Database = require('./database.js');
//Array of user questions for prompts
const Choices = [
    "View All Employees",
    "View All Departments",
    "View All Roles",
    "View All Employees By Department",
    "View All Employees by Manager",
    "Add Employees",
    "Add Departments",
    "Add a Role",
    "Remove Employees",
    "Remove a Role",
    "Remove a Department",
    "Update Employee Role",
    "Update Employee Manager",
    "View Total Utilized budget for a department",
    "Quit"
];
//function to clear the terminal data but not the current stdout
function clearConsole() {    
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}
//function to view all the employees from the database
async function viewEmployees() {
    let employees = await db.query(`
        SELECT 
            employee.id,
            employee.first_name,
            employee.last_name,
            employeeRole.title,
            department.name,
            employeeRole.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM \`employee\`
            LEFT JOIN \`role\` AS employeeRole 
                ON employee.role_id = employeeRole.id 
            LEFT JOIN \`department\` AS department 
                ON employeeRole.department_id = department.id 
            LEFT JOIN \`employee\` AS manager 
                ON employee.manager_id = manager.id 
    `);
    console.table(employees);
}

//function to view all the departments from the database
async function viewDepartments() {
    let departments = await db.query(`SELECT * FROM department`)

    console.table(departments);
}

//function to view all the roles from the database
async function viewRoles () {
    let roles = await db.query(
        `SELECT role.id,role.title,role.salary,department.name AS Department FROM role
        LEFT JOIN department AS department ON role.department_id = department.id`); 

    console.table(roles);
    
}

//function to view employees by department based on user choice of department
async function viewAllEmployeesByDepartment() {
    let departmentChoice = await db.query("SELECT name FROM department");
    let departments = departmentChoice.map(itemObj=>itemObj.name);
    promptAnswers = await inquirer.prompt([
        { name: 'department', type: 'list', message: "\nSelect the department name to view the employees:",
        choices: departments }
    ]);
    let name = promptAnswers.department;
    let employees = await db.query(`
        SELECT 
            employee.id,
            employee.first_name,
            employee.last_name,
            employeeRole.title,
            department.name,
            employeeRole.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM \`employee\`
            LEFT JOIN \`role\` AS employeeRole 
                ON employee.role_id = employeeRole.id 
            LEFT JOIN \`department\` AS department 
                ON employeeRole.department_id = department.id 
            LEFT JOIN \`employee\` AS manager 
                ON employee.manager_id = manager.id 
        WHERE department.name="${name}"
    `);
    console.table(employees);
}

//function to view all the employees by Manager based on user choice of manager name
async function viewAllEmployeesbyManager() {
    let managers = await db.query(`
        SELECT 
            employee.id,
            CONCAT(employee.first_name, ' ', employee.last_name) as full_name
        FROM \`employee\`
    `);

    let promptAnswers = await inquirer.prompt([ 
        { name: 'action', type: 'list', message: 'Select a manager?',
        choices: managers.map(manager => manager.full_name) }
    ]);  

    let manager;
    managers.forEach(employee => {
        if(employee.full_name == promptAnswers.action)
            manager = employee.id;
    });

    let employees = await db.query(`
        SELECT 
            employee.id,
            employee.first_name,
            employee.last_name,
            employeeRole.title,
            department.name,
            employeeRole.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM \`employee\`
            LEFT JOIN \`role\` AS employeeRole 
                ON employee.role_id = employeeRole.id 
            LEFT JOIN \`department\` AS department 
                ON employeeRole.department_id = department.id 
            LEFT JOIN \`employee\` AS manager 
                ON employee.manager_id = manager.id 
        WHERE manager.id="${manager}"
    `);

    if(employees.length == 0) {
        console.log("This employee is not a manager!");
    } else
        console.table(employees);
}

//function to add new employees and insert them into the database 
async function addEmployees() {
    let titleChoice = await db.query("SELECT id, title FROM role");
    let titles = titleChoice.map(itemObj=>itemObj.title);
    let managers = await db.query(`
    SELECT 
        employee.id,
        CONCAT(employee.first_name, ' ', employee.last_name) as full_name
    FROM \`employee\`
`);

    promptAnswers = await inquirer.prompt([
        { name: 'first_name', type: 'input', message: "\nWhat is the employee's first name?" },
        { name: 'last_name', type: 'input', message: "\nWhat is the employee's last name?" },
        { name: 'title', type: 'list', message: "\nWhat is the employee's role",choices: titles },
        { name: 'Manager', type: 'list', message: "\nWho is the employee's manager",choices: managers.map(manager => manager.full_name) }
    ]);

    let manager;
    managers.forEach(employee => {
        if(employee.full_name == promptAnswers.Manager)
            manager = employee.id;
    });

    let role;
    titleChoice.forEach(title => {
        if(title.title == promptAnswers.title)
        role = title.id;
    });


    await db.query( "INSERT INTO employee (`first_name`,`last_name`,`role_id`,`manager_id`) VALUES(?,?,?,?)", [promptAnswers.first_name, promptAnswers.last_name, role, manager] );
}

//function to add new departments and insert them into the database 
async function addDepartments(){
    promptAnswers = await inquirer.prompt([
        { name: 'department', type: 'input', message: "\nWhat is the department's name?" },
    ]);
    await db.query("INSERT INTO department (`name`) VALUES(?)", [promptAnswers.department]);
}

//function to add new roles and insert them into the database 
async function addRole(){

    let departmentChoice = await db.query("SELECT id,name FROM department");
    let departments = departmentChoice.map(itemObj=>itemObj.name);

    promptAnswers = await inquirer.prompt([
        { name: 'title', type: 'input', message: "\nWhat is the name of the new role?" },
        { name: 'salary', type: 'number', message: "\nWhat is the salary?"},
        { name: 'department', type: 'list', message: "\nWhat is the department's name?",choices: departments}
    ]);
    let departmentId;
    departmentChoice.forEach(department => {
        if(department.name == promptAnswers.department)
        departmentId = department.id;
    });

    await db.query("INSERT INTO role (`title`,`salary`,`department_id`) VALUES(?,?,?)", [promptAnswers.title,promptAnswers.salary,departmentId]);
}

//function to remove employees based on user choice and delete them from the database
async function removeEmployees() {
    let employees = await db.query(`
    SELECT 
        employee.id,
        CONCAT(employee.first_name, ' ', employee.last_name) as full_name
    FROM \`employee\`
`);
promptAnswers = await inquirer.prompt([
    { name: 'employee', type: 'list', message: "\nWhich employee do you want to remove?",choices: employees.map(employee => employee.full_name) }
]);

let employee;
    employees.forEach(employeeid => {
        if(employeeid.full_name == promptAnswers.employee)
            employee = employeeid.id;
    });


await db.query("DELETE FROM employee WHERE id =?", employee);
}

//function to remove departments based on user choice and delete them from the database
async function removeDepartment(){

    let departmentChoice = await db.query("SELECT id,name FROM department");
    let departments = departmentChoice.map(itemObj=>itemObj.name);

    promptAnswers = await inquirer.prompt([
        { name: 'department', type: 'list', message: "\nSelect the department that you would like to remove?",choices: departments}
    ]);

    await db.query("DELETE FROM department WHERE name =?", promptAnswers.department);
}

async function removeRole(){

    let titleChoice = await db.query("SELECT id, title FROM role");
    let titles = titleChoice.map(itemObj=>itemObj.title); 

    promptAnswers = await inquirer.prompt([
        { name: 'title', type: 'list', message: "\nSelect the role that you would like to remove?",choices:titles}
    ]);

    await db.query("DELETE FROM role WHERE title =?", promptAnswers.title);

}

//function to update employees existing role and push the update to the database
async function updateEmployeeRole() {
    let employees = await db.query(`
    SELECT 
        employee.id,
        CONCAT(employee.first_name, ' ', employee.last_name) as full_name
    FROM \`employee\`
`);
let titleChoice = await db.query("SELECT id, title FROM role");
let titles = titleChoice.map(itemObj=>itemObj.title);

promptAnswers = await inquirer.prompt([
    { name: 'employee', type: 'list', message: "\nSelect the employee to update the role",choices: employees.map(employee => employee.full_name) },
    { name: 'title', type: 'list', message: "\nWhat is the employee's new role",choices: titles },

]);

let employee;
    employees.forEach(employeeid => {
        if(employeeid.full_name == promptAnswers.employee)
            employee = employeeid.id;
    });

    let role;
    titleChoice.forEach(title => {
        if(title.title == promptAnswers.title)
        role = title.id;
    });

await db.query(`UPDATE employee SET role_id=${role} WHERE id=${employee}`);

}

//function to update employees current manager and push the update to the database
async function updateEmployeeManager() {
    let employees = await db.query(`
        SELECT 
            employee.id,
            CONCAT(employee.first_name, ' ', employee.last_name) as full_name
        FROM \`employee\`
    `);

    promptAnswers = await inquirer.prompt([
        { name: 'employee', type: 'list', message: "\nSelect the employee to update the manager",choices: employees.map(employee => employee.full_name) },
        { name: 'Manager', type: 'list', message: "\nWho is the employee's new manager",choices: employees.map(employee => employee.full_name) },

    ]);

    let Manager;
        employees.forEach(employeeid => {
            if(employeeid.full_name == promptAnswers.Manager)
                Manager = employeeid.id;
        });

    let employee;
        employees.forEach(employeeid => {
            if(employeeid.full_name == promptAnswers.employee)
                employee = employeeid.id;
        });


    await db.query(`UPDATE employee SET manager_id=${Manager} WHERE id=${employee}`); 
}

//function to View the total utilized budget of a department i.e. the combined salaries of all employees in that department
async function utilizedBudget(){
    let departmentChoice = await db.query("SELECT id,name FROM department");
    let departments = departmentChoice.map(itemObj=>itemObj.name);

    promptAnswers = await inquirer.prompt([
        { name: 'department', type: 'list', message: "\nSelect the department to view the total utilized budget:",choices: departments}
    ]);

    let budget = await db.query(`SELECT department.name, SUM(employeeRole.salary) as total FROM employee 
	LEFT JOIN role AS employeeRole ON employee.role_id = employeeRole.id 
	LEFT JOIN department AS department ON employeeRole.department_id = department.id 
    WHERE department.name="${promptAnswers.department}" GROUP BY department.name`);
    
    console.table(budget);

}
// function to quit the application
async function quit() {
    process.exit();
}

//object with list of function calls to perform specific actions based on user selection from prompts
const actions = {
    "View All Employees": viewEmployees,
    "View All Departments":viewDepartments,
    "View All Roles":viewRoles,
    "View All Employees By Department": viewAllEmployeesByDepartment,
    "View All Employees by Manager": viewAllEmployeesbyManager,
    "Add Employees": addEmployees,
    "Add Departments": addDepartments,
    "Add a Role":addRole,
    "Remove Employees": removeEmployees,
    "Remove a Role":removeRole,
    "Remove a Department":removeDepartment,
    "Update Employee Role": updateEmployeeRole,
    "Update Employee Manager": updateEmployeeManager,
    "View Total Utilized budget for a department":utilizedBudget,
    "Quit": quit
};

//function to prompt user to select the action they would like to perform
async function main(){
    let promptAnswers = await inquirer.prompt([ 
        { name: 'action', type: 'list', message: 'What do you want to do?',
        choices: Choices }
    ]);  
    clearConsole();
    let userChoice = promptAnswers.action;
    await actions[userChoice]();
    main();
}

// at top INIT DB connection
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "anjalipant123",
    database: "EmployeeTracker"
}); 

main();