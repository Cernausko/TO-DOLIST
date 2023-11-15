// Paskutinio redagavimo laikas
const lastModified = {
    dateTime: ''
};

document.getElementById('addbutton').addEventListener('click', function () {

    const taskTitle = document.getElementById('TITLE').value;
    const priority = document.getElementById('p-pick').value;
    const dueDate = document.getElementById('pdate').value;

    const tableBody = document.querySelector('tbody');
    const newRow = tableBody.insertRow();

    newRow.lastModified = {
        dateTime: ''
    };

    newRow.innerHTML = `
        <td scope="row"><img class="table-icons document" src="img/first.svg"></td>
        <td><div class="cBtn d-flex align-items-center"><img class="pt-1 table-icons check" src="img/not-ck.svg"><p class="title">${taskTitle}</p></div></td>
        <td scope="row" class="priority" onclick="changePriority(this)">
            <div class="${getPriorityClass(priority)}">${getPriorityText(priority)}</div>
        </td>
        <td scope="row">${dueDate}</td>
        <td scope="row" class="align-middle status new">New</td>
        <td scope="row" class="procents">
            <div class="row align-items-center">
                <div class="col-2"><p class="m-0 progress-text">0% </p></div>
                <div class="col-10">
                    <div class="progress">
                        <div class="progress-bar green" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </td>
        <td scope="row" class="date">${newRow.lastModified.dateTime}</td>
        <td scope="row"><button type="button" class="text-center btn btn-danger deletebutton ">Pašalinti</button></td>
    `;

    document.getElementById('TITLE').value = '';
    document.getElementById('p-pick').value = '1';
    document.getElementById('pdate').value = '';

    const deleteBtn = newRow.querySelector('.deletebutton');
    deleteBtn.addEventListener('click', function () {
        tableBody.removeChild(newRow);
    });

    const titleDiv = newRow.querySelector('.title');
    const checkIcon = newRow.querySelector('.check');
    const progressCell = newRow.querySelector('.procents');
    const statusCell = newRow.querySelector('.status');

    titleDiv.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
    });

    checkIcon.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
    });

    progressCell.addEventListener('click', function () {
        const newProgress = prompt('PARAŠYKITE KIEK PROCENTU ESATE ATLIKES DARBĄ:', progressCell.querySelector('.progress-text').textContent.replace('%', ''));
        if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
            updateProgress(newProgress);
            updateLastModified(newRow);
        }
    });

    function updateProgress(newProgress) {
        const progressText = progressCell.querySelector('.progress-text');
        const progressBar = progressCell.querySelector('.progress-bar');

        progressText.textContent = newProgress + '%';
        progressBar.style.width = newProgress + '%';

        statusCell.textContent = newProgress === '100' ? 'Completed' : (newProgress === '0' ? 'New' : 'In progress');
        statusCell.className = `status ${newProgress === '100' ? 'completed' : (newProgress === '0' ? 'new' : 'incomplete')}`;

        titleDiv.classList.remove('completed-title');
        const checkIcon = newRow.querySelector('.check');
        if (newProgress === '100') {
            titleDiv.classList.add('completed-title');
            checkIcon.src = 'img/ck.svg';
        } else {
            titleDiv.classList.remove('completed-title');
            checkIcon.src = 'img/not-ck.svg';
        }
    }
});

function toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell) {
    if (!titleDiv.classList.contains('completed-title')) {
        titleDiv.classList.add('completed-title');
        checkIcon.src = 'img/ck.svg';
        statusCell.textContent = 'Completed';
        progressCell.querySelector('.progress-text').textContent = '100%';
        progressCell.querySelector('.progress-bar').style.width = '100%';
        statusCell.className = 'status completed';
    } else {
        titleDiv.classList.remove('completed-title');
        checkIcon.src = 'img/not-ck.svg';
        statusCell.textContent = progressCell.querySelector('.progress-text').textContent === '0%' ? 'New' : 'In progress';
        const currentProgress = parseInt(progressCell.querySelector('.progress-text').textContent);
        progressCell.querySelector('.progress-bar').style.width = currentProgress + '%';
        statusCell.className = `status ${progressCell.querySelector('.progress-text').textContent === '0%' ? 'new' : 'incomplete'}`;
    }
}

function changePriority(cell) {
    const currentPriority = cell.querySelector('div').textContent;

    const prioritySelect = document.createElement('select');
    prioritySelect.classList.add('form-select');
    prioritySelect.innerHTML = `
        <option value="1">Low</option>
        <option value="2">Normal</option>
        <option value="3">High</option>
    `;
    prioritySelect.value = getPriorityValue(currentPriority);

    // Checkinam ar paspausta ant mygtuko
    prioritySelect.addEventListener('change', function () {
        const newPriority = prioritySelect.value;
        cell.innerHTML = `<div class="${getPriorityClass(newPriority)}">${getPriorityText(newPriority)}</div>`;
        updateLastModified(cell.closest('tr'));
    });

    cell.innerHTML = '';
    cell.appendChild(prioritySelect);
}

function updateLastModified(row) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const period = now.getHours() >= 12 ? 'PM' : 'AM';
    const dateTime = `${month}/${day}/${year} ${hour}:${minute} ${period}`;
    row.lastModified.dateTime = dateTime;
    row.querySelector('.date').textContent = dateTime;
}



function getPriorityValue(priorityText) {
    switch (priorityText) {
        case 'Low':
            return '1';
        case 'Normal':
            return '2';
        case 'High':
            return '3';
        default:
            return '';
    }
}

function getPriorityText(priority) {
    switch (priority) {
        case '1':
            return 'Low';
        case '2':
            return 'Normal';
        case '3':
            return 'High';
        default:
            return '';
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case '1':
            return 'low';
        case '2':
            return 'normal';
        case '3':
            return 'high';
        default:
            return '';
    }
}
