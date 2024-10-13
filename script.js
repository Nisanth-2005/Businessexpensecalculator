let workersData = {};
let expensesData = {};

// Show section based on the menu selection
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Add worker fields dynamically
function addWorkerFields() {
    const numWorkers = document.getElementById('numWorkers').value;
    const container = document.getElementById('workersContainer');
    container.innerHTML = ''; // Clear previous entries

    for (let i = 0; i < numWorkers; i++) {
        container.innerHTML += `
            <div>
                <label>Worker ${i + 1} ID: </label>
                <input type="text" id="workerId${i}">
                <label>Kilograms Worked: </label>
                <input type="number" id="workerKg${i}" step="0.01" min="0">
                <label>Work Description: </label>
                <input type="text" id="workerWork${i}">
            </div>`;
    }
}

// Calculate wages based on the work done (kg) and price per kilogram
function calculateWages() {
    const wageDate = document.getElementById('wageDate').value;
    const numWorkers = document.getElementById('numWorkers').value;
    const pricePerKg = parseFloat(document.getElementById('pricePerKg').value);
    let totalWages = 0;
    let workers = [];

    if (isNaN(pricePerKg) || pricePerKg <= 0) {
        alert("Please enter a valid price per kilogram.");
        return;
    }

    for (let i = 0; i < numWorkers; i++) {
        const id = document.getElementById(`workerId${i}`).value;
        const kgWorked = parseFloat(document.getElementById(`workerKg${i}`).value);
        const work = document.getElementById(`workerWork${i}`).value;

        if (!isNaN(kgWorked) && kgWorked >= 0) {
            const pay = kgWorked * pricePerKg;
            workers.push({ id, pay, work, kgWorked });
            totalWages += pay;
        } else {
            alert(`Please enter valid kilograms worked for Worker ${i + 1}.`);
            return;
        }
    }

    // Store workers data with the date
    workersData[wageDate] = workers;
    
    // Display results in the table
    const tableBody = document.getElementById('wagesTableBody');
    tableBody.innerHTML = ''; // Clear previous results

    workers.forEach(worker => {
        tableBody.innerHTML += `
            <tr>
                <td>${worker.id}</td>
                <td>${worker.work}</td>
                <td>${worker.kgWorked}</td>
                <td>${worker.pay.toFixed(2)}</td>
            </tr>`;
    });

    document.getElementById('wagesOutput').textContent = `Total Wages: ${totalWages.toFixed(2)}`;
    document.getElementById('wagesTable').style.display = 'table'; // Show table
}

// Add expense and store it by date
function addExpense() {
    const expenseDate = document.getElementById('expenseDate').value;
    const desc = document.getElementById('expenseDesc').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (!isNaN(amount) && desc) {
        if (!expensesData[expenseDate]) {
            expensesData[expenseDate] = [];
        }

        expensesData[expenseDate].push({ desc, amount });

        const list = document.getElementById('expensesList');
        list.innerHTML += `<li>${desc}: ${amount}</li>`;
    }
}

// Calculate total expenses
function calculateExpenses() {
    const expenseDate = document.getElementById('expenseDate').value;
    let totalExpenses = 0;

    if (expensesData[expenseDate]) {
        expensesData[expenseDate].forEach(expense => {
            totalExpenses += expense.amount;
        });
    }

    document.getElementById('expensesOutput').textContent = `Total Expenses: ${totalExpenses}`;
}

// Generate report based on selected date
function generateReport() {
    const reportDate = document.getElementById('reportDate').value;
    let totalWages = 0;
    let report = '';

    if (workersData[reportDate]) {
        workersData[reportDate].forEach(worker => {
            report += `Worker ID: ${worker.id}, Work: ${worker.kgWorked} kg, Pay: ${worker.pay.toFixed(2)}\n`;
            totalWages += worker.pay;
        });
    }

    let totalExpenses = 0;
    if (expensesData[reportDate]) {
        expensesData[reportDate].forEach(expense => {
            totalExpenses += expense.amount;
        });
    }

    document.getElementById('reportOutput').textContent = `Total Wages: ${totalWages.toFixed(2)}\n\n${report}\nTotal Expenses: ${totalExpenses.toFixed(2)}`;
}

// Export wages and expenses to Excel
function exportToExcel() {
    const wageDate = document.getElementById('wageDate').value;
    const workers = workersData[wageDate];

    if (!workers || workers.length === 0) {
        alert("No data available to export.");
        return;
    }

    const header = ["Worker ID", "Work Description", "Kilograms Worked", "Pay"];
    const data = workers.map(worker => [worker.id, worker.work, worker.kgWorked, worker.pay.toFixed(2)]);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Wages");

    XLSX.writeFile(workbook, `Daily_Wages_${wageDate}.xlsx`);
}

// Export expenses to Excel
function exportExpensesToExcel() {
    const expenseDate = document.getElementById('expenseDate').value;
    const expenses = expensesData[expenseDate];

    if (!expenses || expenses.length === 0) {
        alert("No data available to export.");
        return;
    }

    const header = ["Description", "Amount"];
    const data = expenses.map(expense => [expense.desc, expense.amount]);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Expenses");

    XLSX.writeFile(workbook, `Daily_Expenses_${expenseDate}.xlsx`);
}
