const buttonLimit = document.querySelector('.button-limit');
const buttonAdd = document.querySelector('.button-add');
const buttonClear = document.querySelector('.button-clear');
const buttonChart = document.querySelector('.button-chart');
const filter = document.querySelector('.filter');

const table = document.querySelector('.table');
const thead = document.querySelector('.thead');
const tbody = table.querySelector('.tbody');

const sortButtons = thead.querySelectorAll('.th-button');
const popupChart = document.querySelector('.popup-diagram');
const popupChartClose = popupChart.querySelector('.button-close');
const popupLimit = document.querySelector('.popup-limit');
const formLimit = popupLimit.querySelector('.form');
const formLimitClose = formLimit.querySelector('.button-close');
const popupAdd = document.querySelector('.popup-add');
const formAdd = popupAdd.querySelector('.form');
const formAddClose = formAdd.querySelector('.button-close');
const template = document.querySelector('.template');

const caloriesEl = document.querySelector('.calories');
const proteinsEl = document.querySelector('.proteins');
const fatsEl = document.querySelector('.fats');
const carbsEl = document.querySelector('.carbs');
caloriesEl.textContent = 0;
proteinsEl.textContent = 0;
fatsEl.textContent = 0;
carbsEl.textContent = 0;

const maxCalories = document.querySelector('.max-calories');
const totalCalories = document.querySelector('.total-calories');

let caloriesCounter = 0;
let proteinsCounter = 0;
let fatsCounter = 0;
let carbsCounter = 0;

window.addEventListener('DOMContentLoaded', () => {
    const rows = localStorage.getItem('rows');
    const limit = localStorage.getItem('limit');
    if(rows) {
        JSON.parse(rows).forEach(row => {
            createRow(row)
            updateTotal(row)
        })
    }
    if(limit) {
        maxCalories.textContent = limit;
    }
})

filter.addEventListener('input', () => {
    const text = filter.value;
    filterRows(text);
})

sortButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-direction') === 'descending') {
            sortData(e.target.id, 'descending');
            e.target.setAttribute('data-direction', 'ascending');
        } else {
            sortData(e.target.id, 'ascending');
            e.target.setAttribute('data-direction', 'descending');
        }
    })
})

buttonClear.addEventListener('click', () => {
    tbody.innerHTML = '';
    localStorage.setItem('rows', '[]');
    caloriesEl.textContent = 0;
    proteinsEl.textContent = 0;
    fatsEl.textContent = 0;
    carbsEl.textContent = 0;
    caloriesCounter = 0;
    proteinsCounter = 0;
    fatsCounter = 0;
    carbsCounter = 0;
})

buttonLimit.addEventListener('click', () => {
    popupLimit.showModal();
})
formLimitClose.addEventListener('click', () => {
    popupLimit.close()
})
formLimit.addEventListener('submit', () => {
    const calLim = formLimit.querySelector('.input').value;

    maxCalories.textContent = calLim;
    saveLimit(calLim);

    formLimit.querySelector('.input').value = '';
})

buttonAdd.addEventListener('click', () => {
    popupAdd.showModal();
})
formAddClose.addEventListener('click', () => {
    popupAdd.close();
})
formAdd.addEventListener('submit', () => {
    const formData = new FormData(formAdd);
    const formDataObject = Object.fromEntries(formData);
    createRow(formDataObject);
    updateTotal(formDataObject);
    saveRow(formDataObject);
    const inputs = formAdd.querySelectorAll('.input');
    inputs.forEach(input => {
        input.value = '';
    })
})

function createRow(data) {
    const row = template.content.querySelector('.row').cloneNode(true);
    const name = row.querySelector('[data="name"]');
    const calories = row.querySelector('[data="calories"]');
    const proteins = row.querySelector('[data="proteins"]');
    const fats = row.querySelector('[data="fats"]');
    const carbs = row.querySelector('[data="carbs"]');

    name.textContent = data.name;
    calories.textContent = data.calories;
    proteins.textContent = data.proteins;
    fats.textContent = data.fats;
    carbs.textContent = data.carbs;

    tbody.appendChild(row);

    const deleteButton = row.querySelector('.button-delete');
    deleteButton.addEventListener('click', deleteRow)
}

