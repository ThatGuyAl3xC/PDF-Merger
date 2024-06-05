const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('files');
const fileList = document.getElementById('fileList');
const mergeButton = document.getElementById('mergeButton');
const mergeError = document.getElementById('mergeError');
const splitButton = document.getElementById('splitButton');
const splitError = document.getElementById('splitError');
let filesArray = [];

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const newFiles = Array.from(e.dataTransfer.files);
    newFiles.forEach(file => {
        if (!file.name.endsWith('.pdf')) {
            mergeError.textContent = 'Only PDF files are allowed.';
            return;
        }
        filesArray.push(file);
    });
    updateFileList();
});

fileInput.addEventListener('change', () => {
    const newFiles = Array.from(fileInput.files);
    newFiles.forEach(file => {
        if (!file.name.endsWith('.pdf')) {
            mergeError.textContent = 'Only PDF files are allowed.';
            return;
        }
        filesArray.push(file);
    });
    updateFileList();
});

function updateFileList() {
    fileList.innerHTML = '';
    filesArray.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'draggable-item';
        li.draggable = true;
        li.dataset.index = index;

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.addEventListener('click', () => {
            removeFile(index);
        });

        li.appendChild(fileName);
        li.appendChild(removeBtn);
        fileList.appendChild(li);
    });

    addDragAndDropHandlers();
    updateMergeButtonState();
}

function removeFile(index) {
    filesArray.splice(index, 1);
    updateFileList();
}

function addDragAndDropHandlers() {
    const draggables = document.querySelectorAll('.draggable-item');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    fileList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(fileList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            fileList.appendChild(dragging);
        } else {
            fileList.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateMergeButtonState() {
    mergeButton.disabled = filesArray.length === 0;
    if (filesArray.length === 0) {
        mergeError.textContent = 'Please upload at least one PDF file.';
    } else {
        mergeError.textContent = '';
    }
}

document.getElementById('mergeForm').addEventListener('submit', (e) => {
    if (filesArray.length === 0) {
        e.preventDefault();
        mergeError.textContent = 'Please upload at least one PDF file.';
        return;
    }

    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => {
        dataTransfer.items.add(file);
    });
    fileInput.files = dataTransfer.files;

    const order = Array.from(document.querySelectorAll('.draggable-item span')).map(item => item.textContent);
    document.getElementById('fileOrder').value = JSON.stringify(order);
});

document.getElementById('splitForm').addEventListener('submit', (e) => {
    const file = document.getElementById('file').files[0];
    const pages = document.getElementById('pages').value;
    if (!file) {
        e.preventDefault();
        splitError.textContent = 'Please upload a PDF file.';
        return;
    }
    if (!file.name.endsWith('.pdf')) {
        e.preventDefault();
        splitError.textContent = 'Only PDF files are allowed.';
        return;
    }
    if (!pages) {
        e.preventDefault();
        splitError.textContent = 'Please enter pages to extract.';
        return;
    }
    if (!pages.match(/^(\d+,)*\d+$/)) {
        e.preventDefault();
        splitError.textContent = 'Invalid page numbers provided.';
        return;
    }
    splitError.textContent = '';
});