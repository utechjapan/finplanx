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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DebtRepaymentPlan = () => {
  const [repaymentYears, setRepaymentYears] = useState(5);
  const [interestRate, setInterestRate] = useState(3);
  
  // 借金データ
  const debtData = [
    { name: '借金A', amount: 278505, color: '#8884d8' },
    { name: '借金B', amount: 950000, color: '#82ca9d' }
  ];
  
  const totalDebt = debtData.reduce((sum, debt) => sum + debt.amount, 0);
  
// 金利計算
const calculateMonthlyPayment = (totalAmount: number, annualRate: number, years: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return totalAmount / numPayments;
  }
  
  const x = Math.pow(1 + monthlyRate, numPayments);
  return totalAmount * monthlyRate * x / (x - 1);
};

  const monthlyPayment = Math.ceil(calculateMonthlyPayment(totalDebt, interestRate, repaymentYears));
  
  // 返済シミュレーション
  const generateAmortizationSchedule = () => {
    const schedule = [];
    const monthlyRate = interestRate / 100 / 12;
    let remainingBalance = totalDebt;
    let totalInterestPaid = 0;
    
    for (let month = 1; month <= repaymentYears * 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      totalInterestPaid += interestPayment;
      
      // 最終月の調整
      const adjustedRemainingBalance = month === repaymentYears * 12 ? 0 : Math.max(0, remainingBalance);
      
      const paymentDate = new Date(2025, 5 + month - 1, 1); // 2025年6月から返済開始と仮定
      
      schedule.push({
        month,
        date: `${paymentDate.getFullYear()}年${paymentDate.getMonth() + 1}月`,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest: totalInterestPaid,
        remainingBalance: adjustedRemainingBalance,
        label: `${month}ヶ月目`
      });
    }
    
    return schedule;
  };
  
  const amortizationSchedule = generateAmortizationSchedule();
  
  // 月次収支に与える影響（抽出）
  const monthlyImpact = [
    { month: '2025年6月', originalSavings: 89000, newSavings: 89000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2025年12月', originalSavings: 49000, newSavings: 49000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2026年6月', originalSavings: 508000, newSavings: 508000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2026年12月', originalSavings: 428000, newSavings: 428000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2027年6月', originalSavings: 558000, newSavings: 558000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2027年12月', originalSavings: 478000, newSavings: 478000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2028年6月', originalSavings: 588000, newSavings: 588000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2028年12月', originalSavings: 508000, newSavings: 508000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2029年6月', originalSavings: 618000, newSavings: 618000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) },
    { month: '2029年12月', originalSavings: 538000, newSavings: 538000 - (monthlyPayment - 40000), difference: -(monthlyPayment - 40000) }
  ];

  // 5年間の総貯蓄額への影響
  const totalImpactOnSavings = (monthlyPayment - 40000) * 12 * repaymentYears;
  const originalTotalSavings = 10668000; // 元の5年間の貯蓄総額
  const newTotalSavings = originalTotalSavings - totalImpactOnSavings;

  // 返済期間選択オプション
  const yearOptions = [2, 3, 4, 5];
  
  // 借金内訳円グラフデータ
  const debtPieData = debtData.map(debt => ({
    name: debt.name,
    value: debt.amount,
    percentage: Math.round((debt.amount / totalDebt) * 100),
    color: debt.color
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">借金返済計画</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">借金総額: <span className="text-red-500">¥{totalDebt.toLocaleString()}</span></h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">返済期間:</span>
              <div className="flex">
                {yearOptions.map(year => (
                  <button
                    key={year}
                    className={`px-3 py-1 rounded mx-1 ${repaymentYears === year ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setRepaymentYears(year)}
                  >
                    {year}年
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">想定金利:</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="mr-2"
                />
                <span>{interestRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-center mb-2">毎月の返済額</h3>
            <p className="text-3xl text-center font-bold text-blue-600">¥{monthlyPayment.toLocaleString()}</p>
            <p className="text-center text-sm text-gray-500">
              ({repaymentYears}年間 × 12ヶ月 = {repaymentYears * 12}回払い)
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-500">総返済額</span>
              <span className="font-bold text-lg">¥{(monthlyPayment * repaymentYears * 12).toLocaleString()}</span>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-500">総支払利息</span>
              <span className="font-bold text-lg">¥{Math.round(monthlyPayment * repaymentYears * 12 - totalDebt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">借金内訳</h2>
          <div className="flex flex-col items-center">
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={debtPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {debtPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg w-full mt-4">
              <ul className="space-y-2">
                {debtData.map((debt, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: debt.color }}></span>
                      <span>{debt.name}</span>
                    </div>
                    <span className="font-medium">¥{debt.amount.toLocaleString()}</span>
                  </li>
                ))}
                <li className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="font-medium">合計</span>
                  <span className="font-bold">¥{totalDebt.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">残高推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={amortizationSchedule}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tick={({ x, y, payload }) => {
                // 6か月ごとに表示
                const month = payload.value.split('ヶ')[0];
                if (month % 6 === 0) {
                  return (
                    <text x={x} y={y + 15} textAnchor="middle" fill="#666">
                      {month}ヶ月目
                    </text>
                  );
                }
                return null;
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => `¥${Math.round(value).toLocaleString()}`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="remainingBalance" 
              name="借金残高" 
              stroke="#ff7f7f" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="totalInterest" 
              name="累計支払利息" 
              stroke="#ffc658" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">毎月の返済内訳（元金 vs 利息）</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={amortizationSchedule.filter((_, index) => index % 6 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `¥${Math.round(value).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="principal" name="元金" fill="#8884d8" stackId="a" />
            <Bar dataKey="interest" name="利息" fill="#ffc658" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">貯蓄への影響</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-500">現在の月々の返済額</span>
              <span className="font-bold text-lg">¥40,000</span>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-500">新しい月々の返済額</span>
              <span className="font-bold text-lg">¥{monthlyPayment.toLocaleString()}</span>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <span className="block text-sm text-gray-500">月々の貯蓄への影響</span>
              <span className="font-bold text-lg text-red-500">¥{(-(monthlyPayment - 40000)).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">ボーナス月の貯蓄への影響</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyImpact.filter(item => item.month.includes('6月') || item.month.includes('12月'))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="originalSavings" name="元の月間貯蓄" fill="#8884d8" />
                <Bar dataKey="newSavings" name="新しい月間貯蓄" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">5年間の総貯蓄への影響</h3>
            <div className="bg-white p-4 rounded-lg border mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <span className="block text-sm text-gray-500 mb-1">元の5年間の総貯蓄</span>
                  <span className="font-bold text-xl">¥{originalTotalSavings.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <span className="block text-sm text-gray-500 mb-1">新しい5年間の総貯蓄</span>
                  <span className="font-bold text-xl">¥{newTotalSavings.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded">
                <span className="block text-sm text-gray-500 mb-1">総貯蓄への影響</span>
                <span className="font-bold text-xl text-red-500">¥{(-totalImpactOnSavings).toLocaleString()}</span>
                <span className="block text-sm text-gray-500">
                  (月々¥{(monthlyPayment - 40000).toLocaleString()} × {repaymentYears * 12}ヶ月)
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">おすすめの返済戦略</h3>
              <p>
                5年で完済する場合、毎月約{monthlyPayment.toLocaleString()}円の返済で済みます。
                現在の貯蓄計画への影響は月々{(monthlyPayment - 40000).toLocaleString()}円の減少ですが、
                早期完済のメリットとして総利息の削減が見込めます。
              </p>
              <p className="mt-2">
                5年間の総貯蓄は約{Math.round(newTotalSavings / 10000)}万円となり、
                依然として十分な資産形成が可能です。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600 border-t pt-4">
        <h3 className="font-semibold mb-2">注意事項</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>返済額は毎月一定額を想定しています（元利均等返済方式）</li>
          <li>実際の借金返済条件は金融機関によって異なる場合があります</li>
          <li>早期返済のボーナス返済や繰り上げ返済などのオプションは含まれていません</li>
          <li>この計算は参考値であり、実際の金融契約の前に金融機関に相談することをおすすめします</li>
        </ul>
      </div>
    </div>
  );
};

export default DebtRepaymentPlan;