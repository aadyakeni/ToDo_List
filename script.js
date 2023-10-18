const taskIn = document.querySelector(".taskin input");
filters = document.querySelectorAll(".filter span");
taskBox = document.querySelector(".taskbox");
clearAll = document.querySelector(".clear")

let editId;
let isEditedTask = false;

//getting local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () =>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter){

    let li = "";

    if(todos){
        todos.forEach((todo, id) => {
            //if checked then isCompleted is set to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";

            if (filter == todo.status || filter == 'all') {
                li += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onClick="showMenu(this)" class="ri-list-settings-line"></i>
                        <ul class="menu">
                            <li onclick="editTask(${id} , '${todo.name}')"><i class="ri-edit-line"></i>Edit</li>
                            <li onclick="deleteTask(${id})"><i class="ri-delete-bin-line"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }

            
    });
    }

    taskBox.innerHTML = li || "<span>You don't have any tasks here</span>";

}
showTodo("all");

function editTask(taskId, taskName){
    editId = taskId;
    taskIn.value = taskName;
    isEditedTask = true;
}

function deleteTask(deleteId){
    //removing selected task from array
    todos.splice(deleteId,1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", ()=> {
    //removing all task from array
    todos.splice(0 , todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e=>{
        //removing show class from task on click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask){

    //getting para of last task name
    let taskName = selectedTask.parentElement.lastElementChild;

    if (selectedTask.checked) {
        taskName.classList.add("checked");
        //updating the task to completed
        todos[selectedTask.id].status = "completed";
    } else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskIn.addEventListener("keyup" , e =>{
    let userTask = taskIn.value.trim();
    if (e.key == 'Enter' && userTask) {

        if (!isEditedTask) {

            if (!todos) { //if todos dont exist , pass an empty array to todos
                todos = [];
            }

            let taskInfo = {name: userTask , status: "pending"};
            todos.push(taskInfo); //adding new tasks to todos

        }else{
            isEditedTask = false; 
            todos[editId].name=userTask;
        }

        

        taskIn.value="";
        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});