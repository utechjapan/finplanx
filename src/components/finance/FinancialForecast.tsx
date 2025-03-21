// src/components/finance/FinancialForecast.tsx
'use client';

import React, { useState } from 'react';
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
  ComposedChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { Button } from '@/src/components/ui/Button';
import { Slider } from '@/src/components/ui/Slider';
import { Input } from '@/src/components/ui/Input';

const FinancialForecast = () => {
  // User inputs with default values
  const [startingAge, setStartingAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [startingSalary, setStartingSalary] = useState(4000000);
  const [annualSalaryIncrease, setAnnualSalaryIncrease] = useState(3);
  const [savingsRate, setSavingsRate] = useState(20);
  const [initialSavings, setInitialSavings] = useState(2000000);
  const [investmentReturn, setInvestmentReturn] = useState(5);
  const [inflationRate, setInflationRate] = useState(1.5);

  // Calculated data based on user inputs
  const calculateProjection = () => {
    const years = retirementAge - startingAge;
    const data = [];
    
    let currentSalary = startingSalary;
    let totalSavings = initialSavings;
    let totalContributions = initialSavings;
    let totalReturns = 0;
    
    for (let year = 0; year <= years; year++) {
      // Calculate annual savings
      const annualSavings = currentSalary * (savingsRate / 100);
      
      // Calculate returns on investments
      const returns = totalSavings * (investmentReturn / 100);
      
      // Add this year's savings to total savings
      totalSavings = totalSavings + annualSavings + returns;
      totalContributions += annualSavings;
      totalReturns += returns;
      
      // Calculate real value (adjusted for inflation)
      const realValue = totalSavings / Math.pow(1 + (inflationRate / 100), year);
      
      data.push({
        year: startingAge + year,
        age: startingAge + year,
        salary: currentSalary,
        annualSavings,
        totalSavings,
        realValue,
        label: `${year}年目`
      });
      
      // Increase salary for next year
      currentSalary = currentSalary * (1 + (annualSalaryIncrease / 100));
    }
    
    return {
      projectionData: data,
      summaryData: {
        totalSavings: totalSavings,
        totalContributions: totalContributions,
        totalReturns: totalReturns,
        years: years
      }
    };
  };

  const { projectionData, summaryData } = calculateProjection();
  
  // Format large numbers for display
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}百万円`;
    }
    return `${value.toLocaleString()}円`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>退職までの財務シミュレーション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">現在の年齢</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={startingAge}
                    onChange={(e) => setStartingAge(parseInt(e.target.value) || 20)}
                    className="w-24"
                    min={20}
                    max={80}
                  />
                  <Slider
                    min={20}
                    max={80}
                    value={startingAge}
                    onChange={(e) => setStartingAge(parseInt(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">退職予定年齢</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
                    className="w-24"
                    min={30}
                    max={90}
                  />
                  <Slider
                    min={30}
                    max={90}
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">現在の年収 (円)</label>
                <Input
                  type="number"
                  value={startingSalary}
                  onChange={(e) => setStartingSalary(parseInt(e.target.value) || 0)}
                  min={0}
                  step={100000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">昇給率 (% / 年)</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={annualSalaryIncrease}
                    onChange={(e) => setAnnualSalaryIncrease(parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min={0}
                    max={10}
                    step={0.1}
                  />
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={annualSalaryIncrease}
                    onChange={(e) => setAnnualSalaryIncrease(parseFloat(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">貯蓄率 (% / 年収)</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min={0}
                    max={80}
                    step={1}
                  />
                  <Slider
                    min={0}
                    max={80}
                    value={savingsRate}
                    onChange={(e) => setSavingsRate(parseFloat(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">現在の貯蓄額 (円)</label>
                <Input
                  type="number"
                  value={initialSavings}
                  onChange={(e) => setInitialSavings(parseInt(e.target.value) || 0)}
                  min={0}
                  step={100000}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">投資収益率 (% / 年)</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min={0}
                    max={15}
                    step={0.1}
                  />
                  <Slider
                    min={0}
                    max={15}
                    step={0.1}
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(parseFloat(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">インフレ率 (% / 年)</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                    className="w-24"
                    min={0}
                    max={10}
                    step={0.1}
                  />
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">退職時の総資産</h3>
                <p className="text-2xl font-bold">{formatCurrency(summaryData.totalSavings)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">総拠出額</h3>
                <p className="text-2xl font-bold">{formatCurrency(summaryData.totalContributions)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4 text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">総投資収益</h3>
                <p className="text-2xl font-bold">{formatCurrency(summaryData.totalReturns)}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">資産推移予測</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: '年齢', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalSavings" 
                      name="総資産" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="realValue" 
                      name="インフレ調整後の価値" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">年収と貯蓄額の推移</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: '年齢', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="salary" name="年収" fill="#8884d8" />
                    <Bar dataKey="annualSavings" name="年間貯蓄" fill="#82ca9d" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>※ このシミュレーションは参考値です。実際の結果は市場の変動や個人の状況によって異なります。</p>
            <p>※ 資産運用や退職計画については、ファイナンシャルアドバイザーにご相談ください。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialForecast;