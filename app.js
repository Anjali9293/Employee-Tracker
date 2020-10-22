const inquirer = require( 'inquirer' );
const Database = require('./database.js');

const Choices = [
    "View All Employees",
    "View All Employees By Department",
    "View All Employees by Manager",
    "Add Employees",
    "Remove Employees",
    "Update Employee Role",
    "Update Employee Manager",
    "Quit"
];

function clearConsole() {    
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

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

    console.log(role, titleChoice, promptAnswers.title)

    await db.query( "INSERT INTO employee (`first_name`,`last_name`,`role_id`,`manager_id`) VALUES(?,?,?,?)", [promptAnswers.first_name, promptAnswers.last_name, role, manager] );
}

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

await db.query("DELETE FROM employee WHERE CustomerName='Alfreds Futterkiste';")
}

async function updateEmployeeRole() {
    console.log("Update Employee Role");
}

async function updateEmployeeManager() {
    console.log("Update Employee Manager");
}

async function quit() {
    process.exit();
}

const actions = {
    "View All Employees": viewEmployees,
    "View All Employees By Department": viewAllEmployeesByDepartment,
    "View All Employees by Manager": viewAllEmployeesbyManager,
    "Add Employees": addEmployees,
    "Remove Employees": removeEmployees,
    "Update Employee Role": updateEmployeeRole,
    "Update Employee Manager": updateEmployeeManager,
    "Quit": quit
};

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

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "anjalipant123",
    database: "EmployeeTracker"
}); 

main();