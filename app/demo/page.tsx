'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Slider } from '@/src/components/ui/Slider';

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 30,
    income: 400000,
    savings: 2000000,
    housingExpense: 80000,
    foodExpense: 60000,
    utilityExpense: 20000,
    transportationExpense: 15000,
    entertainmentExpense: 30000,
    otherExpense: 40000,
    hasDebt: 'yes',
    debtAmount: 3000000,
    debtInterestRate: 3,
    debtTerm: 10,
    savingsGoal: 10000000,
    investmentRiskTolerance: 'medium',
    timeHorizon: 'medium',
    simulationYears: 5,
    expectedSalaryIncrease: 3,
    expectedInflation: 1.5,
    expectedInvestmentReturn: 4,
  });
  
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes('Rate') ||
        name.includes('Amount') ||
        name === 'income' ||
        name === 'savings' ||
        name === 'age' ||
        name.includes('Expense') ||
        name === 'simulationYears' ||
        name === 'debtTerm' ||
        name === 'savingsGoal'
          ? Number(value)
          : value,
    }));
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate monthly debt payment
  const calculateMonthlyDebtPayment = (
    principal: number,
    interestRate: number,
    years: number
  ) => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    const x = Math.pow(1 + monthlyRate, numPayments);
    return (principal * monthlyRate * x) / (x - 1);
  };

  // Calculate years to reach savings goal
  const calculateYearsToSavingsGoal = (
    currentSavings: number,
    annualContribution: number,
    goal: number,
    annualReturn: number
  ) => {
    let years = 0;
    let savings = currentSavings;
    while (savings < goal && years < 100) {
      savings = savings * (1 + annualReturn / 100) + annualContribution;
      years++;
    }
    return years < 100 ? years : null;
  };

  // Run simulation
  const runSimulation = () => {
    const totalMonthlyExpense =
      formData.housingExpense +
      formData.foodExpense +
      formData.utilityExpense +
      formData.transportationExpense +
      formData.entertainmentExpense +
      formData.otherExpense;
    
    const monthlySavings = formData.income - totalMonthlyExpense;
    const annualSavings = monthlySavings * 12;
    
    const monthlyDebtPayment =
      formData.hasDebt === 'yes'
        ? calculateMonthlyDebtPayment(
            formData.debtAmount,
            formData.debtInterestRate,
            formData.debtTerm
          )
        : 0;
    
    const netMonthlySavings = monthlySavings - monthlyDebtPayment;
    
    const yearlyData = [];
    let currentSavings = formData.savings;
    let currentIncome = formData.income;
    let currentDebtRemaining = formData.hasDebt === 'yes' ? formData.debtAmount : 0;
    
    for (let year = 1; year <= formData.simulationYears; year++) {
      // Increase income
      currentIncome = currentIncome * (1 + formData.expectedSalaryIncrease / 100);
      
      // Debt repayment
      const yearlyDebtPayment = Math.min(monthlyDebtPayment * 12, currentDebtRemaining);
      currentDebtRemaining = Math.max(0, currentDebtRemaining - yearlyDebtPayment);
      
      // Net annual savings after debt repayment
      const yearlyNetSavings = (currentIncome - totalMonthlyExpense) * 12 - yearlyDebtPayment;
      
      // Investment return calculation
      const investmentReturn = currentSavings * (formData.expectedInvestmentReturn / 100);
      
      // Update total savings
      currentSavings = currentSavings + yearlyNetSavings + investmentReturn;
      
      yearlyData.push({
        year,
        income: Math.round(currentIncome * 12),
        expenses: Math.round(totalMonthlyExpense * 12),
        savings: Math.round(yearlyNetSavings),
        investmentReturn: Math.round(investmentReturn),
        totalSavings: Math.round(currentSavings),
        debtRemaining: Math.round(currentDebtRemaining),
        debtPaid: Math.round(yearlyDebtPayment),
      });
    }
    
    const expensesBreakdown = [
      { name: '住居費', value: formData.housingExpense, color: '#8884d8' },
      { name: '食費', value: formData.foodExpense, color: '#83a6ed' },
      { name: '光熱費', value: formData.utilityExpense, color: '#8dd1e1' },
      { name: '交通費', value: formData.transportationExpense, color: '#82ca9d' },
      { name: '娯楽費', value: formData.entertainmentExpense, color: '#a4de6c' },
      { name: 'その他', value: formData.otherExpense, color: '#ffc658' },
    ];
    
    const yearsToSavingsGoal = calculateYearsToSavingsGoal(
      formData.savings,
      netMonthlySavings * 12,
      formData.savingsGoal,
      formData.expectedInvestmentReturn
    );
    
    setSimulationResult({
      income: formData.income,
      totalMonthlyExpense,
      monthlySavings,
      annualSavings,
      monthlyDebtPayment,
      netMonthlySavings,
      yearlyData,
      expensesBreakdown,
      yearsToSavingsGoal,
      totalExpenses: totalMonthlyExpense * 12 * formData.simulationYears,
      totalSavings: yearlyData[formData.simulationYears - 1].totalSavings,
      totalInvestmentReturn: yearlyData.reduce(
        (sum, data) => sum + data.investmentReturn,
        0
      ),
    });
    
    setStep(5);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const resetForm = () => {
    setFormData({
      age: 30,
      income: 400000,
      savings: 2000000,
      housingExpense: 80000,
      foodExpense: 60000,
      utilityExpense: 20000,
      transportationExpense: 15000,
      entertainmentExpense: 30000,
      otherExpense: 40000,
      hasDebt: 'yes',
      debtAmount: 3000000,
      debtInterestRate: 3,
      debtTerm: 10,
      savingsGoal: 10000000,
      investmentRiskTolerance: 'medium',
      timeHorizon: 'medium',
      simulationYears: 5,
      expectedSalaryIncrease: 3,
      expectedInflation: 1.5,
      expectedInvestmentReturn: 4,
    });
    setStep(1);
    setSimulationResult(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">基本情報</h2>
              <p className="text-gray-600">あなたの現在の財務状況を教えてください</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min={18}
                    max={100}
                    className="w-24"
                  />
                  <Slider
                    min={18}
                    max={80}
                    value={formData.age}
                    onChange={(e) =>
                      handleSliderChange('age', parseInt(e.target.value))
                    }
                    className="flex-grow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  月収（手取り・円）
                </label>
                <Input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  現在の貯蓄額（円）
                </label>
                <Input
                  type="number"
                  name="savings"
                  value={formData.savings}
                  onChange={handleChange}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={nextStep}>次へ</Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">月々の支出</h2>
              <p className="text-gray-600">月々の平均的な支出を入力してください</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住居費（円）
                </label>
                <Input
                  type="number"
                  name="housingExpense"
                  value={formData.housingExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  食費（円）
                </label>
                <Input
                  type="number"
                  name="foodExpense"
                  value={formData.foodExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  光熱費（円）
                </label>
                <Input
                  type="number"
                  name="utilityExpense"
                  value={formData.utilityExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  交通費（円）
                </label>
                <Input
                  type="number"
                  name="transportationExpense"
                  value={formData.transportationExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  娯楽費（円）
                </label>
                <Input
                  type="number"
                  name="entertainmentExpense"
                  value={formData.entertainmentExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  その他の支出（円）
                </label>
                <Input
                  type="number"
                  name="otherExpense"
                  value={formData.otherExpense}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                戻る
              </Button>
              <Button onClick={nextStep}>次へ</Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">借金情報</h2>
              <p className="text-gray-600">借金がある場合は詳細を入力してください</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  借金はありますか？
                </label>
                <Select
                  name="hasDebt"
                  value={formData.hasDebt}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="yes">はい</option>
                  <option value="no">いいえ</option>
                </Select>
              </div>
              
              {formData.hasDebt === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      借金の総額（円）
                    </label>
                    <Input
                      type="number"
                      name="debtAmount"
                      value={formData.debtAmount}
                      onChange={handleChange}
                      min={0}
                      step={100000}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      金利（年率 %）
                    </label>
                    <Input
                      type="number"
                      name="debtInterestRate"
                      value={formData.debtInterestRate}
                      onChange={handleChange}
                      min={0}
                      max={20}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      返済期間（年）
                    </label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        name="debtTerm"
                        value={formData.debtTerm}
                        onChange={handleChange}
                        min={1}
                        max={35}
                        className="w-24"
                      />
                      <Slider
                        min={1}
                        max={35}
                        value={formData.debtTerm}
                        onChange={(e) =>
                          handleSliderChange('debtTerm', parseInt(e.target.value))
                        }
                        className="flex-grow"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                戻る
              </Button>
              <Button onClick={nextStep}>次へ</Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">財務目標とシミュレーション設定</h2>
              <p className="text-gray-600">将来的な目標と予測条件を入力してください</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  貯蓄目標額（円）
                </label>
                <Input
                  type="number"
                  name="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={handleChange}
                  min={0}
                  step={1000000}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  投資リスク許容度
                </label>
                <Select
                  name="investmentRiskTolerance"
                  value={formData.investmentRiskTolerance}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="low">低（安全志向）</option>
                  <option value="medium">中（バランス型）</option>
                  <option value="high">高（積極運用型）</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  運用期間の長さ
                </label>
                <Select
                  name="timeHorizon"
                  value={formData.timeHorizon}
                  onChange={handleChange}
                  className="w-full"
                >
                  <option value="short">短期（5年未満）</option>
                  <option value="medium">中期（5〜15年）</option>
                  <option value="long">長期（15年以上）</option>
                </Select>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">シミュレーション設定</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    シミュレーション期間（年）
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      name="simulationYears"
                      value={formData.simulationYears}
                      onChange={handleChange}
                      min={1}
                      max={50}
                      className="w-24"
                    />
                    <Slider
                      min={1}
                      max={30}
                      value={formData.simulationYears}
                      onChange={(e) =>
                        handleSliderChange('simulationYears', parseInt(e.target.value))
                      }
                      className="flex-grow"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    想定年収増加率（%）
                  </label>
                  <Input
                    type="number"
                    name="expectedSalaryIncrease"
                    value={formData.expectedSalaryIncrease}
                    onChange={handleChange}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    想定年間投資収益率（%）
                  </label>
                  <Input
                    type="number"
                    name="expectedInvestmentReturn"
                    value={formData.expectedInvestmentReturn}
                    onChange={handleChange}
                    min={0}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                戻る
              </Button>
              <Button onClick={runSimulation}>シミュレーション実行</Button>
            </div>
          </motion.div>
        );
      case 5:
        if (!simulationResult) return <div>Loading...</div>;
        const { 
          income, 
          totalMonthlyExpense, 
          monthlySavings, 
          annualSavings, 
          monthlyDebtPayment, 
          netMonthlySavings, 
          yearlyData, 
          expensesBreakdown, 
          yearsToSavingsGoal,
          totalExpenses,
          totalSavings,
          totalInvestmentReturn
        } = simulationResult;
        
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">シミュレーション結果</h2>
              <p className="text-gray-600">
                {formData.simulationYears}年間のあなたの財務状況シミュレーションです
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">月間収支</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">収入:</span>
                      <span className="font-medium">¥{income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">支出:</span>
                      <span className="font-medium">¥{totalMonthlyExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">借金返済:</span>
                      <span className="font-medium">¥{monthlyDebtPayment.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900 font-medium">貯蓄:</span>
                      <span className="text-blue-600 font-semibold">¥{netMonthlySavings.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">年間収支</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">年間収入:</span>
                      <span className="font-medium">¥{(income * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">年間支出:</span>
                      <span className="font-medium">¥{(totalMonthlyExpense * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">年間借金返済:</span>
                      <span className="font-medium">¥{(monthlyDebtPayment * 12).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900 font-medium">年間貯蓄:</span>
                      <span className="text-blue-600 font-semibold">¥{(netMonthlySavings * 12).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{formData.simulationYears}年後の資産</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">総貯蓄額:</span>
                      <span className="font-medium">¥{totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">投資リターン分:</span>
                      <span className="font-medium">¥{totalInvestmentReturn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">残債:</span>
                      <span className="font-medium">
                        ¥{(formData.hasDebt === 'yes'
                          ? yearlyData[formData.simulationYears - 1].debtRemaining
                          : 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900 font-medium">目標達成まで:</span>
                      <span className="text-blue-600 font-semibold">
                        {yearsToSavingsGoal ? `約${yearsToSavingsGoal}年` : '100年以上'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>資産推移</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          label={{ value: '年数', position: 'insideBottomRight', offset: -5 }}
                        />
                        <YAxis label={{ value: '金額 (円)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalSavings"
                          name="総資産"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="debtRemaining"
                          name="残債"
                          stroke="#ff8042"
                        />
                        <Line
                          type="monotone"
                          dataKey="investmentReturn"
                          name="投資リターン"
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                onClick={() => {
                  signIn('credentials', {
                    email: 'demo@example.com',
                    password: 'password123',
                    callbackUrl: '/dashboard'
                  });
                }}
                className="px-8 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                無料で始める
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">F</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-600">FinPlanX</h1>
            </Link>
            
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">ログイン</Button>
              </Link>
              <Link href="/register">
                <Button>無料登録</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* コンテンツ */}
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">財務シミュレーション</h1>
            <p className="text-xl text-gray-600">
              あなたの財務状況を入力して、将来の資産形成をシミュレーションしてみましょう
            </p>
          </div>
          
          {/* ステッププログレス */}
          {step < 5 && (
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <div className={step >= 1 ? 'text-blue-600 font-medium' : ''}>基本情報</div>
                <div className={step >= 2 ? 'text-blue-600 font-medium' : ''}>支出</div>
                <div className={step >= 3 ? 'text-blue-600 font-medium' : ''}>借金</div>
                <div className={step >= 4 ? 'text-blue-600 font-medium' : ''}>目標</div>
              </div>
            </div>
          )}
          
          {/* ステップコンテンツ */}
          <Card className="shadow-lg">
            <CardContent className="p-6">{renderStep()}</CardContent>
          </Card>
        </div>
      </main>
      
      {/* フッター */}
      <footer className="bg-white border-t mt-20 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <span className="text-xl font-bold text-blue-600">FinPlanX</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} FinPlanX. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                このシミュレーションは参考程度にご利用ください。実際の金融アドバイスではありません。
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}