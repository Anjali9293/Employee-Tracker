# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Description

The scope of this project was to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

## Table of Contents

* [Technologies](#technologies)
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Questions](#questions)

## Technologies

- JavaScript
- NodeJs
- Inquirer
- MySQl
- Console.table

## Installation

Install Inquirer package, console.table and mysql within package.json file using `npm install` command.

The dependencies are below:

* Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

Design the following database schema containing three tables:

## Usage

* Application allows users to add departments,roles and employees.
* Application allows users to view departments,roles and employees in the form of tables
* Application allows user to update employees existing role/title
* Application allows  user to update employee's existing manager
* Application allows user to delete departments,roles and employees.
* Application allows user to View the total utilized budget of a department -- ie the combined salaries of all employees in that department


![Database Schema](/Assets/snapshots/schema.png)

![User Prompts](/Assets/snapshots/userprompts.PNG)

![View Employees](/Assets/snapshots/viewemployees.PNG)

![View Departments](/Assets/snapshots/viewdepartments.PNG)

![View Roles](/Assets/snapshots/viewroles.PNG)

![View employees by Department](/Assets/snapshots/viewemployeebydptmnt.PNG)

![View employees by Manager](/Assets/snapshots/viewembymanager.PNG)

Click the link below to watch how the application works:

[Video Link](https://youtu.be/lFHZ7SNGBXk)

![Video demo](/Assets/snapshots/employeeTracker.gif)

## Credits

**[Anjali Pant](https://github.com/Anjali9293)**

## License 

```
Copyright 2020 <Anjali Pant>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Questions

For more questions about this project, click the link below to view my Github repo:

- [GitHub Profile](https://github.com/Anjali9293)

You can also reach me directly at: pantanjali7@gmail.com
