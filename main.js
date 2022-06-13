const taskBoxTitle = document.getElementById('new-task-box-title');
const taskBoxDate = document.getElementById('new-task-box-date');
const taskBtn = document.getElementById('new-task-btn');
const taskList = document.getElementById('task-list');
const showType = document.getElementById('show-type');
const pbar = document.getElementById('pbar');
const pbarText = document.getElementById('pbar-text');

let todoAppData = JSON.parse(localStorage.getItem("todoAppData") || "[]");

const showTask = () => {
    let taskTotal = todoAppData.length;
    let taskComplete = 0;
    let html = '';
    for (let i = 0; i < todoAppData.length; i++) {
        const task = todoAppData[i];
        let ck = ' ';
        let strikeStart = ' ';
        let strikeEnd = ' ';
        if (task.isComplete) {
            taskComplete++;
            ck += "checked";
            strikeStart = "<s>";
            strikeEnd = "</s>";
        }
        if (showType.value == 'active' && task.isComplete)
            continue;
        if (showType.value == 'completed' && !task.isComplete)
            continue;
        html += `
                <div class="flex-center task">
                    <input onclick="checkBoxHandler(event)" type="checkbox" id="checkbox-${task.tid}"${ck}>
                    <p>${strikeStart}${task.title}${strikeEnd}</p>
                    <p>${new Date(task.date).toDateString()}</p>
                    <button class="danger" onclick="deletebtnHandler(event)" id="deletebtn-${task.tid}">Delete Task</button>
                </div>
            `;
    }
    taskList.innerHTML = html;
    //Avoid divide by 0 error
    if (taskTotal != 0) pbar.value = Math.floor((taskComplete * 100) / taskTotal);
    else pbar.value = 0
    pbarText.innerHTML = ` ${taskComplete} of ${taskTotal} task completed`;
}


const deletebtnHandler = (e) => {
    const tid = e.target.id.split('-')[1];
    todoAppData = todoAppData.filter((task) => task.tid != tid);
    showTask();
}

// update task as complete or not
const checkBoxHandler = (e) => {
    const tid = e.target.id.split('-')[1];
    for (let i = 0; i < todoAppData.length; i++) {
        if (todoAppData[i].tid == tid) {
            todoAppData[i].isComplete = e.target.checked;
            break;
        }
    }
    showTask();
}

const btnClickHandler = () => {
    const tid = Date.now();
    let title = taskBoxTitle.value;
    let date = taskBoxDate.value;
    let isComplete = false;
    // if no date was selected set today
    if (date.length == 0)
        date = new Date().toISOString().split('T')[0];
    todoAppData.push({ tid, title, date, isComplete });

    // Reset input field and btn
    taskBoxTitle.value = "";
    taskBtn.classList.remove("enabled");
    taskBtn.classList.add("disabled");
    taskBtn.disabled = true;

    showTask();
}


// Enable "Add Task" btn only when input has some text
const updateTaskBtn = (e) => {
    if (e.target.value.length == 0) {
        taskBtn.classList.remove("enabled");
        taskBtn.classList.add("disabled");
        taskBtn.disabled = true;
    }

    else {
        taskBtn.classList.remove("disabled");
        taskBtn.classList.add("enabled");
        taskBtn.disabled = false;
    }

}


taskBtn.disabled = true;
// Set default date to today
taskBoxDate.value = new Date().toISOString().split('T')[0];
taskBtn.addEventListener("click", btnClickHandler);
taskBoxTitle.addEventListener('input', updateTaskBtn);
showType.addEventListener('change', showTask);

//sync data to storage before page unloads
window.addEventListener("beforeunload", () => {
    localStorage.setItem("todoAppData", JSON.stringify(todoAppData));
});

showTask();