// lib/financial-utils.ts
/**
 * Utility functions for financial calculations
 */

/**
 * Format a number as Japanese Yen currency
 * 
 * @param amount The amount to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}) {
    const formatter = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options
    });
    
    return formatter.format(amount);
  }
  
  /**
   * Calculate monthly loan payment using standard amortization formula
   * 
   * @param principal Loan principal amount
   * @param annualRate Annual interest rate (in percent, e.g. 5 for 5%)
   * @param years Loan term in years
   * @returns Monthly payment amount
   */
  export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    const x = Math.pow(1 + monthlyRate, numPayments);
    return Math.round((principal * monthlyRate * x) / (x - 1));
  }
  
  /**
   * Generate amortization schedule for a loan
   * 
   * @param principal Loan principal amount
   * @param annualRate Annual interest rate (in percent)
   * @param years Loan term in years
   * @returns Array of monthly payment objects with payment details
   */
  export function generateAmortizationSchedule(principal: number, annualRate: number, years: number) {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
    
    let balance = principal;
    const schedule = [];
    
    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      balance -= principalPayment;
      
      // Handle potential floating-point errors for the last payment
      if (month === numPayments) {
        balance = 0;
      }
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest: schedule.length > 0 
          ? schedule[schedule.length - 1].totalInterest + interestPayment 
          : interestPayment
      });
    }
    
    return schedule;
  }
  
  /**
   * Calculate compound interest over time
   * 
   * @param principal Initial investment
   * @param annualRate Annual interest rate (in percent)
   * @param years Investment term in years
   * @param additionalContributions Monthly additional contributions
   * @param contributionAtBeginning Whether contributions are made at beginning (true) or end (false) of period
   * @returns Final amount after compound interest
   */
  export function calculateCompoundInterest(
    principal: number,
    annualRate: number,
    years: number,
    additionalContributions: number = 0,
    contributionAtBeginning: boolean = false
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    const numMonths = years * 12;
    
    let amount = principal;
    
    for (let month = 1; month <= numMonths; month++) {
      if (contributionAtBeginning) {
        amount += additionalContributions;
      }
      
      amount *= (1 + monthlyRate);
      
      if (!contributionAtBeginning) {
        amount += additionalContributions;
      }
    }
    
    return Math.round(amount);
  }
  
  /**
   * Calculate time to reach a savings goal
   * 
   * @param goal Target amount
   * @param initialAmount Starting amount
   * @param monthlyContribution Monthly contribution amount
   * @param annualRate Annual interest rate (in percent)
   * @returns Number of months to reach goal or null if goal isn't reached in 100 years
   */
  export function calculateTimeToReachGoal(
    goal: number,
    initialAmount: number,
    monthlyContribution: number,
    annualRate: number
  ): number | null {
    const monthlyRate = annualRate / 100 / 12;
    const maxMonths = 1200; // 100 years
    
    let amount = initialAmount;
    let months = 0;
    
    while (amount < goal && months < maxMonths) {
      amount = amount * (1 + monthlyRate) + monthlyContribution;
      months++;
    }
    
    return months < maxMonths ? months : null;
  }
  
  /**
   * Calculate monthly savings needed to reach a goal
   * 
   * @param goal Target amount
   * @param initialAmount Starting amount
   * @param months Number of months to reach goal
   * @param annualRate Annual interest rate (in percent)
   * @returns Monthly savings amount needed
   */
  export function calculateMonthlySavingsNeeded(
    goal: number,
    initialAmount: number,
    months: number,
    annualRate: number
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    
    if (monthlyRate === 0) {
      return (goal - initialAmount) / months;
    }
    
    const futureValueOfPrincipal = initialAmount * Math.pow(1 + monthlyRate, months);
    const payment = (goal - futureValueOfPrincipal) / 
                    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return Math.round(payment);
  }
  
  /**
   * Calculate net worth over time based on income, expenses, and investments
   * 
   * @param initialNetWorth Starting net worth
   * @param annualIncome Annual income (pre-tax)
   * @param annualExpenses Annual expenses
   * @param taxRate Effective tax rate (in percent)
   * @param annualIncomeGrowth Annual income growth rate (in percent)
   * @param investmentRate Investment return rate (in percent)
   * @param years Number of years to project
   * @returns Array of yearly net worth projections
   */
  export function projectNetWorth(
    initialNetWorth: number,
    annualIncome: number,
    annualExpenses: number,
    taxRate: number,
    annualIncomeGrowth: number,
    investmentRate: number,
    years: number
  ) {
    const projections = [];
    let netWorth = initialNetWorth;
    let yearlyIncome = annualIncome;
    
    for (let year = 1; year <= years; year++) {
      // Calculate after-tax income
      const afterTaxIncome = yearlyIncome * (1 - taxRate / 100);
      
      // Calculate savings
      const savings = afterTaxIncome - annualExpenses;
      
      // Calculate investment returns
      const investmentReturns = netWorth * (investmentRate / 100);
      
      // Update net worth
      netWorth += savings + investmentReturns;
      
      // Increase income for next year
      yearlyIncome *= (1 + annualIncomeGrowth / 100);
      
      projections.push({
        year,
        netWorth: Math.round(netWorth),
        income: Math.round(yearlyIncome),
        afterTaxIncome: Math.round(afterTaxIncome),
        expenses: annualExpenses,
        savings: Math.round(savings),
        investmentReturns: Math.round(investmentReturns)
      });
    }
    
    return projections;
  }
  
  /**
   * Calculate the inflation-adjusted value
   * 
   * @param amount Current amount
   * @param years Number of years
   * @param inflationRate Annual inflation rate (in percent)
   * @returns Inflation-adjusted value
   */
  export function adjustForInflation(amount: number, years: number, inflationRate: number): number {
    return Math.round(amount / Math.pow(1 + inflationRate / 100, years));
  }
  
  /**
   * Calculate tax-adjusted investment returns
   * 
   * @param principal Investment principal
   * @param annualRate Annual return rate (in percent)
   * @param years Investment period in years
   * @param taxRate Capital gains tax rate (in percent)
   * @returns After-tax investment value
   */
  export function calculateAfterTaxInvestment(
    principal: number,
    annualRate: number,
    years: number,
    taxRate: number
  ): number {
    const futureValue = principal * Math.pow(1 + annualRate / 100, years);
    const taxableGain = futureValue - principal;
    const tax = taxableGain * (taxRate / 100);
    
    return Math.round(futureValue - tax);
  }