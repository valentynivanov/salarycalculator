        
        
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
                taxRate: taxRate,
            };
        }

        export {calculateTakeHome, calculateUKTax}