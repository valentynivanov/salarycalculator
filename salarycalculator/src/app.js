import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {calculateTakeHome, calculateUKTax, scrollWithOffset} from './helpers.js'

Chart.register(ChartDataLabels);



// Set active state based on current page URL (for when navigating between pages)
function setActiveBasedOnUrl() {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.nav-link a').forEach(link => {
        const href = link.getAttribute('href');

        if (
            href === currentPath ||
            (href === '/' && currentPath === '/') ||
            currentPath.endsWith(href)
        ) {
            link.parentElement.classList.add('active');
        }
    });
}

      
// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    
    console.log('Page loaded, initializing...');
    setActiveBasedOnUrl()
    // Handle active states and navigation
        document.querySelectorAll('.nav-link a').forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked link's parent
                this.parentElement.classList.add('active');
                
                // Close mobile menu after selection
                document.getElementById('mobileMenu').classList.remove('active');
            });
        });
    // Mobile menu
    const toggleBtn = document.getElementById('toggle-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            toggleBtn.textContent = '✕';
        } else {
            toggleBtn.textContent = '☰';
        }
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        const mobileMenu = document.getElementById('mobileMenu');
        const toggle = document.querySelector('.mobile-menu-toggle');
                
        if (!navbar.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    // FAQ section
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            const toggle = question.querySelector('.faq-toggle');

            // Toggle active class on question and answer
            question.classList.toggle('active');
            answer.classList.toggle('active');

            // Update toggle symbol
            toggle.textContent = question.classList.contains('active') ? '−' : '+';
        });
    });
});

const currentPage = document.body.id;

