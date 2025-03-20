// src/components/finance/DebtRepaymentPlanner.tsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Slider } from '../ui/Slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

const debtSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  totalAmount: z.number().positive('金額は0より大きい数値を入力してください'),
  interestRate: z.number().min(0, '金利は0以上を入力してください'),
  minimumPayment: z.number().positive('最低返済額は0より大きい数値を入力してください'),
  years: z.number().int().min(1).max(30),
});

type DebtFormData = z.infer<typeof debtSchema>;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DebtRepaymentPlanner: React.FC = () => {
  const [debts, setDebts] = useState<any[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [totalPayment, setTotalPayment] = useState(0);
  const [repaymentSchedule, setRepaymentSchedule] = useState<any[]>([]);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: '',
      totalAmount: 0,
      interestRate: 0,
      minimumPayment: 0,
      years: 5,
    },
  });
  
  const onSubmit = (data: DebtFormData) => {
    const newDebt = {
      ...data,
      remainingAmount: data.totalAmount,
      id: Date.now().toString(),
    };
    setDebts([...debts, newDebt]);
    reset();
  };
  
  useEffect(() => {
    if (debts.length === 0) {
      setRepaymentSchedule([]);
      setTotalPayment(0);
      return;
    }
    
    // Calculate total minimum payment
    const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    setTotalPayment(totalMinPayment);
    
    // Sort debts by strategy
    const sortedDebts = [...debts].sort((a, b) => {
      if (selectedStrategy === 'avalanche') {
        return b.interestRate - a.interestRate;
      } else {
        return a.remainingAmount - b.remainingAmount;
      }
    });
    
    // Generate repayment schedule
    const schedule: any[] = [];
    let currentDebts = sortedDebts.map(debt => ({ ...debt }));
    let month = 1;
    let totalInterestPaid = 0;
    
    while (currentDebts.some(debt => debt.remainingAmount > 0) && month <= 360) { // max 30 years
      const monthData: any = {
        month,
        date: `${Math.floor((month - 1) / 12) + 1}年${((month - 1) % 12) + 1}月`,
        totalRemaining: 0,
        totalPaid: 0,
        totalInterest: 0,
      };
      
      let availablePayment = totalMinPayment;
      
      // Pay minimum on all debts
      currentDebts.forEach((debt, index) => {
        if (debt.remainingAmount <= 0) return;
        
        const interestPayment = debt.remainingAmount * (debt.interestRate / 100 / 12);
        let principalPayment = Math.min(debt.minimumPayment - interestPayment, debt.remainingAmount);
        availablePayment -= (principalPayment + interestPayment);
        
        debt.remainingAmount -= principalPayment;
        totalInterestPaid += interestPayment;
        
        monthData[`debt${index+1}Remaining`] = debt.remainingAmount;
        monthData[`debt${index+1}Payment`] = principalPayment + interestPayment;
        monthData[`debt${index+1}Interest`] = interestPayment;
        
        monthData.totalRemaining += debt.remainingAmount;
        monthData.totalPaid += (principalPayment + interestPayment);
        monthData.totalInterest += interestPayment;
      });
      
      // Distribute extra payment to highest priority debt
      for (const debt of currentDebts) {
        if (debt.remainingAmount <= 0 || availablePayment <= 0) continue;
        
        const extraPayment = Math.min(availablePayment, debt.remainingAmount);
        debt.remainingAmount -= extraPayment;
        availablePayment -= extraPayment;
        
        // Update month data
        monthData.totalRemaining -= extraPayment;
        monthData.totalPaid += extraPayment;
      }
      
      monthData.totalInterestToDate = totalInterestPaid;
      schedule.push(monthData);
      month++;
      
      // Break if all debts are paid
      if (monthData.totalRemaining <= 0) break;
    }
    
    setRepaymentSchedule(schedule);
  }, [debts, selectedStrategy]);
  
  // Prepare data for charts
  const debtDistribution = debts.map((debt, index) => ({
    name: debt.name,
    value: debt.totalAmount,
    color: COLORS[index % COLORS.length],
  }));
  
  const chartData = repaymentSchedule.filter((_, index) => index % 12 === 0); // Yearly data points
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>借金情報登録</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">借金名</label>
                <Input 
                  id="name" 
                  {...register('name')}
                  className="mt-1"
                  placeholder="例: 住宅ローン、カードローン"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium">借金総額</label>
                <Input 
                  id="totalAmount" 
                  type="number"
                  {...register('totalAmount', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount.message}</p>}
              </div>
              
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium">金利(%)</label>
                <Input 
                  id="interestRate" 
                  type="number"
                  step="0.1"
                  {...register('interestRate', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.interestRate && <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>}
              </div>
              
              <div>
                <label htmlFor="minimumPayment" className="block text-sm font-medium">最低月返済額</label>
                <Input 
                  id="minimumPayment" 
                  type="number"
                  {...register('minimumPayment', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.minimumPayment && <p className="mt-1 text-sm text-red-600">{errors.minimumPayment.message}</p>}
              </div>
              
              <div>
                <label htmlFor="years" className="block text-sm font-medium">完済予定年数</label>
                <div className="flex items-center space-x-4">
                  <span>1年</span>
                  <Slider
                    id="years"
                    min={1}
                    max={30}
                    step={1}
                    {...register('years', { valueAsNumber: true })}
                    className="flex-1"
                  />
                  <span>30年</span>
                </div>
                <div className="text-center mt-1">
                  <span className="text-lg font-medium">{errors.years ? 0 : 5}年</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full">追加</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>借金内訳</CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={debtDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {debtDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                借金情報を追加してください
              </div>
            )}
            
            <div className="mt-4 space-y-2">
              {debts.map((debt, index) => (
                <div key={debt.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span>{debt.name}</span>
                  </div>
                  <div className="flex space-x-4">
                    <span>¥{debt.totalAmount.toLocaleString()}</span>
                    <span>{debt.interestRate}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDebts(debts.filter(d => d.id !== debt.id))}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {debts.length > 0 && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>返済戦略</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={selectedStrategy === 'avalanche' ? 'default' : 'outline'}
                  onClick={() => setSelectedStrategy('avalanche')}
                >
                  雪崩式 (高金利優先)
                </Button>
                <Button
                  variant={selectedStrategy === 'snowball' ? 'default' : 'outline'}
                  onClick={() => setSelectedStrategy('snowball')}
                >
                  雪だるま式 (少額優先)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">総借金額</p>
                  <p className="text-2xl font-bold">
                  ¥{debts.reduce((sum, debt) => sum + debt.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">月々の返済額</p>
                  <p className="text-2xl font-bold">¥{totalPayment.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500">完済までの期間</p>
                  <p className="text-2xl font-bold">
                    {repaymentSchedule.length > 0
                      ? `${Math.floor(repaymentSchedule.length / 12)}年${repaymentSchedule.length % 12}ヶ月`
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalRemaining" 
                      name="借金残高" 
                      stroke="#ff7f7f" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalInterestToDate" 
                      name="支払利息累計" 
                      stroke="#ffc658" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>期間</TableHead>
                      <TableHead>支払金額</TableHead>
                      <TableHead>うち利息</TableHead>
                      <TableHead>借金残高</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repaymentSchedule.filter((_, index) => index % 12 === 0).map((data) => (
                      <TableRow key={data.month}>
                        <TableCell>{data.date}</TableCell>
                        <TableCell>¥{data.totalPaid.toLocaleString()}</TableCell>
                        <TableCell>¥{data.totalInterest.toLocaleString()}</TableCell>
                        <TableCell>¥{data.totalRemaining.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DebtRepaymentPlanner;