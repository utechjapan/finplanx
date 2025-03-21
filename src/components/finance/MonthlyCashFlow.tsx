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
  ResponsiveContainer
} from 'recharts';

const MonthlyCashFlow = () => {
  // 月次収支データ - 60ヶ月分 (5年間)
  const monthlyCashFlowData = [
    // 1年目 (2025年5月〜2026年4月)
    { month: '2025-05', label: '1年目 5月', income: 290000, expenses: 161000, savings: 129000, balance: 129000 },
    { month: '2025-06', label: '1年目 6月', income: 290000, expenses: 201000, savings: 89000, balance: 218000 },
    { month: '2025-07', label: '1年目 7月', income: 290000, expenses: 161000, savings: 129000, balance: 347000 },
    { month: '2025-08', label: '1年目 8月', income: 290000, expenses: 213800, savings: 76200, balance: 423200 },
    { month: '2025-09', label: '1年目 9月', income: 290000, expenses: 161000, savings: 129000, balance: 552200 },
    { month: '2025-10', label: '1年目 10月', income: 290000, expenses: 161000, savings: 129000, balance: 681200 },
    { month: '2025-11', label: '1年目 11月', income: 290000, expenses: 161000, savings: 129000, balance: 810200 },
    { month: '2025-12', label: '1年目 12月', income: 290000, expenses: 241000, savings: 49000, balance: 859200 },
    { month: '2026-01', label: '1年目 1月', income: 290000, expenses: 161000, savings: 129000, balance: 988200 },
    { month: '2026-02', label: '1年目 2月', income: 290000, expenses: 161000, savings: 129000, balance: 1117200 },
    { month: '2026-03', label: '1年目 3月', income: 290000, expenses: 161000, savings: 129000, balance: 1246200 },
    { month: '2026-04', label: '1年目 4月', income: 290000, expenses: 161000, savings: 129000, balance: 1375200 },
    
    // 2年目 (2026年5月〜2027年4月)
    { month: '2026-05', label: '2年目 5月', income: 299000, expenses: 241000, savings: 58000, balance: 1433200 },
    { month: '2026-06', label: '2年目 6月', income: 669000, expenses: 161000, savings: 508000, balance: 1941200 },
    { month: '2026-07', label: '2年目 7月', income: 299000, expenses: 161000, savings: 138000, balance: 2079200 },
    { month: '2026-08', label: '2年目 8月', income: 299000, expenses: 213800, savings: 85200, balance: 2164400 },
    { month: '2026-09', label: '2年目 9月', income: 299000, expenses: 241000, savings: 58000, balance: 2222400 },
    { month: '2026-10', label: '2年目 10月', income: 299000, expenses: 161000, savings: 138000, balance: 2360400 },
    { month: '2026-11', label: '2年目 11月', income: 299000, expenses: 161000, savings: 138000, balance: 2498400 },
    { month: '2026-12', label: '2年目 12月', income: 669000, expenses: 241000, savings: 428000, balance: 2926400 },
    { month: '2027-01', label: '2年目 1月', income: 299000, expenses: 361000, savings: -62000, balance: 2864400 },
    { month: '2027-02', label: '2年目 2月', income: 299000, expenses: 161000, savings: 138000, balance: 3002400 },
    { month: '2027-03', label: '2年目 3月', income: 299000, expenses: 161000, savings: 138000, balance: 3140400 },
    { month: '2027-04', label: '2年目 4月', income: 299000, expenses: 161000, savings: 138000, balance: 3278400 },
    
    // 3年目 (2027年5月〜2028年4月) - 部署移動による昇給
    { month: '2027-05', label: '3年目 5月', income: 329000, expenses: 241000, savings: 88000, balance: 3366400 },
    { month: '2027-06', label: '3年目 6月', income: 719000, expenses: 161000, savings: 558000, balance: 3924400 },
    { month: '2027-07', label: '3年目 7月', income: 329000, expenses: 161000, savings: 168000, balance: 4092400 },
    { month: '2027-08', label: '3年目 8月', income: 329000, expenses: 213800, savings: 115200, balance: 4207600 },
    { month: '2027-09', label: '3年目 9月', income: 329000, expenses: 241000, savings: 88000, balance: 4295600 },
    { month: '2027-10', label: '3年目 10月', income: 329000, expenses: 161000, savings: 168000, balance: 4463600 },
    { month: '2027-11', label: '3年目 11月', income: 329000, expenses: 161000, savings: 168000, balance: 4631600 },
    { month: '2027-12', label: '3年目 12月', income: 719000, expenses: 241000, savings: 478000, balance: 5109600 },
    { month: '2028-01', label: '3年目 1月', income: 329000, expenses: 361000, savings: -32000, balance: 5077600 },
    { month: '2028-02', label: '3年目 2月', income: 329000, expenses: 161000, savings: 168000, balance: 5245600 },
    { month: '2028-03', label: '3年目 3月', income: 329000, expenses: 161000, savings: 168000, balance: 5413600 },
    { month: '2028-04', label: '3年目 4月', income: 329000, expenses: 161000, savings: 168000, balance: 5581600 },
    
    // 4年目 (2028年5月〜2029年4月)
    { month: '2028-05', label: '4年目 5月', income: 339000, expenses: 241000, savings: 98000, balance: 5679600 },
    { month: '2028-06', label: '4年目 6月', income: 749000, expenses: 161000, savings: 588000, balance: 6267600 },
    { month: '2028-07', label: '4年目 7月', income: 339000, expenses: 161000, savings: 178000, balance: 6445600 },
    { month: '2028-08', label: '4年目 8月', income: 339000, expenses: 213800, savings: 125200, balance: 6570800 },
    { month: '2028-09', label: '4年目 9月', income: 339000, expenses: 241000, savings: 98000, balance: 6668800 },
    { month: '2028-10', label: '4年目 10月', income: 339000, expenses: 161000, savings: 178000, balance: 6846800 },
    { month: '2028-11', label: '4年目 11月', income: 339000, expenses: 161000, savings: 178000, balance: 7024800 },
    { month: '2028-12', label: '4年目 12月', income: 749000, expenses: 241000, savings: 508000, balance: 7532800 },
    { month: '2029-01', label: '4年目 1月', income: 339000, expenses: 361000, savings: -22000, balance: 7510800 },
    { month: '2029-02', label: '4年目 2月', income: 339000, expenses: 161000, savings: 178000, balance: 7688800 },
    { month: '2029-03', label: '4年目 3月', income: 339000, expenses: 161000, savings: 178000, balance: 7866800 },
    { month: '2029-04', label: '4年目 4月', income: 339000, expenses: 161000, savings: 178000, balance: 8044800 },
    
    // 5年目 (2029年5月〜2030年4月)
    { month: '2029-05', label: '5年目 5月', income: 349000, expenses: 241000, savings: 108000, balance: 8152800 },
    { month: '2029-06', label: '5年目 6月', income: 779000, expenses: 161000, savings: 618000, balance: 8770800 },
    { month: '2029-07', label: '5年目 7月', income: 349000, expenses: 161000, savings: 188000, balance: 8958800 },
    { month: '2029-08', label: '5年目 8月', income: 349000, expenses: 213800, savings: 135200, balance: 9094000 },
    { month: '2029-09', label: '5年目 9月', income: 349000, expenses: 241000, savings: 108000, balance: 9202000 },
    { month: '2029-10', label: '5年目 10月', income: 349000, expenses: 161000, savings: 188000, balance: 9390000 },
    { month: '2029-11', label: '5年目 11月', income: 349000, expenses: 161000, savings: 188000, balance: 9578000 },
    { month: '2029-12', label: '5年目 12月', income: 779000, expenses: 241000, savings: 538000, balance: 10116000 },
    { month: '2030-01', label: '5年目 1月', income: 349000, expenses: 361000, savings: -12000, balance: 10104000 },
    { month: '2030-02', label: '5年目 2月', income: 349000, expenses: 161000, savings: 188000, balance: 10292000 },
    { month: '2030-03', label: '5年目 3月', income: 349000, expenses: 161000, savings: 188000, balance: 10480000 },
    { month: '2030-04', label: '5年目 4月', income: 349000, expenses: 161000, savings: 188000, balance: 10668000 }
  ];

  // 年ごとにデータを分割
  const yearLabels = ['1年目', '2年目', '3年目', '4年目', '5年目'];
  const yearlyDataSets: { [key: string]: typeof monthlyCashFlowData } = {};
  
  yearLabels.forEach((yearLabel, index) => {
    const startIndex = index * 12;
    yearlyDataSets[yearLabel] = monthlyCashFlowData.slice(startIndex, startIndex + 12);
  });

  const [selectedYears, setSelectedYears] = useState(yearLabels);

  const toggleYear = (year: string): void => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y: string) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  // 月表示用の短い名前
  const monthNames = ['5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月'];

  // データテーブル表示用
  const MonthlyDataTable = ({ data }: { data: typeof monthlyCashFlowData }) => {
    return (
      <div className="w-full overflow-x-auto mb-8">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">月</th>
              <th className="border border-gray-300 px-4 py-2">収入</th>
              <th className="border border-gray-300 px-4 py-2">支出</th>
              <th className="border border-gray-300 px-4 py-2">貯蓄額</th>
              <th className="border border-gray-300 px-4 py-2">累計貯蓄</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">¥{item.income.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">¥{item.expenses.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <span className={item.savings < 0 ? 'text-red-500' : ''}>
                    ¥{item.savings.toLocaleString()}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">¥{item.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">5年間の月次収支</h1>

      {/* 年選択チェックボックス */}
      <div className="flex justify-center space-x-4 mb-6">
        {yearLabels.map(year => (
          <div key={year} className="flex items-center">
            <input
              type="checkbox"
              id={`year-${year}`}
              checked={selectedYears.includes(year)}
              onChange={() => toggleYear(year)}
              className="mr-2"
            />
            <label htmlFor={`year-${year}`} className="cursor-pointer">
              {year}
            </label>
          </div>
        ))}
      </div>

      {/* 月次収入・支出グラフ */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">月次収入・支出</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyCashFlowData.filter(item => {
            const yearPrefix = item.label.split(' ')[0];
            return selectedYears.includes(yearPrefix);
          })}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tick={(props) => {
                const { x, y, payload } = props;
                const index = payload.index;
                const showLabel = (index % 6 === 0);
                return showLabel ? (
                  <text x={x} y={y + 15} textAnchor="middle" fill="#666">
                    {payload.value}
                  </text>
                ) : (
                  <text x={x} y={y + 15} textAnchor="middle" fill="#666"></text>
                );
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => `¥${value.toLocaleString()}`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="income" name="月収" fill="#8884d8" />
            <Bar dataKey="expenses" name="支出" fill="#ff7f7f" />
            <Bar dataKey="savings" name="月間貯蓄" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 貯蓄残高推移グラフ */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">貯蓄残高推移</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyCashFlowData.filter(item => {
            const yearPrefix = item.label.split(' ')[0];
            return selectedYears.includes(yearPrefix);
          })}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tick={(props) => {
                const { x, y, payload } = props;
                const index = payload.index;
                const showLabel = (index % 6 === 0);
                return (
                  <text x={x} y={y + 15} textAnchor="middle" fill="#666">
                    {showLabel ? payload.value : ''}
                  </text>
                );
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => `¥${value.toLocaleString()}`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="balance" 
              name="累計貯蓄" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 年別の月次データテーブル */}
      {yearLabels.filter(year => selectedYears.includes(year)).map(year => (
        <div key={year} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{year}の月次収支詳細</h2>
          <MonthlyDataTable data={yearlyDataSets[year]} />
        </div>
      ))}

      {/* 脚注 */}
      <div className="mt-8 text-sm text-gray-600 border-t pt-4">
        <h3 className="font-semibold mb-2">前提条件・注意事項</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>給与: 初年度月給232,000円＋残業手当(30時間/月)58,000円</li>
          <li>ボーナス: 採用条件書によると初回ボーナスは「翌年度夏季ボーナス(6月)」から支給</li>
          <li>昇給: 毎年4月に3%程度の昇給を想定</li>
          <li>部署移動: 3年目(2027年5月)で約10%の昇給を想定</li>
          <li>特別な支出: ジム年会費(8月)52,800円、海外旅行(1月)200,000円、国内旅行(5月/9月/12月)各80,000円</li>
          <li>2026年1月のフィリピン旅行は2027年1月の海外旅行として計上</li>
        </ul>
      </div>
    </div>
  );
};

export default MonthlyCashFlow;