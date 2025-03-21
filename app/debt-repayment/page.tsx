'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/src/components/ui/Table';
import { DatePicker } from '@/src/components/ui/DatePicker';
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

export default function DebtRepaymentPage() {
  // Debt list
  const [debts, setDebts] = useState<Array<{
    id: string,
    name: string,
    creditor: string,
    totalAmount: number,
    remainingAmount: number,
    interestRate: number,
    minimumPayment: number,
    dueDate: number,
    startDate: Date,
    endDate?: Date,
    payments: Array<{
      id: string,
      date: Date,
      amount: number,
    }>
  }>>([]);

  // New debt form
  const [newDebt, setNewDebt] = useState({
    name: '',
    creditor: '',
    totalAmount: 0,
    interestRate: 3,
    minimumPayment: 0,
    dueDate: 1,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
  });

  // Selected debt for detail view
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);

  // New payment form
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    date: new Date(),
  });

  // Repayment strategy
  const [repaymentStrategy, setRepaymentStrategy] = useState('avalanche'); // 'avalanche' or 'snowball'

  // Helper functions
  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const addDebt = () => {
    if (!newDebt.name || !newDebt.creditor || newDebt.totalAmount <= 0) {
      return;
    }
    
    const debt = {
      id: Date.now().toString(),
      name: newDebt.name,
      creditor: newDebt.creditor,
      totalAmount: newDebt.totalAmount,
      remainingAmount: newDebt.totalAmount,
      interestRate: newDebt.interestRate,
      minimumPayment: newDebt.minimumPayment,
      dueDate: newDebt.dueDate,
      startDate: new Date(newDebt.startDate),
      endDate: newDebt.endDate ? new Date(newDebt.endDate) : undefined,
      payments: []
    };
    
    setDebts([...debts, debt]);
    
    // Reset form
    setNewDebt({
      name: '',
      creditor: '',
      totalAmount: 0,
      interestRate: 3,
      minimumPayment: 0,
      dueDate: 1,
      startDate: new Date(),
      endDate: undefined
    });
  };

  const addPayment = () => {
    if (!selectedDebtId || newPayment.amount <= 0) {
      return;
    }
    
    const selectedDebtIndex = debts.findIndex(debt => debt.id === selectedDebtId);
    if (selectedDebtIndex === -1) {
      return;
    }
    
    const selectedDebt = debts[selectedDebtIndex];
    
    // Create new payment
    const payment = {
      id: Date.now().toString(),
      date: new Date(newPayment.date),
      amount: newPayment.amount
    };
    
    // Calculate new remaining amount
    const newRemainingAmount = Math.max(0, selectedDebt.remainingAmount - newPayment.amount);
    
    // Update debt with new payment and remaining amount
    const updatedDebt = {
      ...selectedDebt,
      remainingAmount: newRemainingAmount,
      payments: [...selectedDebt.payments, payment]
    };
    
    // Update debts array
    const updatedDebts = [...debts];
    updatedDebts[selectedDebtIndex] = updatedDebt;
    
    setDebts(updatedDebts);
    
    // Reset payment form
    setNewPayment({
      amount: 0,
      date: new Date()
    });
  };

  const calculateTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.remainingAmount, 0);
  };

  const calculateTotalMinimumPayment = () => {
    return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
  };

  const calculatePayoffDate = () => {
    if (debts.length === 0) {
      return null;
    }
    
    // Sort debts based on strategy
    const sortedDebts = [...debts].sort((a, b) => {
      if (repaymentStrategy === 'avalanche') {
        // Highest interest first
        return b.interestRate - a.interestRate;
      } else {
        // Lowest balance first
        return a.remainingAmount - b.remainingAmount;
      }
    });
    
    // Clone debts for simulation
    const simulatedDebts = sortedDebts.map(debt => ({
      ...debt,
      remainingAmount: debt.remainingAmount
    }));
    
    // Calculate total minimum payment
    const totalMinPayment = calculateTotalMinimumPayment();
    
    // Simulate payments
    let months = 0;
    const maxMonths = 360; // 30 years max
    
    while (simulatedDebts.some(debt => debt.remainingAmount > 0) && months < maxMonths) {
      months++;
      
      let remainingPayment = totalMinPayment;
      
      // Pay minimum on all debts
      simulatedDebts.forEach(debt => {
        if (debt.remainingAmount > 0) {
          const payment = Math.min(debt.minimumPayment, debt.remainingAmount);
          debt.remainingAmount -= payment;
          remainingPayment -= payment;
        }
      });
      
      // Apply extra payment to highest priority debt
      for (const debt of simulatedDebts) {
        if (debt.remainingAmount > 0 && remainingPayment > 0) {
          const extraPayment = Math.min(remainingPayment, debt.remainingAmount);
          debt.remainingAmount -= extraPayment;
          remainingPayment -= extraPayment;
          
          if (remainingPayment <= 0) {
            break;
          }
        }
      }
      
      // Apply interest
      simulatedDebts.forEach(debt => {
        if (debt.remainingAmount > 0) {
          // Monthly interest
          const monthlyInterest = debt.remainingAmount * (debt.interestRate / 100 / 12);
          debt.remainingAmount += monthlyInterest;
        }
      });
    }
    
    if (months >= maxMonths) {
      return "30年以上";
    }
    
    // Calculate payoff date
    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    
    return payoffDate;
  };

  const generateAmortizationSchedule = () => {
    if (debts.length === 0) {
      return [];
    }
    
    // Sort debts based on strategy
    const sortedDebts = [...debts].sort((a, b) => {
      if (repaymentStrategy === 'avalanche') {
        // Highest interest first
        return b.interestRate - a.interestRate;
      } else {
        // Lowest balance first
        return a.remainingAmount - b.remainingAmount;
      }
    });
    
    // Clone debts for simulation
    const simulatedDebts = sortedDebts.map(debt => ({
      ...debt,
      remainingAmount: debt.remainingAmount
    }));
    
    // Calculate total minimum payment
    const totalMinPayment = calculateTotalMinimumPayment();
    
    // Simulate payments
    const schedule = [];
    let months = 0;
    const maxMonths = 360; // 30 years max
    let totalPaid = 0;
    let totalInterestPaid = 0;
    
    while (simulatedDebts.some(debt => debt.remainingAmount > 0) && months < maxMonths) {
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      
      let monthlyPrincipal = 0;
      let monthlyInterest = 0;
      let remainingPayment = totalMinPayment;
      
      // Pay minimum on all debts
      simulatedDebts.forEach(debt => {
        if (debt.remainingAmount > 0) {
          const payment = Math.min(debt.minimumPayment, debt.remainingAmount);
          debt.remainingAmount -= payment;
          monthlyPrincipal += payment;
          remainingPayment -= payment;
        }
      });
      
      // Apply extra payment to highest priority debt
      for (const debt of simulatedDebts) {
        if (debt.remainingAmount > 0 && remainingPayment > 0) {
          const extraPayment = Math.min(remainingPayment, debt.remainingAmount);
          debt.remainingAmount -= extraPayment;
          monthlyPrincipal += extraPayment;
          remainingPayment -= extraPayment;
          
          if (remainingPayment <= 0) {
            break;
          }
        }
      }
      
      // Apply interest
      simulatedDebts.forEach(debt => {
        if (debt.remainingAmount > 0) {
          // Monthly interest
          const monthlyInterestAmount = debt.remainingAmount * (debt.interestRate / 100 / 12);
          debt.remainingAmount += monthlyInterestAmount;
          monthlyInterest += monthlyInterestAmount;
        }
      });
      
      totalPaid += monthlyPrincipal;
      totalInterestPaid += monthlyInterest;
      
      // Calculate total remaining
      const totalRemaining = simulatedDebts.reduce(
        (sum, debt) => sum + debt.remainingAmount, 
        0
      );
      
      schedule.push({
        month: months + 1,
        date,
        payment: monthlyPrincipal,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        totalPaid,
        totalInterestPaid,
        remainingBalance: totalRemaining,
        label: `${months + 1}ヶ月目`
      });
      
      months++;
    }
    
    return schedule;
  };

  const selectedDebt = selectedDebtId ? debts.find(d => d.id === selectedDebtId) : null;
  const amortizationSchedule = generateAmortizationSchedule();
  const payoffDate = calculatePayoffDate();
  
  // Total debt details
  const totalDebt = calculateTotalDebt();
  const totalMinPayment = calculateTotalMinimumPayment();
  
  // Calculate total interest over loan term
  const totalInterest = amortizationSchedule.length > 0 
    ? amortizationSchedule[amortizationSchedule.length - 1].totalInterestPaid 
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">借金返済計画</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>借金総額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalDebt)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {debts.length}件の借金
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>毎月の返済額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalMinPayment)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              最低返済額の合計
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>完済予定日</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {payoffDate 
                ? (typeof payoffDate === 'string' 
                   ? payoffDate 
                   : payoffDate.toLocaleDateString())
                : 'データなし'}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              総支払額: {formatCurrency(totalDebt + totalInterest)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>借金の追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  借金名
                </label>
                <Input
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                  placeholder="例: 住宅ローン"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  貸主/会社名
                </label>
                <Input
                  value={newDebt.creditor}
                  onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                  placeholder="例: 銀行名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  借入総額
                </label>
                <Input
                  type="number"
                  value={newDebt.totalAmount || ''}
                  onChange={(e) => setNewDebt({
                    ...newDebt,
                    totalAmount: parseFloat(e.target.value) || 0
                  })}
                  placeholder="例: 1000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  年利 (%)
                </label>
                <Input
                  type="number"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt({
                    ...newDebt,
                    interestRate: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  毎月の最低返済額
                </label>
                <Input
                  type="number"
                  value={newDebt.minimumPayment || ''}
                  onChange={(e) => setNewDebt({
                    ...newDebt,
                    minimumPayment: parseFloat(e.target.value) || 0
                  })}
                  placeholder="例: 30000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  支払日（毎月）
                </label>
                <Input
                  type="number"
                  value={newDebt.dueDate}
                  onChange={(e) => setNewDebt({
                    ...newDebt,
                    dueDate: parseInt(e.target.value) || 1
                  })}
                  min="1"
                  max="31"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  開始日
                </label>
                <DatePicker
                  value={newDebt.startDate}
                  onChange={(date) => date && setNewDebt({...newDebt, startDate: date})}
                />
              </div>
              
              <Button onClick={addDebt} className="w-full mt-4">借金を追加</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>借金一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                まだ借金が登録されていません。左のフォームから借金を追加してください。
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>借金名</TableHead>
                      <TableHead>貸主</TableHead>
                      <TableHead className="text-right">残高</TableHead>
                      <TableHead className="text-right">年利</TableHead>
                      <TableHead className="text-right">毎月の返済額</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt) => (
                      <TableRow 
                        key={debt.id} 
                        className={selectedDebtId === debt.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        onClick={() => setSelectedDebtId(debt.id)}
                      >
                        <TableCell className="font-medium">{debt.name}</TableCell>
                        <TableCell>{debt.creditor}</TableCell>
                        <TableCell className="text-right">{formatCurrency(debt.remainingAmount)}</TableCell>
                        <TableCell className="text-right">{debt.interestRate}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(debt.minimumPayment)}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDebts(debts.filter(d => d.id !== debt.id));
                              if (selectedDebtId === debt.id) {
                                setSelectedDebtId(null);
                              }
                            }}
                          >
                            削除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {selectedDebt && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">{selectedDebt.name}の詳細</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="block text-sm text-gray-500">借金総額</span>
                    <span className="text-xl font-bold">{formatCurrency(selectedDebt.totalAmount)}</span>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="block text-sm text-gray-500">残高</span>
                    <span className="text-xl font-bold">{formatCurrency(selectedDebt.remainingAmount)}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="block text-sm text-gray-500">返済進捗</span>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, 100 - (selectedDebt.remainingAmount / selectedDebt.totalAmount * 100))}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm mt-1 inline-block">
                      {Math.round(100 - (selectedDebt.remainingAmount / selectedDebt.totalAmount * 100))}% 完了
                    </span>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="block text-sm text-gray-500">支払日</span>
                    <span className="text-lg">毎月{selectedDebt.dueDate}日</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">返済記録を追加</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        支払日
                      </label>
                      <DatePicker
                        value={newPayment.date}
                        onChange={(date) => date && setNewPayment({...newPayment, date})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        支払額
                      </label>
                      <Input
                        type="number"
                        value={newPayment.amount || ''}
                        onChange={(e) => setNewPayment({
                          ...newPayment,
                          amount: parseFloat(e.target.value) || 0
                        })}
                        placeholder="例: 30000"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addPayment}>支払いを記録</Button>
                    </div>
                  </div>
                </div>
                
                {selectedDebt.payments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">支払い履歴</h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>日付</TableHead>
                            <TableHead className="text-right">金額</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedDebt.payments
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {debts.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>返済戦略</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">返済方法を選択</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="avalanche"
                          name="repayment-strategy"
                          value="avalanche"
                          checked={repaymentStrategy === 'avalanche'}
                          onChange={() => setRepaymentStrategy('avalanche')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="avalanche" className="font-medium">
                          アバランチ法（Avalanche）
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                        高金利の借金から優先的に返済する方法。長期的には総支払額が少なくなります。
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="radio"
                          id="snowball"
                          name="repayment-strategy"
                          value="snowball"
                          checked={repaymentStrategy === 'snowball'}
                          onChange={() => setRepaymentStrategy('snowball')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="snowball" className="font-medium">
                          スノーボール法（Snowball）
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                        残高が少ない借金から優先的に返済する方法。早期に借金を完済する達成感が得られます。
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">返済優先順位</h3>
                    <div className="space-y-2">
                      {debts
                        .sort((a, b) => {
                          if (repaymentStrategy === 'avalanche') {
                            return b.interestRate - a.interestRate;
                          } else {
                            return a.remainingAmount - b.remainingAmount;
                          }
                        })
                        .map((debt, index) => (
                          <div key={debt.id} className="flex justify-between items-center p-2 border-b">
                            <div>
                              <span className="font-bold mr-2">{index + 1}.</span>
                              <span className="font-medium">{debt.name}</span>
                              <span className="text-sm text-gray-500 block ml-6">
                                {repaymentStrategy === 'avalanche' 
                                  ? `${debt.interestRate}%（年利）` 
                                  : formatCurrency(debt.remainingAmount)}
                              </span>
                            </div>
                            <div>
                              {repaymentStrategy === 'avalanche' 
                                ? formatCurrency(debt.remainingAmount)
                                : `${debt.interestRate}%`}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  {amortizationSchedule.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">返済プラン概要</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <span className="block text-sm text-gray-500">返済期間</span>
                          <span className="text-xl font-bold">
                            {amortizationSchedule.length}ヶ月（{Math.ceil(amortizationSchedule.length / 12)}年）
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <span className="block text-sm text-gray-500">総支払額</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(totalDebt + totalInterest)}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <span className="block text-sm text-gray-500">元金合計</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(totalDebt)}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <span className="block text-sm text-gray-500">利息合計</span>
                          <span className="text-xl font-bold">
                            {formatCurrency(totalInterest)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">アドバイス</h4>
                        <p className="text-sm">
                          {repaymentStrategy === 'avalanche'
                            ? `アバランチ法で返済することで、約${formatCurrency(totalInterest)}の利息を支払うことになります。`
                            : `スノーボール法は心理的な達成感を得られますが、アバランチ法に比べると長期的には支払総額が増加する可能性があります。`}
                        </p>
                        <p className="text-sm mt-2">
                          毎月の返済額を{formatCurrency(totalMinPayment * 1.1)}（+10%）に増やすと、
                          約{Math.round(amortizationSchedule.length * 0.1)}ヶ月早く完済できる可能性があります。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>返済シミュレーション</CardTitle>
            </CardHeader>
            <CardContent>
              {amortizationSchedule.length > 0 ? (
                <>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={amortizationSchedule}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="label" 
                          ticks={amortizationSchedule
                            .filter((_, index) => index % 12 === 0)
                            .map((schedule) => schedule.label)}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => 
                            typeof value === 'number' ? formatCurrency(value) : value
                          }
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
                          dataKey="totalInterestPaid" 
                          name="累計支払利息" 
                          stroke="#ffc658" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>期間</TableHead>
                          <TableHead>日付</TableHead>
                          <TableHead className="text-right">支払額</TableHead>
                          <TableHead className="text-right">元金</TableHead>
                          <TableHead className="text-right">利息</TableHead>
                          <TableHead className="text-right">残高</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amortizationSchedule
                          .filter((_, index) => index % 12 === 0) // 1年ごとに表示
                          .map((schedule) => (
                            <TableRow key={schedule.month}>
                              <TableCell>{Math.ceil(schedule.month / 12)}年目</TableCell>
                              <TableCell>{schedule.date.toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">{formatCurrency(schedule.payment + schedule.interest)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(schedule.payment)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(schedule.interest)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(schedule.remainingBalance)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  借金情報を追加すると、返済シミュレーションが表示されます。
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
