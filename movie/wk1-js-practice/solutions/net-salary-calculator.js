function calculateNetSalary(basicSalary, benefits) {

  const NSSF_RATE = 0.06; // 6% of gross salary
  const NHIF_RATES = [
    { max: 5999, deduction: 150 },
    { max: 7999, deduction: 300 },
    { max: 11999, deduction: 400 },
    { max: 14999, deduction: 500 },
    { max: 19999, deduction: 600 },
    { max: 24999, deduction: 750 },
    { max: 29999, deduction: 850 },
    { max: 34999, deduction: 900 },
    { max: 39999, deduction: 950 },
    { max: 44999, deduction: 1000 },
    { max: 49999, deduction: 1100 },
    { max: 59999, deduction: 1200 },
    { max: 69999, deduction: 1300 },
    { max: 79999, deduction: 1400 },
    { max: 89999, deduction: 1500 },
    { max: 99999, deduction: 1600 },
    { max: Infinity, deduction: 1700 }
  ];

  const TAX_RATES = [
    { max: 24000, rate: 0.1 },
    { max: 32333, rate: 0.25 },
    { max: 500000, rate: 0.3 },
    { max: 800000, rate: 0.325 },
    { max: Infinity, rate: 0.35 }
  ];

  // Calculate Gross Salary
  const grossSalary = basicSalary + benefits;

  // Calculate NSSF Deduction (Tier 1)
  const nssfDeduction = grossSalary * NSSF_RATE;

  // Calculate NHIF Deduction
  let nhifDeduction = 0;
  for (let bracket of NHIF_RATES) {
    if (grossSalary <= bracket.max) {
      nhifDeduction = bracket.deduction;
      break;
    }
  }

  // Calculate PAYE (Tax)
  let taxableIncome = grossSalary - nssfDeduction;
  let payee = 0;
  let previousBracket = 0;

  for (let bracket of TAX_RATES) {
    if (taxableIncome > previousBracket) {
      let taxableAmount = Math.min(taxableIncome - previousBracket, bracket.max - previousBracket);
      payee += taxableAmount * bracket.rate;
    } else {
      break;
    }
    previousBracket = bracket.max;
  }

  // Net Salary Calculation
  const netSalary = grossSalary - (payee + nhifDeduction + nssfDeduction);

  // Display results
  console.log(`Gross Salary: Ksh ${grossSalary}`);
  console.log(`PAYE (Tax): Ksh ${payee.toFixed(2)}`);
  console.log(`NHIF Deduction: Ksh ${nhifDeduction}`);
  console.log(`NSSF Deduction: Ksh ${nssfDeduction.toFixed(2)}`);
  console.log(`Net Salary: Ksh ${netSalary.toFixed(2)}`);
}

// Get user input
const basicSalary = Number(prompt("Enter your Basic Salary:"));
const benefits = Number(prompt("Enter your Benefits:"));

// Validate input
if (isNaN(basicSalary) || isNaN(benefits) || basicSalary < 0 || benefits < 0) {
  console.log("Invalid input! Please enter valid numbers.");
} else {
  calculateNetSalary(basicSalary, benefits);
}