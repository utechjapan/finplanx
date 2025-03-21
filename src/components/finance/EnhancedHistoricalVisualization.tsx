// src/components/finance/EnhancedHistoricalVisualization.tsx
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ComposedChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { Button } from '@/src/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';

export const EnhancedHistoricalVisualization: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1y');
  const [granularity, setGranularity] = useState('month');
  const [chartType, setChartType] = useState('line');
  const [dataCategory, setDataCategory] = useState('income_expense');

  // This would be fetched from an API in a real implementation
  const generateData = () => {
    const data = [];
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case '3y':
        startDate = new Date(now.getFullYear() - 3, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }
    
    // Generate data points based on granularity
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const month = currentDate.getMonth() + 1;
      const income = 300000 + Math.random() * 50000 + (month === 6 || month === 12 ? 500000 : 0); // Bonus in June and December
      const expenses = 200000 + Math.random() * 30000 + (month === 1 ? 100000 : 0) + (month === 8 ? 50000 : 0); // Higher expenses in January and August
      const savings = income - expenses;
      
      // Investment data
      const investments = 50000 + Math.random() * 10000;
      const investmentReturns = investments * (0.03 + Math.random() * 0.02) / 12; // Monthly returns between 3-5% annually
      
      // Debt data
      const debtPayments = 40000 + Math.random() * 5000;
      const monthsElapsed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + currentDate.getMonth() - startDate.getMonth();
      const remainingDebt = 3000000 - (debtPayments * monthsElapsed);
      
      // Expense breakdown
      const housing = 80000 + Math.random() * 5000;
      const food = 60000 + Math.random() * 8000;
      const utilities = 25000 + Math.random() * 5000;
      const transportation = 15000 + Math.random() * 3000;
      const entertainment = 20000 + Math.random() * 10000;
      const other = 20000 + Math.random() * 5000;
      
      data.push({
        date: currentDate.toISOString().substr(0, 10),
        month: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
        quarter: `${currentDate.getFullYear()}-Q${Math.floor(currentDate.getMonth() / 3) + 1}`,
        year: currentDate.getFullYear().toString(),
        income,
        expenses,
        savings,
        investments,
        investmentReturns,
        debtPayments,
        remainingDebt,
        housing,
        food,
        utilities,
        transportation,
        entertainment,
        other
      });
      
      // Increment date based on granularity
      if (granularity === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (granularity === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (granularity === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (granularity === 'quarter') {
        currentDate.setMonth(currentDate.getMonth() + 3);
      } else {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    
    return data;
  };
  
  const data = generateData();
  
  // Aggregate data based on granularity
  const aggregateData = (data: any[]) => {
    if (granularity === 'day') return data;
    
    const aggregated: Record<string, any> = {};
    
    data.forEach(item => {
      const key = granularity === 'week' ? 
        `${item.date.substr(0, 7)}-W${Math.ceil(new Date(item.date).getDate() / 7)}` : 
        granularity === 'month' ? item.month : 
        granularity === 'quarter' ? item.quarter : item.year;
      
      if (!aggregated[key]) {
        aggregated[key] = {
          date: key,
          income: 0,
          expenses: 0,
          savings: 0,
          investments: 0,
          investmentReturns: 0,
          debtPayments: 0,
          remainingDebt: item.remainingDebt, // use last value for debt
          housing: 0,
          food: 0,
          utilities: 0,
          transportation: 0,
          entertainment: 0,
          other: 0,
          count: 0
        };
      }
      
      aggregated[key].income += item.income;
      aggregated[key].expenses += item.expenses;
      aggregated[key].savings += item.savings;
      aggregated[key].investments += item.investments;
      aggregated[key].investmentReturns += item.investmentReturns;
      aggregated[key].debtPayments += item.debtPayments;
      aggregated[key].housing += item.housing;
      aggregated[key].food += item.food;
      aggregated[key].utilities += item.utilities;
      aggregated[key].transportation += item.transportation;
      aggregated[key].entertainment += item.entertainment;
      aggregated[key].other += item.other;
      aggregated[key].count += 1;
    });
    
    return Object.values(aggregated);
  };
  
  const aggregatedData = aggregateData(data);
  
  // Format axis labels
  const formatXAxis = (value: string) => {
    if (granularity === 'day') {
      return value.substr(5, 5); // MM-DD
    } else if (granularity === 'week') {
      return value.substr(5); // MM-Wx
    } else if (granularity === 'month') {
      return value.substr(5, 2) + '月'; // MM月
    } else if (granularity === 'quarter') {
      return value; // YYYY-Qx
    } else {
      return value + '年'; // YYYY年
    }
  };
  
  // Format tooltip labels
  const formatTooltipLabel = (label: string) => {
    if (granularity === 'day') {
      return new Date(label).toLocaleDateString('ja-JP');
    } else if (granularity === 'week') {
      const [year, monthWeek] = label.split('-');
      const [month, week] = monthWeek.split('W');
      return `${year}年${month}月 第${week}週`;
    } else if (granularity === 'month') {
      const [year, month] = label.split('-');
      return `${year}年${month}月`;
    } else if (granularity === 'quarter') {
      const [year, quarter] = label.split('-');
      return `${year}年 ${quarter}`;
    } else {
      return `${label}年`;
    }
  };
  
  // Render chart based on user selection
  const renderChart = () => {
    let chartConfig: { lines: Array<{ dataKey: string; name: string; stroke: string; fill: string }> } = { lines: [] };
    
    switch (dataCategory) {
      case 'income_expense':
        chartConfig = {
          lines: [
            { dataKey: 'income', name: '収入', stroke: '#8884d8', fill: '#8884d8' },
            { dataKey: 'expenses', name: '支出', stroke: '#ff7f7f', fill: '#ff7f7f' },
            { dataKey: 'savings', name: '貯蓄', stroke: '#82ca9d', fill: '#82ca9d' }
          ]
        };
        break;
      case 'investments':
        chartConfig = {
          lines: [
            { dataKey: 'investments', name: '投資額', stroke: '#8884d8', fill: '#8884d8' },
            { dataKey: 'investmentReturns', name: '投資リターン', stroke: '#82ca9d', fill: '#82ca9d' }
          ]
        };
        break;
      case 'debt':
        chartConfig = {
          lines: [
            { dataKey: 'debtPayments', name: '返済額', stroke: '#8884d8', fill: '#8884d8' },
            { dataKey: 'remainingDebt', name: '残債', stroke: '#ff7f7f', fill: '#ff7f7f' }
          ]
        };
        break;
      case 'expenses':
        chartConfig = {
          lines: [
            { dataKey: 'housing', name: '住居費', stroke: '#8884d8', fill: '#8884d8' },
            { dataKey: 'food', name: '食費', stroke: '#ff7f7f', fill: '#ff7f7f' },
            { dataKey: 'utilities', name: '水道光熱費', stroke: '#82ca9d', fill: '#82ca9d' },
            { dataKey: 'transportation', name: '交通費', stroke: '#ffc658', fill: '#ffc658' },
            { dataKey: 'entertainment', name: '娯楽費', stroke: '#8dd1e1', fill: '#8dd1e1' },
            { dataKey: 'other', name: 'その他', stroke: '#a4de6c', fill: '#a4de6c' }
          ]
        };
        break;
      default:
        chartConfig = {
          lines: [
            { dataKey: 'income', name: '収入', stroke: '#8884d8', fill: '#8884d8' },
            { dataKey: 'expenses', name: '支出', stroke: '#ff7f7f', fill: '#ff7f7f' }
          ]
        };
    }
    
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `¥${value.toLocaleString()}`}
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            {chartConfig.lines.map((line, index) => (
              <Bar 
                key={index} 
                dataKey={line.dataKey} 
                name={line.name} 
                fill={line.fill} 
                barSize={30}
              />
            ))}
          </BarChart>
        );
      
      case 'area':
        return (
          <ComposedChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `¥${value.toLocaleString()}`}
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            {chartConfig.lines.map((line, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                fill={line.fill}
                fillOpacity={0.3}
                stackId={dataCategory === 'expenses' ? '1' : undefined}
              />
            ))}
          </ComposedChart>
        );
      
      case 'scatter':
        if (dataCategory === 'income_expense') {
          return (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="income" name="収入" unit="円" />
              <YAxis type="number" dataKey="expenses" name="支出" unit="円" />
              <ZAxis type="number" range={[100, 500]} />
              <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              <Legend />
              <Scatter name="収支相関" data={aggregatedData} fill="#8884d8" />
            </ScatterChart>
          );
        }
        return (
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `¥${value.toLocaleString()}`}
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            {chartConfig.lines.map((line, index) => (
              <Line 
                key={index} 
                type="monotone" 
                dataKey={line.dataKey} 
                name={line.name} 
                stroke={line.stroke}
                dot={true}
              />
            ))}
          </LineChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `¥${value.toLocaleString()}`}
              labelFormatter={formatTooltipLabel}
            />
            <Legend />
            {chartConfig.lines.map((line, index) => (
              <Line 
                key={index} 
                type="monotone" 
                dataKey={line.dataKey} 
                name={line.name} 
                stroke={line.stroke}
                dot={true}
              />
            ))}
          </LineChart>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>詳細履歴データ分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">期間</label>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="3m">3ヶ月</option>
              <option value="6m">6ヶ月</option>
              <option value="1y">1年</option>
              <option value="3y">3年</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">粒度</label>
            <Select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
              <option value="day">日</option>
              <option value="week">週</option>
              <option value="month">月</option>
              <option value="quarter">四半期</option>
              <option value="year">年</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">チャートタイプ</label>
            <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="line">ラインチャート</option>
              <option value="bar">バーチャート</option>
              <option value="area">エリアチャート</option>
              <option value="scatter">散布図</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">データカテゴリ</label>
            <Select value={dataCategory} onChange={(e) => setDataCategory(e.target.value)}>
              <option value="income_expense">収入・支出</option>
              <option value="investments">投資</option>
              <option value="debt">借金</option>
              <option value="expenses">支出内訳</option>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList>
              <TabsTrigger value="chart">チャート</TabsTrigger>
              <TabsTrigger value="data">データ</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="data" className="mt-4">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(aggregatedData, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