if (currentPage === "home") {
    console.log('Home page loaded')
  // home page logic
} else if (currentPage === "salary-to-hourly") {

        document.getElementById('calculate-hourly').addEventListener('click', calculateHourly)

    // Toggle comparison inputs for salary-to-hourly
        document.getElementById('compare-salaries').addEventListener('change', function() {
            document.getElementById('comparison-inputs').style.display = 
                this.checked ? 'block' : 'none';
        });
  
        // Salary to Hourly Calculator
        function calculateHourly() {
            const salary = parseFloat(document.getElementById('annual-salary').value);
            const hours = parseFloat(document.getElementById('weekly-hours').value);
            const showAfterTax = document.getElementById('show-after-tax').checked;
            const compareSalaries = document.getElementById('compare-salaries').checked;
            
            if (!salary || !hours) {
                alert('Please enter both salary and weekly hours');
                return;
            }
            
            const weeksPerYear = 52;
            const hourlyRate = salary / (hours * weeksPerYear);
            
            let results = `
                <div class="results">
                    <h3>Salary Analysis</h3>
                    <div class="result-item">
                        <span class="result-label">Hourly Rate (Gross)</span>
                        <span class="result-value">£${hourlyRate.toFixed(2)}</span>
                    </div>
            `;
            
            if (showAfterTax) {
                // Rough after-tax calculation (simplified)
                const estimatedTakeHome = calculateTakeHome(salary);
                const afterTaxHourly = estimatedTakeHome / (hours * weeksPerYear);
                results += `
                    <div class="result-item">
                        <span class="result-label">Hourly Rate (After Tax - Est.)</span>
                        <span class="result-value">£${afterTaxHourly.toFixed(2)}</span>
                    </div>
                `;
            }
            
            results += `</div>`;
            
            if (compareSalaries) {
                const salary2 = parseFloat(document.getElementById('annual-salary-2').value);
                const hours2 = parseFloat(document.getElementById('weekly-hours-2').value);
                
                if (salary2 && hours2) {
                    const hourlyRate2 = salary2 / (hours2 * weeksPerYear);
                    const difference = hourlyRate2 - hourlyRate;
                    const percentDiff = ((hourlyRate2 - hourlyRate) / hourlyRate * 100).toFixed(1);
                    
                    results += `
                        <div class="comparison">
                            <div class="comparison-card">
                                <h4>First Salary</h4>
                                <p>£${salary.toLocaleString()} / year</p>
                                <p>${hours} hours/week</p>
                                <p><strong>£${hourlyRate.toFixed(2)}/hour</strong></p>
                            </div>
                            <div class="comparison-card">
                                <h4>Second salary</h4>
                                <p>£${salary2.toLocaleString()} / year</p>
                                <p>${hours2} hours/week</p>
                                <p><strong>£${hourlyRate2.toFixed(2)}/hour</strong></p>
                            </div>
                        </div>
                        <div class="results">
                            <div class="result-item">
                                <span class="result-label">Hourly Rate Difference</span>
                                <span class="result-value ${difference >= 0 ? '' : 'text-danger'}">
                                    ${difference >= 0 ? '+' : ''}£${difference.toFixed(2)} (${percentDiff}%)
                                </span>
                            </div>
                        </div>
                    `;
                }
            }
            
            document.getElementById('hourly-results').innerHTML = results;
            scrollWithOffset('hourly-results');
        }

  
} else if (currentPage === 'take-home-pay'){
        document.getElementById('calculate-tax').addEventListener('click', calculateTax)

        // Toggle comparison inputs for take-home-pay
        document.getElementById('take-home-pay-compare-salaries').addEventListener('change', function() {
            document.getElementById('take-home-pay-comparison').style.display = 
                this.checked ? 'block' : 'none';
        });

        // Tax Calculator
        function calculateTax() {
            const salary = parseFloat(document.getElementById('tax-salary').value);
            const age = document.getElementById('age').value;
            const pensionPercent = parseFloat(document.getElementById('pension-percent').value) || 0;
            const studentLoan = document.getElementById('student-loan').value;
            const compareSalaries = document.getElementById('take-home-pay-compare-salaries').checked;
            
            if (!salary) {
                alert('Please enter your salary');
                return;
            }
            
            const taxCalc = calculateUKTax(salary, age, pensionPercent, studentLoan);
            const yearRate = taxCalc.takeHome;
            const monthRate = (taxCalc.takeHome / 12);
            const taxRate = taxCalc.taxRate.toFixed(1);
            let taxresults = `
                <div class="results">
                    <h3>Annual Breakdown</h3>
                    <div class="result-item">
                        <span class="result-label">Gross Salary</span>
                        <span class="result-value income">£${salary.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Income Tax</span>
                        <span class="result-value expenses">-£${taxCalc.incomeTax.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">National Insurance</span>
                        <span class="result-value expenses">-£${taxCalc.nationalInsurance.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pension Contribution</span>
                        <span class="result-value expenses">-£${taxCalc.pension.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Student Loan</span>
                        <span class="result-value expenses">-£${taxCalc.studentLoan.toFixed(2)}</span>
                    </div>
                    <div class="result-item" style="border-top: 2px solid #3498db; padding-top: 15px; margin-top: 15px;">
                        <span class="result-label"><strong>Annual Take-Home</strong></span>
                        <span class="result-value income" style="font-size: 1.3rem;">£${taxCalc.takeHome.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label"><strong>Monthly Take-Home</strong></span>
                        <span class="result-value income" style="font-size: 1.3rem;">£${(taxCalc.takeHome / 12).toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Tax Rate</span>
                        <span class="result-value expenses">${taxCalc.taxRate.toFixed(1)}%</span>
                    </div>
                </div>
            `;
            
            if(compareSalaries){
                const salary2 = parseFloat(document.getElementById('tax-salary-2').value);
                const age2 = document.getElementById('age-2').value;
                const pensionPercent2 = parseFloat(document.getElementById('pension-percent-2').value) || 0;
                const studentLoan2 = document.getElementById('student-loan-2').value;

                if (!salary2) {
                    alert('Please enter your second salary');
                    return;
                }
                
                const taxCalc2 = calculateUKTax(salary2, age2, pensionPercent2, studentLoan2);
                
                const yearRate2 = taxCalc2.takeHome;
                const monthRate2 = (taxCalc2.takeHome / 12);
                const taxRate2 = taxCalc2.taxRate.toFixed(1);

                const yearDifference = (yearRate2 - yearRate);
                const monthDifference = (monthRate2 - monthRate);
                const taxRateDifference = Math.abs(taxRate2 - taxRate);
                
                const yearPercentDiff = Math.abs((yearRate2 - yearRate) / yearRate * 100).toFixed(2);
                const monthPercentDiff = Math.abs((monthRate2 - monthRate) / monthRate * 100).toFixed(2);
                const taxRatePercentDiff = Math.abs((taxRate2 - taxRate) / taxRate * 100).toFixed(1);

                taxresults += `
                <div class="results">
                    <h3 style="text-align:center;">Second Salary</h3>
                    <h3>Annual Breakdown</h3>
                    <div class="result-item">
                        <span class="result-label">Gross Salary</span>
                        <span class="result-value income">£${salary2.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Income Tax</span>
                        <span class="result-value expenses">-£${taxCalc2.incomeTax.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">National Insurance</span>
                        <span class="result-value expenses">-£${taxCalc2.nationalInsurance.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pension Contribution</span>
                        <span class="result-value expenses">-£${taxCalc2.pension.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Student Loan</span>
                        <span class="result-value expenses">-£${taxCalc2.studentLoan.toFixed(2)}</span>
                    </div>
                    <div class="result-item" style="border-top: 2px solid #3498db; padding-top: 15px; margin-top: 15px;">
                        <span class="result-label"><strong>Annual Take-Home</strong></span>
                        <span class="result-value income" style="font-size: 1.3rem;">£${taxCalc2.takeHome.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label"><strong>Monthly Take-Home</strong></span>
                        <span class="result-value income" style="font-size: 1.3rem;">£${(taxCalc2.takeHome / 12).toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Tax Rate</span>
                        <span class="result-value expenses">${taxCalc2.taxRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="results">
                            <div class="result-item">
                                <span class="result-label">Annual Difference</span>
                                <span class="result-value ${yearDifference >= 0 ? 'income': "expenses"}">
                                   ${yearDifference >= 0 ? '+': '-'}£${Math.abs(yearDifference.toFixed(2))} (${yearPercentDiff}%)
                                </span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Monthly Difference</span>
                                <span class="result-value ${monthDifference >= 0 ? 'income': "expenses"}">
                                    ${monthDifference >= 0 ? '+': '-'}£${Math.abs(monthDifference.toFixed(2))} (${monthPercentDiff}%)
                                </span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Tax Rate Difference</span>
                                <span class="result-value expenses">
                                    ${taxRateDifference.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                `;
            }

            document.getElementById('tax-results').innerHTML = taxresults;
            scrollWithOffset('tax-results');
        }

} else {
    document.getElementById('calculate-budget').addEventListener('click', calculateBudget);

    const addBtn = document.getElementById('add-expense-btn');
    const saveBtn = document.getElementById('save-expense-btn');
    const deleteBtn = document.getElementById('delete-expense-btn');

    addBtn.addEventListener('click', addExpense);
    saveBtn.addEventListener('click', saveExpense);
    deleteBtn.addEventListener('click', deleteExtraExpenses);

    let idCounter = 1;
    let currentEditableId = null;

    function addExpense() {
        if (currentEditableId) {
            alert("Please save the current expense before adding another.");
            return;
        }

    const uid = `expense-${idCounter++}`;
    currentEditableId = uid;

    const div = document.createElement('div');
    div.id = uid;
    div.className = 'form-group';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Enter expense';
    labelInput.id = `${uid}-label`;

    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.placeholder = '300';
    numberInput.min = '0';
    numberInput.id = `${uid}-number`;

    div.appendChild(labelInput);
    div.appendChild(numberInput);

    document.getElementById('budget-categories').appendChild(div);

    saveBtn.style.display = 'block';
    addBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
}

function saveExpense() {
    if (!currentEditableId) return alert("Please add an expense first.");

    const labelInput = document.getElementById(`${currentEditableId}-label`);
    const numberInput = document.getElementById(`${currentEditableId}-number`);

    const userLabel = labelInput.value.trim();
    const userNumber = numberInput.value.trim();

    if (!userLabel || !userNumber) return alert("Please enter both label and number.");

    const savedId = `saved-${currentEditableId}`;
    const div = document.createElement('div');
    div.className = 'form-group';
    div.id = savedId;

    const label = document.createElement('label');
    label.textContent = userLabel;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = userNumber;
    input.readOnly = true;

    div.appendChild(label);
    div.appendChild(input);

    document.getElementById('budget-categories').appendChild(div);

    // Remove the editable input
    deleteExpense(currentEditableId);
    currentEditableId = null;

    saveBtn.style.display = 'none';
    addBtn.style.display = 'block';
    updateDeleteButton();
}

function deleteExpense(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
    updateDeleteButton();
}

function deleteExtraExpenses() {
    const element = document.querySelector('.form-group:last-child')
    if(element){
        element.remove()
    }
    updateDeleteButton();
}

function updateDeleteButton() {
    const all = document.querySelectorAll('#budget-categories .form-group');
    deleteBtn.style.display = all.length === 0 ? 'none' : 'block';
}

    // Budget Calculator
    function calculateBudget() {

        const allInputs = document.querySelectorAll('#budget-categories input[type="number"]');
        if (allInputs.length < 2) {
            alert("At least 2 expenses are required to calculate.");
            return;
        }
        const income = parseFloat(document.getElementById('monthly-income').value);
        if (!income) {
            alert('Please enter your monthly income');
            return;
        }

        // 1. Get hardcoded expenses
        const hardcodedFields = [
            { id: 'rent-mortgage', label: 'Rent/Mortgage', color: '#3498db' },
            { id: 'utilities', label: 'Utilities', color: '#9b59b6' },
            { id: 'food-groceries', label: 'Food & Groceries', color: '#e74c3c' },
            { id: 'transport', label: 'Transport', color: '#f39c12' },
            { id: 'insurance', label: 'Insurance', color: '#34495e' },
            { id: 'entertainment', label: 'Entertainment', color: '#1abc9c' },
            { id: 'savings', label: 'Savings', color: '#27ae60' },
            { id: 'subscriptions', label: 'Subscriptions', color: '#b43bb4ff' },
            { id: 'other-expenses', label: 'Other', color: '#95a5a6' }
        ];

        const chartData = [];
        let totalExpenses = 0;

        // Add hardcoded values
        for (const field of hardcodedFields) {
            const value = parseFloat(document.getElementById(field.id)?.value) || 0;
            if (value > 0) {
                chartData.push({ label: field.label, value, color: field.color });
                totalExpenses += value;
            }
        }

        // 2. Add custom saved expenses
        const savedGroups = document.querySelectorAll('#budget-categories .form-group[id^="saved-"]');
        savedGroups.forEach(group => {
            const label = group.querySelector('label')?.textContent.trim();
            const value = parseFloat(group.querySelector('input')?.value) || 0;
            const color = getRandomColor();
            if (value > 0) {
                chartData.push({ label, value, color });
                totalExpenses += value;
            }
        });

        // 3. Enforce minimum 2 expenses
        if (chartData.length < 2) {
            alert("Please make sure you have at least 2 expense categories to calculate the budget.");
            return;
        }

        const remaining = income - totalExpenses;
        const isOverspending = remaining < 0;

        // 4. Build results safely
        const resultsContainer = document.getElementById('budget-results');
        resultsContainer.innerHTML = '';

        const summary = document.createElement('div');
        summary.className = 'results';
        summary.innerHTML = `<h3>Budget Summary</h3>`;
        summary.appendChild(createResultItem('Monthly Income', `+£${income.toLocaleString()}`, 'income'));
        summary.appendChild(createResultItem('Total Expenses', `-£${totalExpenses.toLocaleString()}`, 'expenses'));

        const balance = createResultItem(
            isOverspending ? 'Budget Deficit' : 'Remaining Budget',
            `${isOverspending ? '-' : '+'}£${Math.abs(remaining).toLocaleString()}`,
            '',
            isOverspending ? '#e74c3c' : '#27ae60',
            true
        );
        summary.appendChild(balance);
        resultsContainer.appendChild(summary);

        if (isOverspending) {
            const warning = document.createElement('div');
            warning.className = 'warning';
            warning.innerHTML = `<strong>⚠️ Budget Alert:</strong> You're overspending by £${Math.abs(remaining).toLocaleString()} per month. Consider reducing expenses or finding additional income sources.`;
            resultsContainer.appendChild(warning);
        }

        // 5. Expenses Breakdown
        const breakdown = document.createElement('div');
        breakdown.className = 'results';
        breakdown.innerHTML = `<h3>Expenses Breakdown</h3>`;

        chartData.forEach(item => {
            breakdown.appendChild(
                createResultItem(
                    item.label,
                    `£${item.value.toLocaleString()} (${((item.value / income) * 100).toFixed(1)}%)`,
                    '',
                    item.color
                )
            );
        });
        resultsContainer.appendChild(breakdown);

        // 6. Create chart
        const existingCanvas = document.getElementById('pieChart');
        if (existingCanvas) existingCanvas.remove();

        const canvas = document.createElement('canvas');
        canvas.id = 'pieChart';
        const chartContainer = document.createElement('div');
        chartContainer.id = 'chartContainer'
        chartContainer.appendChild(canvas)
        resultsContainer.appendChild(chartContainer);

        const labels = chartData.map(item => item.label);
        const values = chartData.map(item => item.value);
        const colors = chartData.map(item => item.color);

        const data = {
            labels,
            datasets: [{
                label: 'Expenses Breakdown',
                data: values,
                backgroundColor: colors
            }]
        };

        const isMobile = window.innerWidth < 768;

        const config = {
            type: 'pie',
            data,
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 20
                },
                plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                    weight: 'bold',
                    size: 14
                    },
                    formatter: (value, ctx) => {
                        const total = ctx.chart.data.datasets[0].data
                            .reduce((a, b) => a + b, 0) || 1;
                        const percent = (value / total) * 100;

                        // Hide labels if slice is < 10% (change to 5 if needed)
                        if (percent < 5) {
                            return '';
                        }

                        return `£${value.toLocaleString()}\n(${percent.toFixed(1)}%)`;
                    },
                    backgroundColor: (ctx) => {
                        const total = ctx.chart.data.datasets[0].data
                            .reduce((a, b) => a + b, 0);
                        const sliceValue = ctx.dataset.data[ctx.dataIndex];
                        const percent = (sliceValue / total) * 100;
                        return percent >= 5 ? 'rgba(0,0,0,0.5)' : null;
                    },
                    anchor:  'center', // Changed to 'center' to position labels closer to the slice
                    align: isMobile ? 'end' : 'center', // Aligns labels outside the slice
                    offset: isMobile ? 5 : 30, // Increased offset to move labels further out
                    clamp: false, // Allow labels to extend beyond chart area
                    clip: false, // Prevent clipping to ensure labels are visible
                    borderRadius: 4,
                    padding: 6,
                    textAlign: 'center',
                    rotation: 0 // Removed dynamic rotation to keep labels right-side up
                },
                legend: {
                    position: 'bottom',
                    labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    usePointStyle: true,
                    boxWidth: 20,
                    padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                    label: ctx => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const percent = ((ctx.raw / total) * 100).toFixed(1);
                        return `${ctx.label}: £${ctx.raw.toLocaleString()} (${percent}%)`;
                    }
                    }
                }
                }
            }
        };

        new Chart(canvas, config);
        scrollWithOffset('budget-results');
}

    // Helper to build each result item
    function createResultItem(labelText, valueText, valueClass = '', color = '', isTotal = false) {
        const item = document.createElement('div');
        item.className = 'result-item';
        if (isTotal) {
            item.style.borderTop = `2px solid ${color}`;
            item.style.paddingTop = '15px';
        }

        const label = document.createElement('span');
        label.className = 'result-label';
        if (color) {
            const box = document.createElement('span');
            box.style.cssText = `display:inline-block;width:12px;height:12px;background:${color};border-radius:2px;margin-right:8px;`;
            label.appendChild(box);
        }
        label.appendChild(document.createTextNode(labelText));

        const value = document.createElement('span');
        value.className = 'result-value';
        if (valueClass) value.classList.add(valueClass);
        if (color && isTotal) value.style.color = color;
        if (isTotal) value.style.fontSize = '1.3rem';
        value.textContent = valueText;

        item.appendChild(label);
        item.appendChild(value);
        return item;
    }

    function getRandomColor() {
        const palette = ['#f39c12', '#8e44ad', '#e74c3c', '#16a085', '#c0392b', '#2980b9', '#2ecc71', '#d35400'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

}



        