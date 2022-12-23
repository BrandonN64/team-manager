const inquirer = require('inquirer')
const fs = require('fs')

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const htmlHead = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <header class="p-5 bg-info text-white text-center">
        <h1>Team Members</h1>
    </header>
    <main class="row">\n`;
const htmlFoot =
`    </main>
    
</body>
</html>`;

let body = ``;

const doQuestions = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "employeePosition",
            message: "What is the position of the employee",
            choices: ["Manager", "Engineer", "Intern"]
        },
        {
            type: "input",
            name: "name",
            message: "What is the name of the employee"
        },
        {
            type: "number",
            name: "id",
            message: "What is the ID for the Employee?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the email for the Employee?"
        },
        {
            type: "number",
            name: "officeNumber",
            message: "What is the office number of the employee?",
            when(answeredQuestions) {
                return answeredQuestions.employeeType === "Manager";
            }
        },
        {
            type: "input",
            name: "github",
            message: "What is their your github username?",
            when(answeredQuestions) {
                return answeredQuestions.employeeType === "Engineer";
            }
        },
        {
            type: "input",
            name: "school",
            message: "What is the name of the school you attend?",
            when(answeredQuestions) {
                return answeredQuestions.employeeType === "Intern";
            }
        }
    ]).then((answer) => {
        const { name, id, email, employeeType } = answer;
        let employee;
        switch(employeeType){
            case "Manager":
                employee = new Manager(name, id, email, answer.officeNumber);
                break;
            case "Engineer":
                employee = new Engineer(name, id, email, answer.github);
                break;
            case "Intern":
                employee = new Intern(name, id, email, answer.school);
                break;
        }
        createHTML(employee);
        anoterPersonCreation();
    });
}
const anoterPersonCreation = () => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Do you need to add another employee?"
        }
    ]).then((answer) => {
        if (answer.continue) {
            doQuestions();
        } else {
            createFile();
        }
    });
}
const createHTML = (employee) => {
    let row2 = `Email: <a href="mailto:${employee.getEmail()}">${employee.getEmail()}</a>`
    let row3;
    switch(employee.getRole()){
        case "Manager":
            row3 = `Office Number: ${employee.getOfficeNumber()}`;
            break;
        case "Engineer":
            row3 = `Github: <a href="https://github.com/${employee.getGithub()}">${employee.getGithub()}</a>`;
            break;
        case "Intern":
            row3 = `School: ${employee.getSchool()}`;
            break;
    }
    body += createCard(employee.getName(), employee.getRole(), "ID: " + employee.getId(), row2, row3);
}
const createCard = (name, role, row1, row2, row3) => {
    let employeeInformationDiv = 
`<div class="card text-white col-4">
    <div class="card-header bg-primary">
        <h2 class="card-title">${name}</h1>
        <p class="card-text">${role}</p>
    </div>
    <div class="card-body container text-black">
        <p class="card-footer">${row1}</p>
        <p class="card-footer">${row2}</p>
        <p class="card-footer">${row3}</p>
    </div>
</div>\n`;
    return employeeInformationDiv; 
}
const createFile = () => {
    const output = htmlHead + body + htmlFoot;
    fs.writeFile("./dist/index.html", output, (error) => 
    error ? console.error(error) : console.log("sucess"));
}
doQuestions();