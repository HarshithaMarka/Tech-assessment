const TASK_API = "http://localhost:8080/tasks";
const PROJECT_API = "http://localhost:8080/projects";


// =============================
// LOAD TASKS
// =============================

async function loadTasks() {

    try {

        const response = await fetch(TASK_API);

        const tasks = await response.json();

        const tableBody =
            document.getElementById("taskTableBody");

        tableBody.innerHTML = "";

        if(tasks.length === 0){

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No Tasks Available
                    </td>
                </tr>
            `;

            return;
        }

        tasks.forEach(task => {

            tableBody.innerHTML += `

                <tr>

                    <td>${task.id}</td>

                    <td>${task.projectName}</td>

                    <td>${task.title}</td>

                    <td>${task.description}</td>

                    <td>${task.assignedTo}</td>

                    <td>${task.priority}</td>

                    <td>${task.status}</td>

                    <td>${task.dueDate}</td>

                </tr>

            `;

        });

    }
    catch(error){

        console.log(error);

    }

}



// =============================
// LOAD PROJECTS
// =============================

async function loadProjects() {

    try {

        const response = await fetch(PROJECT_API);

        const projects = await response.json();

        const projectContainer =
            document.getElementById("projectContainer");

        projectContainer.innerHTML = "";

        projects.forEach(project => {

            projectContainer.innerHTML += `

                <div class="project-card">

                    <h3>${project.name}</h3>

                    <p>${project.description}</p>

                    <span class="project-status">
                        ${project.status}
                    </span>

                </div>

            `;

        });

    }
    catch(error){

        console.log(error);

    }

}



// =============================
// CREATE PROJECT
// =============================

const projectForm =
    document.getElementById("projectForm");

if(projectForm){

    projectForm.addEventListener("submit",
    async function(e){

        e.preventDefault();

        const project = {

            name:
                document.getElementById("projectName").value,

            description:
                document.getElementById("projectDescription").value,

            status:
                document.getElementById("projectStatus").value

        };

        await fetch(PROJECT_API, {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(project)

        });

        projectForm.reset();

        loadProjects();

    });

}



// =============================
// CREATE TASK
// =============================

const taskForm =
    document.getElementById("taskForm");

if(taskForm){

    taskForm.addEventListener("submit",
    async function(e){

        e.preventDefault();

        const task = {

            projectName:
                document.getElementById("taskProject").value,

            title:
                document.getElementById("taskTitle").value,

            description:
                document.getElementById("taskDescription").value,

            assignedTo:
                document.getElementById("assignedTo").value,

            priority:
                document.getElementById("taskPriority").value,

            status:
                document.getElementById("taskStatus").value,

            dueDate:
                document.getElementById("taskDueDate").value

        };

        await fetch(TASK_API, {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(task)

        });

        taskForm.reset();

        loadTasks();

    });

}



// =============================
// INITIAL LOAD
// =============================

loadTasks();

loadProjects();