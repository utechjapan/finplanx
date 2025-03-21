'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/src/components/ui/Table';
import { Progress } from '@/src/components/ui/Progress';
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// サンプルデータ
const portfolioAllocation = [
  { name: '緊急預金', value: 960000, percentage: 25, color: '#FF8042' },
  { name: 'インデックスファンド', value: 1150000, percentage: 30, color: '#82CA9D' },
  { name: 'iDeCo', value: 575000, percentage: 15, color: '#8884D8' },
  { name: 'NISA', value: 765000, percentage: 20, color: '#FFBB28' },
  { name: '自己投資', value: 385000, percentage: 10, color: '#0088FE' }
];

const investmentPerformance = [
  { month: '4月', value: 3835000 },
  { month: '5月', value: 3870000 },
  { month: '6月', value: 3920000 },
  { month: '7月', value: 3980000 },
  { month: '8月', value: 4010000 },
  { month: '9月', value: 4055000 },
  { month: '10月', value: 4125000 },
  { month: '11月', value: 4180000 },
  { month: '12月', value: 4250000 },
  { month: '1月', value: 4310000 },
  { month: '2月', value: 4380000 },
  { month: '3月', value: 4450000 }
];

const investmentGoals = [
  { name: '緊急預金', current: 960000, target: 1000000, percentage: 96 },
  { name: 'NISA枠活用', current: 765000, target: 1800000, percentage: 42.5 },
  { name: 'iDeCo枠活用', current: 575000, target: 1200000, percentage: 47.9 },
  { name: '総資産', current: 3835000, target: 10000000, percentage: 38.4 }
];

const investmentInstruments = [
  { name: '普通預金', type: '現金', amount: 250000, return: 0.001, risk: 'なし', description: '緊急時用の資金' },
  { name: '定期預金', type: '現金', amount: 710000, return: 0.02, risk: 'なし', description: '6ヶ月定期預金' },
  { name: '全世界株式インデックス', type: 'インデックスファンド', amount: 650000, return: 5.0, risk: '中', description: '低コストの全世界株式ファンド' },
  { name: '米国株式ETF', type: 'インデックスファンド', amount: 500000, return: 7.0, risk: '中〜高', description: 'S&P500連動型ETF' },
  { name: 'つみたてNISA', type: 'NISA', amount: 765000, return: 4.5, risk: '中', description: '全世界株式・国内株式の組み合わせ' },
  { name: 'iDeCo', type: 'iDeCo', amount: 575000, return: 3.0, risk: '低〜中', description: 'バランス型の運用商品' },
  { name: 'IT関連資格', type: '自己投資', amount: 385000, return: null, risk: null, description: 'キャリアアップのための資格取得費用' }
];

const riskReturnData = [
  { name: '普通預金', risk: 1, return: 0.1 },
  { name: '定期預金', risk: 2, return: 0.5 },
  { name: 'iDeCo', risk: 35, return: 3.0 },
  { name: 'NISA', risk: 50, return: 4.5 },
  { name: '全世界株式', risk: 65, return: 5.0 },
  { name: '米国株式ETF', risk: 80, return: 7.0 },
];

