function showPage(pageId) {
            // Hide all pages
            document.getElementById('home-page').style.display = 'none';
            document.querySelectorAll('.calculator-page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            if (pageId === 'home') {
                document.getElementById('home-page').style.display = 'block';
            } else {
                document.getElementById(pageId).classList.add('active');
            }
        }

        // Toggle comparison inputs for salary-to-hourly
        document.getElementById('compare-salaries').addEventListener('change', function() {
            document.getElementById('comparison-inputs').style.display = 
                this.checked ? 'block' : 'none';
        });

        // Toggle comparison inputs for tax-calculator
        document.getElementById('tax-calculator-compare-salaries').addEventListener('change', function() {
            document.getElementById('tax-calculator-comparison').style.display = 
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
                                <h4>Job 1</h4>
                                <p>£${salary.toLocaleString()} / year</p>
                                <p>${hours} hours/week</p>
                                <p><strong>£${hourlyRate.toFixed(2)}/hour</strong></p>
                            </div>
                            <div class="comparison-card">
                                <h4>Job 2</h4>
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
        }

        // Tax Calculator
        function calculateTax() {
            const salary = parseFloat(document.getElementById('tax-salary').value);
            const age = document.getElementById('age').value;
            const pensionPercent = parseFloat(document.getElementById('pension-percent').value) || 0;
            const studentLoan = document.getElementById('student-loan').value;
            const compareSalaries = document.getElementById('tax-calculator-compare-salaries').checked;
            
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
                        <span class="result-value">£${salary.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Income Tax</span>
                        <span class="result-value">-£${taxCalc.incomeTax.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">National Insurance</span>
                        <span class="result-value">-£${taxCalc.nationalInsurance.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pension Contribution</span>
                        <span class="result-value">-£${taxCalc.pension.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Student Loan</span>
                        <span class="result-value">-£${taxCalc.studentLoan.toFixed(2)}</span>
                    </div>
                    <div class="result-item" style="border-top: 2px solid #3498db; padding-top: 15px; margin-top: 15px;">
                        <span class="result-label"><strong>Annual Take-Home</strong></span>
                        <span class="result-value" style="font-size: 1.3rem;">£${taxCalc.takeHome.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label"><strong>Monthly Take-Home</strong></span>
                        <span class="result-value" style="font-size: 1.3rem;">£${(taxCalc.takeHome / 12).toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Tax Rate</span>
                        <span class="result-value">${taxCalc.taxRate.toFixed(1)}%</span>
                    </div>
                </div>
            `;
            
            if(compareSalaries){
                const salary2 = parseFloat(document.getElementById('tax-salary-2').value);
                const age2 = document.getElementById('age-2').value;
                const pensionPercent2 = parseFloat(document.getElementById('pension-percent-2').value) || 0;
                const studentLoan2 = document.getElementById('student-loan-2').value;

                if (!salary2) {
                    alert('Please enter your salary');
                    return;
                }
                
                const taxCalc2 = calculateUKTax(salary2, age2, pensionPercent2, studentLoan2);

                const yearRate2 = taxCalc2.takeHome;
                const monthRate2 = (taxCalc2.takeHome / 12);
                const taxRate2 = taxCalc2.taxRate.toFixed(1);

                const yearDifference = Math.abs(yearRate - yearRate2);
                const monthDifference = Math.abs(monthRate - monthRate2);
                const taxRateDifference = Math.abs(taxRate - taxRate2);
                
                const yearPercentDiff = Math.abs((yearRate2 - yearRate) / yearRate * 100).toFixed(2);
                const monthPercentDiff = Math.abs((monthRate2 - monthRate) / monthRate * 100).toFixed(2);
                const taxRatePercentDiff = Math.abs((taxRate2 - taxRate) / taxRate * 100).toFixed(1);

                taxresults += `
                <div class="results">
                    <h3 style="text-align:center;">Second Salary</h3>
                    <h3>Annual Breakdown</h3>
                    <div class="result-item">
                        <span class="result-label">Gross Salary</span>
                        <span class="result-value">£${salary2.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Income Tax</span>
                        <span class="result-value">-£${taxCalc2.incomeTax.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">National Insurance</span>
                        <span class="result-value">-£${taxCalc2.nationalInsurance.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pension Contribution</span>
                        <span class="result-value">-£${taxCalc2.pension.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Student Loan</span>
                        <span class="result-value">-£${taxCalc2.studentLoan.toFixed(2)}</span>
                    </div>
                    <div class="result-item" style="border-top: 2px solid #3498db; padding-top: 15px; margin-top: 15px;">
                        <span class="result-label"><strong>Annual Take-Home</strong></span>
                        <span class="result-value" style="font-size: 1.3rem;">£${taxCalc2.takeHome.toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label"><strong>Monthly Take-Home</strong></span>
                        <span class="result-value" style="font-size: 1.3rem;">£${(taxCalc2.takeHome / 12).toFixed(2)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Tax Rate</span>
                        <span class="result-value">${taxCalc2.taxRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="results">
                            <div class="result-item">
                                <span class="result-label">Year Difference</span>
                                <span class="result-value">
                                   £${yearDifference.toFixed(2)} (${yearPercentDiff}%)
                                </span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Month Difference</span>
                                <span class="result-value">
                                    £${monthDifference.toFixed(2)} (${monthPercentDiff}%)
                                </span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Tax Rate Difference</span>
                                <span class="result-value">
                                    %${taxRateDifference.toFixed(2)} (${taxRatePercentDiff}%)
                                </span>
                            </div>
                        </div>
                `;
            }

            document.getElementById('tax-results').innerHTML = taxresults;
        }

        // Budget Calculator
        function calculateBudget() {
            const income = parseFloat(document.getElementById('monthly-income').value);
            
            if (!income) {
                alert('Please enter your monthly income');
                return;
            }
            
            const expenses = {
                rent: parseFloat(document.getElementById('rent-mortgage').value) || 0,
                utilities: parseFloat(document.getElementById('utilities').value) || 0,
                food: parseFloat(document.getElementById('food-groceries').value) || 0,
                transport: parseFloat(document.getElementById('transport').value) || 0,
                insurance: parseFloat(document.getElementById('insurance').value) || 0,
                entertainment: parseFloat(document.getElementById('entertainment').value) || 0,
                savings: parseFloat(document.getElementById('savings').value) || 0,
                other: parseFloat(document.getElementById('other-expenses').value) || 0
            };
            
            const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
            const remaining = income - totalExpenses;
            const isOverspending = remaining < 0;
            
            let results = `
                <div class="results">
                    <h3>Budget Summary</h3>
                    <div class="result-item">
                        <span class="result-label">Monthly Income</span>
                        <span class="result-value">£${income.toLocaleString()}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Total Expenses</span>
                        <span class="result-value">£${totalExpenses.toLocaleString()}</span>
                    </div>
                    <div class="result-item" style="border-top: 2px solid ${isOverspending ? '#e74c3c' : '#27ae60'}; padding-top: 15px;">
                        <span class="result-label"><strong>${isOverspending ? 'Budget Deficit' : 'Remaining Budget'}</strong></span>
                        <span class="result-value" style="color: ${isOverspending ? '#e74c3c' : '#27ae60'}; font-size: 1.3rem;">
                            ${isOverspending ? '-' : ''}£${Math.abs(remaining).toLocaleString()}
                        </span>
                    </div>
                </div>
            `;
            
            if (isOverspending) {
                results += `
                    <div class="warning">
                        <strong>⚠️ Budget Alert:</strong> You're overspending by £${Math.abs(remaining).toLocaleString()} per month. 
                        Consider reducing expenses or finding additional income sources.
                    </div>
                `;
            }
            
            // Simple pie chart representation
            const chartData = [
                { label: 'Rent/Mortgage', value: expenses.rent, color: '#3498db' },
                { label: 'Food & Groceries', value: expenses.food, color: '#e74c3c' },
                { label: 'Transport', value: expenses.transport, color: '#f39c12' },
                { label: 'Utilities', value: expenses.utilities, color: '#9b59b6' },
                { label: 'Entertainment', value: expenses.entertainment, color: '#1abc9c' },
                { label: 'Savings', value: expenses.savings, color: '#27ae60' },
                { label: 'Insurance', value: expenses.insurance, color: '#34495e' },
                { label: 'Other', value: expenses.other, color: '#95a5a6' },
                { label: 'Remaining', value: Math.max(0, remaining), color: '#2ecc71' }
            ].filter(item => item.value > 0);
            
            results += `
                <div class="results">
                    <h3>Expense Breakdown</h3>
                    ${chartData.map(item => `
                        <div class="result-item">
                            <span class="result-label">
                                <span style="display: inline-block; width: 12px; height: 12px; background: ${item.color}; border-radius: 2px; margin-right: 8px;"></span>
                                ${item.label}
                            </span>
                            <span class="result-value">£${item.value.toLocaleString()} (${((item.value / income) * 100).toFixed(1)}%)</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            document.getElementById('budget-results').innerHTML = results;
        }

        // Helper functions
        function calculateTakeHome(salary) {
            // Simplified tax calculation for estimation
            const taxCalc = calculateUKTax(salary, 'under-state-pension', 0, 'none');
            return taxCalc.takeHome;
        }

        function calculateUKTax(salary, age, pensionPercent, studentLoan) {
            // 2025/26 tax year rates
            const personalAllowance = 12570;
            const basicRateLimit = 50270;
            const higherRateLimit = 125140;
            
            // Income Tax
            let incomeTax = 0;
            if (salary > personalAllowance) {
                const taxableIncome = salary - personalAllowance;
                
                if (taxableIncome <= (basicRateLimit - personalAllowance)) {
                    incomeTax = taxableIncome * 0.20;
                } else if (salary <= higherRateLimit) {
                    incomeTax = (basicRateLimit - personalAllowance) * 0.20 + 
                               (salary - basicRateLimit) * 0.40;
                } else {
                    incomeTax = (basicRateLimit - personalAllowance) * 0.20 + 
                               (higherRateLimit - basicRateLimit) * 0.40 +
                               (salary - higherRateLimit) * 0.45;
                }
            }
            
            // National Insurance
            const niLowerLimit = 12570;
            const niUpperLimit = 50270;
            let nationalInsurance = 0;
            
            if (salary > niLowerLimit && age === 'under-state-pension') {
                if (salary <= niUpperLimit) {
                    nationalInsurance = (salary - niLowerLimit) * 0.08;
                } else {
                    nationalInsurance = (niUpperLimit - niLowerLimit) * 0.08 + 
                                       (salary - niUpperLimit) * 0.02;
                }
            }
            
            // Pension
            const pension = salary * (pensionPercent / 100);
            
            // Student Loan
            let studentLoanRepayment = 0;
            if (studentLoan !== 'none') {
                let threshold;
                let rate;
                
                switch (studentLoan) {
                    case 'plan1':
                        threshold = 22015;
                        rate = 0.09;
                        break;
                    case 'plan2':
                        threshold = 27295;
                        rate = 0.09;
                        break;
                    case 'postgrad':
                        threshold = 21000;
                        rate = 0.06;
                        break;
                }
                
                if (salary > threshold) {
                    studentLoanRepayment = (salary - threshold) * rate;
                }
            }
            
            const takeHome = salary - incomeTax - nationalInsurance - pension - studentLoanRepayment;
            const taxRate = ((incomeTax + nationalInsurance + studentLoanRepayment) / salary) * 100;
            
            return {
                incomeTax: incomeTax,
                nationalInsurance: nationalInsurance,
                pension: pension,
                studentLoan: studentLoanRepayment,
                takeHome: takeHome,
                taxRate: taxRate
            };
        }