function deleteRow(e) {
    const row = e.target.closest('tr');
    const name = row.querySelector('[data="name"]').textContent;
    const calories = -row.querySelector('[data="calories"]').textContent;
    const proteins = -row.querySelector('[data="proteins"]').textContent;
    const fats = -row.querySelector('[data="fats"]').textContent;
    const carbs = -row.querySelector('[data="carbs"]').textContent;

    const data = { name, calories, proteins, fats, carbs };
    updateTotal(data);
    deleteSavedRow(data);

    row.innerHTML = '';
}

function saveRow(data) {
    let rows = localStorage.getItem('rows');
    const rowData = {
        name: data.name,
        calories: data.calories,
        proteins: data.proteins,
        fats: data.fats,
        carbs: data.carbs
    }
    if (!rows) {
        rows = [];
    } else {
        rows = JSON.parse(rows);
    }
    rows.push(rowData);
    localStorage.setItem('rows', JSON.stringify(rows));
}

function deleteSavedRow(data) {
    let rows = JSON.parse(localStorage.getItem('rows'));
    const rowToDelete = rows.find(row => {
        return row.name === data.name && row.calories === data.calories;
    })
    const index = rows.indexOf(rowToDelete);
    rows.splice(index, 1);

    localStorage.setItem('rows', JSON.stringify(rows));
}

function saveLimit(lim) {
    localStorage.setItem('limit', lim);
}

function updateTotal(data) {
    caloriesCounter += parseInt(data.calories);
    proteinsCounter += parseInt(data.proteins);
    fatsCounter += parseInt(data.fats);
    carbsCounter += parseInt(data.carbs);

    caloriesEl.textContent = caloriesCounter;
    proteinsEl.textContent = proteinsCounter;
    fatsEl.textContent = fatsCounter;
    carbsEl.textContent = carbsCounter;
    totalCalories.textContent = caloriesCounter;

    checkLimit();
}

function checkLimit() {
    const maxCal = parseInt(maxCalories.textContent);
    const totalCal = parseInt(totalCalories.textContent);
    if (maxCal < totalCal) {
        alert('Вы превысили дневной лимит калорий')
    } else {
        return
    }
}

buttonChart.addEventListener('click', () => {
    popupChart.showModal();
    drawChart();
})

popupChartClose.addEventListener('click', () => {
    popupChart.close();
})

function filterRows(text) {
    const rows = tbody.querySelectorAll('.row');
    rows.forEach(row => {
        const name = row.querySelector('[data="name"]').textContent;
        if(!name.toLowerCase().includes(text.toLowerCase())){
            row.classList.add('hidden');
        } else {
            row.classList.remove('hidden');
        }
    })
}

function drawChart() {
    const columnProtein = document.querySelector('.column-proteins');
    const columnFats = document.querySelector('.column-fats');
    const columnCarbs = document.querySelector('.column-carbs');

    columnProtein.textContent = proteinsCounter;
    columnFats.textContent = fatsCounter;
    columnCarbs.textContent = carbsCounter;

    if (proteinsCounter > 150 || fatsCounter > 150 || carbsCounter > 150) {
        columnProtein.style.height = `${proteinsCounter}px`;
        columnFats.style.height = `${fatsCounter}px`;
        columnCarbs.style.height = `${carbsCounter}px`;

    } else {
        columnProtein.style.height = `${proteinsCounter * 2}px`;
        columnFats.style.height = `${fatsCounter * 2}px`;
        columnCarbs.style.height = `${carbsCounter * 2}px`;
    }
}

function sortData( id, direction = 'ascending') {
    const data = JSON.parse(localStorage.getItem('rows'));
    tbody.innerHTML = '';
    function sort() {
        if (direction === 'ascending') {
            return [...data].sort(function (a, b) {
                if (a[id] < b[id]) {
                    return -1;
                }
                if (a[id] > b[id]) {
                    return 1;
                }
                return 0;
            })
        } else {
            return [...data].sort(function (a, b) {
                if (b[id] < a[id]) {
                    return -1;
                }
                if (b[id] > a[id]) {
                    return 1;
                }
                return 0;
            })
        }
    }
    const sortedData = sort();
    sortedData.forEach(item => {
        createRow(item)
    })
}