export default function InvestmentsPage() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState(50000);
  const [annualReturn, setAnnualReturn] = useState(5);
  const [years, setYears] = useState(10);
  
  // 複利計算関数
  const calculateCompoundInterest = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    let balance = initialInvestment;
    let contributions = initialInvestment;
    let interest = 0;
    
    const data = [{
      year: 0,
      balance: initialInvestment,
      contributions: initialInvestment,
      interest: 0
    }];
    
    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        // 月次の利息計算
        const monthlyInterest = balance * monthlyRate;
        balance += monthlyInterest + monthlyContribution;
        contributions += monthlyContribution;
        interest += monthlyInterest;
      }
      
      data.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(contributions),
        interest: Math.round(interest)
      });
    }
    
    return data;
  };
  
  const compoundInterestData = calculateCompoundInterest();
  const finalBalance = compoundInterestData[compoundInterestData.length - 1].balance;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">資産形成</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>総資産額</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">¥3,835,000</div>
              <p className="text-sm text-gray-500 mt-2">前月比: +1.5%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>年間運用益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">¥152,580</div>
              <p className="text-sm text-gray-500 mt-2">平均利回り: 4.0%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>月間積立額</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">¥50,000</div>
              <p className="text-sm text-gray-500 mt-2">収入の17.2%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>目標達成率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">38.4%</div>
              <p className="text-sm text-gray-500 mt-2">目標: ¥10,000,000</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="overview" className="flex-1">概要</TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1">ポートフォリオ</TabsTrigger>
            <TabsTrigger value="calculator" className="flex-1">シミュレーション</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>資産推移</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={investmentPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="総資産額"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>資産配分</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {portfolioAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>目標達成状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investmentGoals.map((goal) => (
                      <div key={goal.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{goal.name}</span>
                          <span>¥{goal.current.toLocaleString()} / ¥{goal.target.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={goal.percentage} 
                            max={100} 
                            indicatorColor={goal.percentage > 75 ? '#10b981' : goal.percentage > 40 ? '#3b82f6' : '#f59e0b'}
                          />
                          <span className="text-sm">{goal.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>リスクとリターンの分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskReturnData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="リスク"
                          dataKey="risk"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="リターン(%)"
                          dataKey="return"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>保有商品一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>商品名</TableHead>
                        <TableHead>種類</TableHead>
                        <TableHead className="text-right">評価額</TableHead>
                        <TableHead className="text-right">予想年利</TableHead>
                        <TableHead>リスク</TableHead>
                        <TableHead>説明</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investmentInstruments.map((instrument) => (
                        <TableRow key={instrument.name}>
                          <TableCell className="font-medium">{instrument.name}</TableCell>
                          <TableCell>{instrument.type}</TableCell>
                          <TableCell className="text-right">¥{instrument.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {instrument.return !== null ? `${instrument.return}%` : '-'}
                          </TableCell>
                          <TableCell>{instrument.risk || '-'}</TableCell>
                          <TableCell>{instrument.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">資産配分の詳細</h3>
                    <div className="space-y-4">
                      {portfolioAllocation.map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span
                                className="inline-block w-3 h-3 mr-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              ></span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span>¥{item.value.toLocaleString()} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">投資戦略のポイント</h3>
                    <ul className="space-y-3 list-disc pl-5">
                      <li>
                        <span className="font-medium">緊急預金の確保</span>
                        <p className="text-sm text-gray-600">
                          6ヶ月分の生活費（約100万円）を確保することで、緊急時の備えをします。
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">つみたてNISA</span>
                        <p className="text-sm text-gray-600">
                          年間40万円の非課税枠を活用し、低コストの全世界株式インデックスファンドに投資します。
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">iDeCo（個人型確定拠出年金）</span>
                        <p className="text-sm text-gray-600">
                          月額2.3万円の所得控除枠を活用することで、税制優遇を受けながら長期的な資産形成を行います。
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">ドルコスト平均法</span>
                        <p className="text-sm text-gray-600">
                          毎月一定額を積み立てることで、価格変動のリスクを平準化します。
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>複利計算シミュレーション</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        初期投資額 (円)
                      </label>
                      <Input
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        min={0}
                        step={100000}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        月間積立額 (円)
                      </label>
                      <Input
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        min={0}
                        step={10000}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        年間想定利回り (%)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min={0}
                          max={12}
                          step={0.5}
                          value={annualReturn}
                          onChange={(e) => setAnnualReturn(Number(e.target.value))}
                          className="flex-grow"
                        />
                        <span className="w-10 text-center">{annualReturn}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        運用期間 (年)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min={1}
                          max={30}
                          step={1}
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="flex-grow"
                        />
                        <span className="w-10 text-center">{years}年</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-lg font-semibold mb-2">シミュレーション結果</h3>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-500">最終金額</span>
                          <div className="text-xl font-bold">¥{finalBalance.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">元本合計</span>
                          <div className="text-xl font-bold">
                            ¥{compoundInterestData[compoundInterestData.length - 1].contributions.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">運用益合計</span>
                        <div className="text-xl font-bold text-green-600">
                          ¥{compoundInterestData[compoundInterestData.length - 1].interest.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>資産成長予測</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compoundInterestData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                        <Legend />
                        <Bar
                          dataKey="contributions"
                          name="元本"
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="interest"
                          name="運用益"
                          stackId="a"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">年別シミュレーション</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>年</TableHead>
                            <TableHead className="text-right">元本</TableHead>
                            <TableHead className="text-right">運用益</TableHead>
                            <TableHead className="text-right">総資産</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {compoundInterestData.map((data) => (
                            <TableRow key={data.year}>
                              <TableCell>{data.year}年目</TableCell>
                              <TableCell className="text-right">¥{data.contributions.toLocaleString()}</TableCell>
                              <TableCell className="text-right text-green-600">¥{data.interest.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-bold">¥{data.balance.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}