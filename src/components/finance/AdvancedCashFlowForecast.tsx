// src/components/finance/AdvancedCashFlowForecast.tsx
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import { Slider } from '@/src/components/ui/Slider';
import { Input } from '@/src/components/ui/Input';

export const AdvancedCashFlowForecast: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState(12); // months
  const [confidenceLevel, setConfidenceLevel] = useState(50); // percent
  const [includeInvestments, setIncludeInvestments] = useState(true);
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(3); // percent
  const [expenseInflationRate, setExpenseInflationRate] = useState(2); // percent
  
  // This would be fetched from the API in a real implementation
  const historicalData = [
    { month: '2024-10', income: 5200, expenses: 3800, investments: 800, savings: 1400 },
    { month: '2024-11', income: 5200, expenses: 4100, investments: 800, savings: 1100 },
    { month: '2024-12', income: 6800, expenses: 4300, investments: 800, savings: 2500 },
    { month: '2025-01', income: 5200, expenses: 3700, investments: 800, savings: 1500 },
    { month: '2025-02', income: 5200, expenses: 3900, investments: 800, savings: 1300 },
    { month: '2025-03', income: 5200, expenses: 4000, investments: 800, savings: 1200 }
  ];
  
  // Generate forecast data
  const generateForecast = () => {
    const forecast = [];
    let lastIncome = historicalData[historicalData.length - 1].income;
    let lastExpenses = historicalData[historicalData.length - 1].expenses;
    let lastInvestments = historicalData[historicalData.length - 1].investments;
    let cumulativeSavings = historicalData.reduce((sum, month) => sum + month.savings, 0);
    
    const lastDate = new Date(historicalData[historicalData.length - 1].month);
    
    for (let i = 1; i <= forecastPeriod; i++) {
      // Increase by growth/inflation rates monthly
      lastIncome *= (1 + incomeGrowthRate / 100 / 12);
      lastExpenses *= (1 + expenseInflationRate / 100 / 12);
      
      // Add random variability based on confidence level
      // Higher confidence = less variability
      const variabilityFactor = (100 - confidenceLevel) / 100 * 0.2;
      const incomeVariation = lastIncome * (Math.random() * variabilityFactor * 2 - variabilityFactor);
      const expenseVariation = lastExpenses * (Math.random() * variabilityFactor * 2 - variabilityFactor);
      
      const monthIncome = Math.round(lastIncome + incomeVariation);
      const monthExpenses = Math.round(lastExpenses + expenseVariation);
      const monthInvestments = includeInvestments ? lastInvestments : 0;
      const monthSavings = monthIncome - monthExpenses - monthInvestments;
      
      cumulativeSavings += monthSavings;
      
      // Calculate next month
      const nextDate = new Date(lastDate);
      nextDate.setMonth(nextDate.getMonth() + i);
      const monthLabel = nextDate.toISOString().slice(0, 7);
      
      forecast.push({
        month: monthLabel,
        income: monthIncome,
        expenses: monthExpenses,
        investments: monthInvestments,
        savings: monthSavings,
        cumulativeSavings: cumulativeSavings,
        isProjection: true
      });
    }
    
    // Combine historical and forecast data
    return [...historicalData.map(item => ({
      ...item, 
      cumulativeSavings: 0, // We'll calculate this
      isProjection: false
    })), ...forecast];
  };
  
  // Calculate cumulative savings for display
  const calculateCumulativeSavings = (data) => {
    let cumulativeSavings = 0;
    return data.map(item => {
      cumulativeSavings += item.savings;
      return {
        ...item,
        cumulativeSavings
      };
    });
  };
  
  const combinedData = calculateCumulativeSavings(generateForecast());
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>高度な収支予測</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">予測期間 (月)</label>
            <Select
              value={forecastPeriod.toString()}
              onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
            >
              <option value="3">3ヶ月</option>
              <option value="6">6ヶ月</option>
              <option value="12">1年</option>
              <option value="24">2年</option>
              <option value="36">3年</option>
              <option value="60">5年</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">予測信頼度: {confidenceLevel}%</label>
            <Slider
              min={0}
              max={100}
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">収入成長率 (%/年)</label>
            <Input
              type="number"
              value={incomeGrowthRate}
              onChange={(e) => setIncomeGrowthRate(parseFloat(e.target.value))}
              min={-10}
              max={20}
              step={0.1}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">支出増加率 (%/年)</label>
            <Input
              type="number"
              value={expenseInflationRate}
              onChange={(e) => setExpenseInflationRate(parseFloat(e.target.value))}
              min={0}
              max={10}
              step={0.1}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">収入・支出・貯蓄予測</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `¥${value.toLocaleString()}`}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    name="収入" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!payload.isProjection) {
                        return <circle cx={cx} cy={cy} r={4} fill="#8884d8" />;
                      }
                      return null;
                    }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="支出" 
                    stroke="#ff7f7f" 
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!payload.isProjection) {
                        return <circle cx={cx} cy={cy} r={4} fill="#ff7f7f" />;
                      }
                      return null;
                    }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    name="貯蓄" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!payload.isProjection) {
                        return <circle cx={cx} cy={cy} r={4} fill="#82ca9d" />;
                      }
                      return null;
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">累積貯蓄予測</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `¥${value.toLocaleString()}`}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSavings"
                    name="累積貯蓄"
                    fill="#8884d8"
                    stroke="#8884d8"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>※ 予測は過去の傾向と入力された成長率・インフレ率に基づいて計算されています。実際の結果は異なる場合があります。</p>
          <p>※ 予測信頼度を下げるとより変動の大きい予測となります（不確実性が高い状況のシミュレーション）。</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedCashFlowForecast;