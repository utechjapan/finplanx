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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const FinancialForecastCompact = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [showInvestmentTab, setShowInvestmentTab] = useState(false);
  
  // 各年の月別収支データ (コンパクト版)
  const yearsData = [
    { yearLabel: "1年目 (2025年5月〜2026年4月)", totalSavings: 1375200 },
    { yearLabel: "2年目 (2026年5月〜2027年4月)", totalSavings: 2003200 },
    { yearLabel: "3年目 (2027年5月〜2028年4月)", totalSavings: 2603200 },
    { yearLabel: "4年目 (2028年5月〜2029年4月)", totalSavings: 2783200 },
    { yearLabel: "5年目 (2029年5月〜2030年4月)", totalSavings: 2963200 }
  ];

  // 5年間の累計貯蓄データ
  const cumulativeSavings = [
    { year: '1年目', savings: 1375200, label: '1年目' },
    { year: '2年目', savings: 1375200 + 2003200, label: '2年目' },
    { year: '3年目', savings: 1375200 + 2003200 + 2603200, label: '3年目' },
    { year: '4年目', savings: 1375200 + 2003200 + 2603200 + 2783200, label: '4年目' },
    { year: '5年目', savings: 1375200 + 2003200 + 2603200 + 2783200 + 2963200, label: '5年目' }
  ];

  // 年ごとの年間収支サマリー
  const annualSummary = [
    { year: '1年目', totalIncome: 3480000, totalExpenses: 2104800, totalSavings: 1375200, label: '1年目' },
    { year: '2年目', totalIncome: 4428000, totalExpenses: 2424800, totalSavings: 2003200, label: '2年目' },
    { year: '3年目', totalIncome: 5028000, totalExpenses: 2424800, totalSavings: 2603200, label: '3年目' },
    { year: '4年目', totalIncome: 5208000, totalExpenses: 2424800, totalSavings: 2783200, label: '4年目' },
    { year: '5年目', totalIncome: 5388000, totalExpenses: 2424800, totalSavings: 2963200, label: '5年目' }
  ];

  // 通常月の基本的な支出
  const baseExpenseBreakdown = [
    { name: '社宅家賃', value: 20000, color: '#8884d8' },
    { name: '食費', value: 40000, color: '#83a6ed' },
    { name: 'その他生活費', value: 40000, color: '#8dd1e1' },
    { name: '交際費', value: 20000, color: '#82ca9d' },
    { name: 'デート費', value: 15000, color: '#a4de6c' },
    { name: '借金返済', value: 40000, color: '#ffc658' }
  ];

  // 特別な支出
  const specialExpenses = [
    { name: 'ジム年会費', value: 52800, timing: '毎年8月', color: '#ff8042' },
    { name: '海外旅行', value: 200000, timing: '毎年1月 (2027年～)', color: '#ff5252' },
    { name: '国内旅行', value: 80000, timing: '年3回 (5月・9月・12月)', color: '#ba68c8' }
  ];

  const totalBaseExpense = baseExpenseBreakdown.reduce((sum, item) => sum + item.value, 0);
  
  const expenseData = baseExpenseBreakdown.map(item => ({
    name: item.name,
    value: item.value,
    percentage: Math.round((item.value / totalBaseExpense) * 100),
    color: item.color
  }));

  // 投資配分データ
  const investmentAllocation = [
    { name: '緊急預金 (6ヶ月分の生活費)', value: 25, color: '#FF8042' },
    { name: '投資信託 (インデックスファンド)', value: 30, color: '#82CA9D' },
    { name: 'iDeCo (確定拠出年金)', value: 15, color: '#8884D8' },
    { name: 'NISA (積立投資)', value: 20, color: '#FFBB28' },
    { name: '趣味・自己投資', value: 10, color: '#0088FE' }
  ];

  // 投資成長予測
  const investmentGrowth = [
    { year: '1年目', emergency: 300000, nisa: 240000, ideco: 180000, fund: 360000, other: 120000, total: 1200000, label: '1年目' },
    { year: '2年目', emergency: 600000, nisa: 498000, ideco: 374000, fund: 748000, other: 240000, total: 2460000, label: '2年目' },
    { year: '3年目', emergency: 960000, nisa: 780000, ideco: 583000, fund: 1161000, other: 360000, total: 3844000, label: '3年目' },
    { year: '4年目', emergency: 960000, nisa: 1092000, ideco: 812000, fund: 1624000, other: 480000, total: 4968000, label: '4年目' },
    { year: '5年目', emergency: 960000, nisa: 1439000, ideco: 1062000, fund: 2124000, other: 600000, total: 6185000, label: '5年目' }
  ];

  // タブの切り替え
  const Tab = ({ active, onClick, children }) => (
    <button
      className={`px-4 py-2 font-semibold rounded-t-lg ${
        active ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">5年間の月次収支予測 (中部テレコミュニケーション株式会社)</h1>
      
      {/* タブ切り替え */}
      <div className="flex mb-4 border-b">
        <Tab active={!showInvestmentTab} onClick={() => setShowInvestmentTab(false)}>
          収支予測
        </Tab>
        <Tab active={showInvestmentTab} onClick={() => setShowInvestmentTab(true)}>
          投資・資産運用プラン
        </Tab>
      </div>

      {!showInvestmentTab ? (
        // 収支予測タブ
        <>
          {/* 年間収支サマリー */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5年間の年間収支サマリー</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={annualSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="totalIncome" name="年間収入" fill="#8884d8" />
                <Bar dataKey="totalExpenses" name="年間支出" fill="#ff7f7f" />
                <Line dataKey="totalSavings" name="年間貯蓄" stroke="#82ca9d" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 積立貯金額 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5年間の累計貯蓄推移</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeSavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  name="累計貯蓄" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 月々の支出内訳 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">基本的な月々の支出内訳</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">毎月の基本支出</h3>
                  <p className="mb-2">毎月の基本支出: ¥{totalBaseExpense.toLocaleString()}</p>
                  <ul className="space-y-2">
                    {expenseData.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></span>
                          {item.name}
                        </span>
                        <span>¥{item.value.toLocaleString()} ({item.percentage}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 特別支出 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">特別な支出（年間・季節）</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ul className="space-y-4">
                {specialExpenses.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-sm text-gray-600 ml-5">支払時期: {item.timing}</p>
                    </div>
                    <span className="font-semibold">¥{item.value.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 脚注 */}
          <div className="mt-8 text-sm text-gray-600 border-t pt-4">
            <h3 className="font-semibold mb-2">前提条件・注意事項</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>給与: 初年度月給232,000円＋残業手当(30時間/月)58,000円</li>
              <li>ボーナス: 採用条件書によると初回ボーナスは「翌年度夏季ボーナス(6月)」から支給</li>
              <li>昇給: 毎年4月に3%程度の昇給を想定</li>
              <li>部署移動: 3年目(2027年5月)で約10%の昇給を想定</li>
              <li>社宅: 会社規定により月額20,000円で利用可能と想定</li>
              <li>借金返済: 2025年6月から月額40,000円</li>
              <li>旅行: 海外旅行(毎年1月)200,000円、国内旅行(年3回・5月/9月/12月)80,000円/回</li>
              <li>ジム: 2025年8月から年額52,800円の一括払い</li>
              <li>2026年1月のフィリピン旅行は、2027年1月の海外旅行として計上</li>
            </ul>
          </div>
        </>
      ) : (
        // 投資・資産運用タブ
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">推奨資産配分</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={investmentAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, value}) => `${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {investmentAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">おすすめの資産配分</h3>
                <p className="mb-4">5年間で約1,070万円の貯蓄が可能です。以下の配分で資産運用することをおすすめします：</p>
                <ul className="space-y-3">
                  {investmentAllocation.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div>
                        <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span>{item.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">投資運用のポイント</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">緊急預金</h3>
              <p>まずは「緊急預金」として6ヶ月分の生活費（約100万円）を普通預金や定期預金で確保しましょう。これは不測の事態に備えた安全策です。</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">つみたてNISA</h3>
              <p>年間40万円まで非課税で投資できる「つみたてNISA」を最大限活用しましょう。全世界株式インデックスファンドなどの低コストファンドがおすすめです。</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">iDeCo（個人型確定拠出年金）</h3>
              <p>月額2.3万円まで所得控除となる「iDeCo」で長期的な資産形成を行いましょう。60歳まで引き出せませんが、税制優遇が大きいため有効です。</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">投資信託（一般口座）</h3>
              <p>NISA枠を使い切った後は、一般口座での投資も検討しましょう。こちらも低コストのインデックスファンドを中心に運用するのがおすすめです。</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">趣味・自己投資</h3>
              <p>余裕があれば、資格取得やスキルアップのための教育投資も検討しましょう。ITエンジニアとしてのキャリアアップに役立ちます。</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">5年後の予想資産推移</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={investmentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="emergency" stackId="a" name="緊急預金" fill="#FF8042" />
                <Bar dataKey="nisa" stackId="a" name="つみたてNISA" fill="#FFBB28" />
                <Bar dataKey="ideco" stackId="a" name="iDeCo" fill="#8884D8" />
                <Bar dataKey="fund" stackId="a" name="投資信託" fill="#82CA9D" />
                <Bar dataKey="other" stackId="a" name="趣味・自己投資" fill="#0088FE" />
                <Line type="monotone" dataKey="total" name="合計資産" stroke="#ff7300" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="mt-4 text-center text-sm text-gray-600">※運用益は投資信託・NISAで年率4%、iDeCoで年率3%と想定</p>
          </div>

          <div className="mt-8 text-sm text-gray-600 border-t pt-4">
            <h3 className="font-semibold mb-2">投資に関する注意事項</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>投資は元本保証ではなく、市場環境によっては元本割れのリスクがあります</li>
              <li>長期・分散・積立を基本とした投資戦略がおすすめです</li>
              <li>投資初心者は、まず少額から始めて徐々に慣れていくことが大切です</li>
              <li>定期的に資産配分を見直し、必要に応じてリバランスを行いましょう</li>
              <li>実際の投資判断は、ご自身の責任において行ってください</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialForecastCompact;