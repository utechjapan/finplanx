// app/finances/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/src/components/ui/Table';
import { DatePicker } from '@/src/components/ui/DatePicker';
import ExpenseReminderForm from '@/src/components/finance/ExpenseReminderForm';

export default function FinancesPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("calendar");

  // States for user input
  const [salaryInfo, setSalaryInfo] = useState({
    baseSalary: 0,
    overtimePay: 0,
    allowances: 0,
    closingDate: 20, // 毎月20日締め
    paymentDate: 25, // 毎月25日払い
    overtimeRate: 1.25, // 残業の割増率（例：1.25倍）
    holidayRate: 1.35, // 休日の割増率
    nightRate: 1.25, // 深夜の割増率
    bonusMonths: [6, 12], // ボーナス月（6月と12月）
    bonusAmount: 0, // ボーナス金額
  });

  // Form states as strings for better form control
  const [salaryInputs, setSalaryInputs] = useState({
    baseSalary: '',
    overtimePay: '',
    allowances: '',
    closingDate: '20',
    paymentDate: '25',
    overtimeRate: '1.25',
    holidayRate: '1.35',
    nightRate: '1.25',
    bonusAmount: '',
  });

  // Work hours tracking
  const [workHours, setWorkHours] = useState({
    date: new Date(),
    regularHours: 8, // 所定労働時間
    overtimeHours: 0, // 残業時間
    holidayHours: 0, // 休日労働時間
    nightHours: 0, // 深夜労働時間
  });

  // Work hours form state
  const [workHoursInputs, setWorkHoursInputs] = useState({
    regularHours: '8',
    overtimeHours: '0',
    holidayHours: '0',
    nightHours: '0',
  });

  // Work hours history
  const [workHoursHistory, setWorkHoursHistory] = useState<Array<{
    id: string,
    date: Date,
    regularHours: number,
    overtimeHours: number,
    holidayHours: number,
    nightHours: number,
    totalPay: number
  }>>([]);

  // Monthly expense schedule
  const [expenseSchedule, setExpenseSchedule] = useState<Array<{
    id: string,
    name: string,
    category: string,
    amount: number,
    dueDate: number, // Day of month
    isRecurring: boolean,
    startDate: Date,
    endDate?: Date
  }>>([]);

  // New expense input with string values for controlled inputs
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: '家賃・住宅',
    amount: '',
    dueDate: '1',
    isRecurring: true,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
  });

  // Expense transactions history
  const [expenseTransactions, setExpenseTransactions] = useState<Array<{
    id: string,
    date: Date,
    category: string,
    name: string,
    amount: number,
    isPaid: boolean
  }>>([]);

  // Current view month
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Form for new transaction with string values
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    category: '家賃・住宅',
    description: '',
    amount: '',
    isExpense: true
  });

  // Handle salary input changes
  const handleSalaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate numeric input
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setSalaryInputs({
        ...salaryInputs,
        [name]: value
      });
    }
  };

  // Update salary information from inputs
  const updateSalaryInfo = () => {
    setSalaryInfo({
      ...salaryInfo,
      baseSalary: parseFloat(salaryInputs.baseSalary) || 0,
      overtimePay: parseFloat(salaryInputs.overtimePay) || 0,
      allowances: parseFloat(salaryInputs.allowances) || 0,
      closingDate: parseInt(salaryInputs.closingDate) || 20,
      paymentDate: parseInt(salaryInputs.paymentDate) || 25,
      overtimeRate: parseFloat(salaryInputs.overtimeRate) || 1.25,
      holidayRate: parseFloat(salaryInputs.holidayRate) || 1.35,
      nightRate: parseFloat(salaryInputs.nightRate) || 1.25,
      bonusAmount: parseFloat(salaryInputs.bonusAmount) || 0,
    });
  };

  // Helper functions
  const calculateDailyPay = (hours: typeof workHours) => {
    const hourlyRate = salaryInfo.baseSalary / 160; // Assuming 8 hours/day, 20 days/month
    
    const regularPay = hourlyRate * hours.regularHours;
    const overtimePay = hourlyRate * hours.overtimeHours * salaryInfo.overtimeRate;
    const holidayPay = hourlyRate * hours.holidayHours * salaryInfo.holidayRate;
    const nightPay = hourlyRate * hours.nightHours * salaryInfo.nightRate;
    
    return Math.round(regularPay + overtimePay + holidayPay + nightPay);
  };

  // Handle work hours input changes
  const handleWorkHoursInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate numeric input
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setWorkHoursInputs({
        ...workHoursInputs,
        [name]: value
      });

      // Also update the workHours state with parsed numbers
      setWorkHours({
        ...workHours,
        [name]: parseFloat(value) || 0
      });
    }
  };

  // Add work hours
  const addWorkHours = () => {
    // Parse inputs to numbers
    const regularHours = parseFloat(workHoursInputs.regularHours) || 0;
    const overtimeHours = parseFloat(workHoursInputs.overtimeHours) || 0;
    const holidayHours = parseFloat(workHoursInputs.holidayHours) || 0;
    const nightHours = parseFloat(workHoursInputs.nightHours) || 0;
    
    if (regularHours === 0 && overtimeHours === 0 && holidayHours === 0 && nightHours === 0) {
      return;
    }
    
    const hours = {
      ...workHours,
      regularHours,
      overtimeHours,
      holidayHours,
      nightHours
    };
    
    const totalPay = calculateDailyPay(hours);
    
    const newEntry = {
      id: Date.now().toString(),
      date: new Date(workHours.date),
      regularHours,
      overtimeHours,
      holidayHours,
      nightHours,
      totalPay
    };
    
    setWorkHoursHistory([...workHoursHistory, newEntry]);
    
    // Reset form except date
    setWorkHoursInputs({
      regularHours: '8',
      overtimeHours: '0',
      holidayHours: '0',
      nightHours: '0',
    });
    
    setWorkHours({
      ...workHours,
      regularHours: 8,
      overtimeHours: 0,
      holidayHours: 0,
      nightHours: 0,
    });
  };

  // Handle expense input changes
  const handleExpenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'amount' || name === 'dueDate') {
      // Validate numeric input
      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
        setNewExpense({
          ...newExpense,
          [name]: value
        });
      }
    } else if (type === 'checkbox') {
      setNewExpense({
        ...newExpense,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setNewExpense({
        ...newExpense,
        [name]: value
      });
    }
  };

  // Add expense schedule
  const addExpenseSchedule = () => {
    if (!newExpense.name || !newExpense.amount) {
      return;
    }
    
    const amount = parseFloat(newExpense.amount);
    const dueDate = parseInt(newExpense.dueDate) || 1;
    
    if (isNaN(amount) || amount <= 0 || dueDate < 1 || dueDate > 31) {
      return;
    }
    
    const newScheduleItem = {
      id: Date.now().toString(),
      name: newExpense.name,
      category: newExpense.category,
      amount: amount,
      dueDate: dueDate,
      isRecurring: newExpense.isRecurring,
      startDate: new Date(newExpense.startDate),
      endDate: newExpense.endDate ? new Date(newExpense.endDate) : undefined
    };
    
    setExpenseSchedule([...expenseSchedule, newScheduleItem]);
    
    // Reset form
    setNewExpense({
      name: '',
      category: '家賃・住宅',
      amount: '',
      dueDate: '1',
      isRecurring: true,
      startDate: new Date(),
      endDate: undefined
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to display
    const prevMonthDays = [];
    if (firstDayOfWeek > 0) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = prevMonthLastDay - firstDayOfWeek + 1; i <= prevMonthLastDay; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          day: i,
          isCurrentMonth: false,
          events: []
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      
      // Find scheduled expenses for this day
      const events = expenseSchedule
        .filter(expense => {
          // Check if the expense is due on this day
          const isDueDay = expense.dueDate === i;
          
          // Check if the expense is active for this month
          const isAfterStart = date >= expense.startDate;
          const isBeforeEnd = !expense.endDate || date <= expense.endDate;
          
          return isDueDay && isAfterStart && isBeforeEnd;
        })
        .map(expense => ({
          id: expense.id,
          name: expense.name,
          amount: expense.amount,
          category: expense.category,
          isPaid: expenseTransactions.some(t => 
            t.name === expense.name && 
            t.date.getMonth() === date.getMonth() && 
            t.date.getFullYear() === date.getFullYear() &&
            t.isPaid
          )
        }));
      
      currentMonthDays.push({
        date,
        day: i,
        isCurrentMonth: true,
        events
      });
    }
    
    // Calculate days from next month to display to complete the grid
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = Math.ceil(totalDaysDisplayed / 7) * 7 - totalDaysDisplayed;
    
    const nextMonthDays = [];
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        day: i,
        isCurrentMonth: false,
        events: []
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Handle transaction input changes
  const handleTransactionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'amount') {
      // Validate numeric input
      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
        setNewTransaction({
          ...newTransaction,
          [name]: value
        });
      }
    } else if (type === 'radio') {
      setNewTransaction({
        ...newTransaction,
        isExpense: value === 'expense'
      });
    } else {
      setNewTransaction({
        ...newTransaction,
        [name]: value
      });
    }
  };

  // Add new transaction
  const handleNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0 || !newTransaction.description) return;
    
    const transaction = {
      id: Date.now().toString(),
      date: newTransaction.date,
      category: newTransaction.category,
      name: newTransaction.description,
      amount: newTransaction.isExpense ? -amount : amount,
      isPaid: true
    };
    
    setExpenseTransactions([...expenseTransactions, transaction]);
    
    // Reset form
    setNewTransaction({
      date: new Date(),
      category: '家賃・住宅',
      description: '',
      amount: '',
      isExpense: true
    });
  };

  // Calculate monthly income
  const calculateMonthlyIncome = () => {
    return salaryInfo.baseSalary + salaryInfo.overtimePay + salaryInfo.allowances;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  // Calendar days
  const calendarDays = generateCalendarDays();
  
  // Monthly totals
  const monthlyIncome = calculateMonthlyIncome();
  const monthlyExpenses = expenseSchedule
    .filter(expense => {
      const now = new Date();
      const isAfterStart = now >= expense.startDate;
      const isBeforeEnd = !expense.endDate || now <= expense.endDate;
      return expense.isRecurring && isAfterStart && isBeforeEnd;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlySavings = monthlyIncome - monthlyExpenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">収支管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>今月の収入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(monthlyIncome)}</div>
            <p className="text-sm text-gray-500 mt-2">給与と諸手当の合計</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(monthlyExpenses)}</div>
            <p className="text-sm text-gray-500 mt-2">予定された支出の合計</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${monthlySavings < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {formatCurrency(monthlySavings)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {monthlySavings < 0 ? '赤字です' : '黒字です'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="calendar" onValueChange={value => setActiveTab(value)}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="calendar" className="flex-1">カレンダー</TabsTrigger>
          <TabsTrigger value="income" className="flex-1">収入管理</TabsTrigger>
          <TabsTrigger value="expenses" className="flex-1">支出管理</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">取引履歴</TabsTrigger>
          <TabsTrigger value="reminders" className="flex-1">リマインダー</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>支出カレンダー</CardTitle>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const newDate = new Date(viewMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setViewMonth(newDate);
                    }}
                  >
                    前月
                  </Button>
                  <span className="font-medium">
                    {viewMonth.getFullYear()}年{viewMonth.getMonth() + 1}月
                  </span>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const newDate = new Date(viewMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setViewMonth(newDate);
                    }}
                  >
                    翌月
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                  <div key={day} className="text-center font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index}
                    className={`min-h-24 p-2 border rounded-md ${
                      day.isCurrentMonth 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="text-right font-medium">{day.day}</div>
                    <div className="mt-1 space-y-1">
                      {day.events.map(event => (
                        <div 
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            event.isPaid 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}
                          title={`${event.name}: ${formatCurrency(event.amount)}`}
                        >
                          {event.name}: {formatCurrency(event.amount)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>収入設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      基本給 (月)
                    </label>
                    <Input
                      type="text"
                      name="baseSalary"
                      value={salaryInputs.baseSalary}
                      onChange={handleSalaryInputChange}
                      placeholder="例: 250000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      みなし残業代 (月)
                    </label>
                    <Input
                      type="text"
                      name="overtimePay"
                      value={salaryInputs.overtimePay}
                      onChange={handleSalaryInputChange}
                      placeholder="例: 30000"
                    />
                  </div>
                  
                  <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     諸手当 (月)
                   </label>
                   <Input
                     type="text"
                     name="allowances"
                     value={salaryInputs.allowances}
                     onChange={handleSalaryInputChange}
                     placeholder="例: 20000"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     賞与 (回あたり)
                   </label>
                   <Input
                     type="text"
                     name="bonusAmount"
                     value={salaryInputs.bonusAmount}
                     onChange={handleSalaryInputChange}
                     placeholder="例: 500000"
                   />
                 </div>
                 
                 <div>
                   <Button 
                     onClick={updateSalaryInfo}
                     className="w-full"
                   >
                     収入情報を更新
                   </Button>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     給与締め日
                   </label>
                   <Input
                     type="text"
                     name="closingDate"
                     value={salaryInputs.closingDate}
                     onChange={handleSalaryInputChange}
                     min="1"
                     max="31"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     給与支払日
                   </label>
                   <Input
                     type="text"
                     name="paymentDate"
                     value={salaryInputs.paymentDate}
                     onChange={handleSalaryInputChange}
                     min="1"
                     max="31"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     残業割増率
                   </label>
                   <Input
                     type="text"
                     name="overtimeRate"
                     value={salaryInputs.overtimeRate}
                     onChange={handleSalaryInputChange}
                     min="1"
                     step="0.05"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     賞与支給月
                   </label>
                   <div className="flex flex-wrap gap-2">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                       <Button
                         key={month}
                         type="button"
                         variant={salaryInfo.bonusMonths.includes(month) ? "default" : "outline"}
                         size="sm"
                         onClick={() => {
                           if (salaryInfo.bonusMonths.includes(month)) {
                             setSalaryInfo({
                               ...salaryInfo,
                               bonusMonths: salaryInfo.bonusMonths.filter(m => m !== month)
                             });
                           } else {
                             setSalaryInfo({
                               ...salaryInfo,
                               bonusMonths: [...salaryInfo.bonusMonths, month].sort()
                             });
                           }
                         }}
                       >
                         {month}月
                       </Button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="mt-8 pt-6 border-t">
               <h3 className="text-lg font-medium mb-4">勤務時間記録</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     日付
                   </label>
                   <DatePicker
                     value={workHours.date}
                     onChange={(date) => date && setWorkHours({...workHours, date})}
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     所定労働時間
                   </label>
                   <Input
                     type="text"
                     name="regularHours"
                     value={workHoursInputs.regularHours}
                     onChange={handleWorkHoursInputChange}
                     min="0"
                     step="0.5"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     残業時間
                   </label>
                   <Input
                     type="text"
                     name="overtimeHours"
                     value={workHoursInputs.overtimeHours}
                     onChange={handleWorkHoursInputChange}
                     min="0"
                     step="0.5"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     休日労働時間
                   </label>
                   <Input
                     type="text"
                     name="holidayHours"
                     value={workHoursInputs.holidayHours}
                     onChange={handleWorkHoursInputChange}
                     min="0"
                     step="0.5"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     深夜労働時間
                   </label>
                   <Input
                     type="text"
                     name="nightHours"
                     value={workHoursInputs.nightHours}
                     onChange={handleWorkHoursInputChange}
                     min="0"
                     step="0.5"
                   />
                 </div>
                 
                 <div className="flex items-end">
                   <Button 
                     onClick={addWorkHours}
                     className="w-full"
                   >
                     勤務時間を記録
                   </Button>
                 </div>
               </div>
               
               {workHoursHistory.length > 0 && (
                 <div className="overflow-x-auto mt-4">
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>日付</TableHead>
                         <TableHead>所定時間</TableHead>
                         <TableHead>残業時間</TableHead>
                         <TableHead>休日時間</TableHead>
                         <TableHead>深夜時間</TableHead>
                         <TableHead className="text-right">総支払額</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {workHoursHistory.map((entry) => (
                         <TableRow key={entry.id}>
                           <TableCell>
                             {entry.date.toLocaleDateString()}
                           </TableCell>
                           <TableCell>{entry.regularHours}h</TableCell>
                           <TableCell>{entry.overtimeHours}h</TableCell>
                           <TableCell>{entry.holidayHours}h</TableCell>
                           <TableCell>{entry.nightHours}h</TableCell>
                           <TableCell className="text-right font-medium">
                             {formatCurrency(entry.totalPay)}
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               )}
             </div>
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="expenses" className="mt-6">
         <Card>
           <CardHeader>
             <CardTitle>定期支出の管理</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   支出名
                 </label>
                 <Input
                   name="name"
                   value={newExpense.name}
                   onChange={handleExpenseInputChange}
                   placeholder="例: 家賃"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   カテゴリ
                 </label>
                 <Select
                   name="category"
                   value={newExpense.category}
                   onChange={handleExpenseInputChange}
                 >
                   <option value="家賃・住宅">家賃・住宅</option>
                   <option value="水道・光熱費">水道・光熱費</option>
                   <option value="通信費">通信費</option>
                   <option value="保険">保険</option>
                   <option value="サブスクリプション">サブスクリプション</option>
                   <option value="ローン">ローン</option>
                   <option value="その他">その他</option>
                 </Select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   金額
                 </label>
                 <Input
                   type="text"
                   name="amount"
                   value={newExpense.amount}
                   onChange={handleExpenseInputChange}
                   placeholder="例: 80000"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   支払日（毎月）
                 </label>
                 <Input
                   type="text"
                   name="dueDate"
                   value={newExpense.dueDate}
                   onChange={handleExpenseInputChange}
                   min="1"
                   max="31"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   開始日
                 </label>
                 <DatePicker
                   value={newExpense.startDate}
                   onChange={(date) => date && setNewExpense({...newExpense, startDate: date})}
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   終了日（任意）
                 </label>
                 <DatePicker
                   value={newExpense.endDate}
                   onChange={(date) => setNewExpense({...newExpense, endDate: date})}
                 />
               </div>
               
               <div className="flex items-center space-x-2">
                 <input
                   type="checkbox"
                   id="isRecurring"
                   name="isRecurring"
                   checked={newExpense.isRecurring}
                   onChange={handleExpenseInputChange}
                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 />
                 <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   定期的な支出
                 </label>
               </div>
               
               <div className="flex items-end">
                 <Button 
                   onClick={addExpenseSchedule}
                   className="w-full"
                 >
                   支出を追加
                 </Button>
               </div>
             </div>
             
             {expenseSchedule.length > 0 && (
               <div className="overflow-x-auto mt-4">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>支出名</TableHead>
                       <TableHead>カテゴリ</TableHead>
                       <TableHead className="text-right">金額</TableHead>
                       <TableHead>支払日</TableHead>
                       <TableHead>開始日</TableHead>
                       <TableHead>終了日</TableHead>
                       <TableHead>定期的</TableHead>
                       <TableHead></TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {expenseSchedule.map((expense) => (
                       <TableRow key={expense.id}>
                         <TableCell className="font-medium">{expense.name}</TableCell>
                         <TableCell>{expense.category}</TableCell>
                         <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                         <TableCell>毎月{expense.dueDate}日</TableCell>
                         <TableCell>{expense.startDate.toLocaleDateString()}</TableCell>
                         <TableCell>
                           {expense.endDate ? expense.endDate.toLocaleDateString() : '無期限'}
                         </TableCell>
                         <TableCell>{expense.isRecurring ? '定期' : '単発'}</TableCell>
                         <TableCell>
                           <Button
                             variant="destructive"
                             size="sm"
                             onClick={() => {
                               setExpenseSchedule(expenseSchedule.filter(e => e.id !== expense.id));
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
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="transactions" className="mt-6">
         <Card>
           <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
             <CardTitle>取引履歴</CardTitle>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleNewTransaction} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
               <h3 className="text-lg font-medium mb-4">新規取引の追加</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="transaction-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     日付
                   </label>
                   <DatePicker
                     value={newTransaction.date}
                     onChange={(date) => date && setNewTransaction({...newTransaction, date})}
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     取引タイプ
                   </label>
                   <div className="flex space-x-4">
                     <label className="inline-flex items-center">
                       <input
                         type="radio"
                         name="transactionType"
                         value="expense"
                         checked={newTransaction.isExpense}
                         onChange={handleTransactionInputChange}
                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">支出</span>
                     </label>
                     <label className="inline-flex items-center">
                       <input
                         type="radio"
                         name="transactionType"
                         value="income"
                         checked={!newTransaction.isExpense}
                         onChange={handleTransactionInputChange}
                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">収入</span>
                     </label>
                   </div>
                 </div>
                 
                 <div>
                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     カテゴリ
                   </label>
                   <Select
                     id="category"
                     name="category"
                     value={newTransaction.category}
                     onChange={handleTransactionInputChange}
                   >
                     <option value="家賃・住宅">家賃・住宅</option>
                     <option value="水道・光熱費">水道・光熱費</option>
                     <option value="通信費">通信費</option>
                     <option value="食費">食費</option>
                     <option value="交通費">交通費</option>
                     <option value="医療費">医療費</option>
                     <option value="教育費">教育費</option>
                     <option value="娯楽費">娯楽費</option>
                     <option value="保険">保険</option>
                     <option value="サブスクリプション">サブスクリプション</option>
                     <option value="給与">給与</option>
                     <option value="ボーナス">ボーナス</option>
                     <option value="その他">その他</option>
                   </Select>
                 </div>
                 
                 <div>
                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     説明
                   </label>
                   <Input
                     id="description"
                     name="description"
                     value={newTransaction.description}
                     onChange={handleTransactionInputChange}
                     placeholder="例: スーパーで買い物"
                     required
                   />
                 </div>
                 
                 <div>
                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     金額
                   </label>
                   <Input
                     id="amount"
                     name="amount"
                     type="text"
                     value={newTransaction.amount}
                     onChange={handleTransactionInputChange}
                     placeholder="例: 1000"
                     required
                   />
                 </div>
                 
                 <div className="flex items-end">
                   <Button type="submit" className="w-full">
                     取引を追加
                   </Button>
                 </div>
               </div>
             </form>
             
             {expenseTransactions.length > 0 ? (
               <div className="overflow-x-auto">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>日付</TableHead>
                       <TableHead>カテゴリ</TableHead>
                       <TableHead>説明</TableHead>
                       <TableHead className="text-right">金額</TableHead>
                       <TableHead></TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {expenseTransactions.sort((a, b) => b.date.getTime() - a.date.getTime()).map((transaction) => (
                       <TableRow key={transaction.id}>
                         <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                         <TableCell>{transaction.category}</TableCell>
                         <TableCell>{transaction.name}</TableCell>
                         <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                           {formatCurrency(transaction.amount)}
                         </TableCell>
                         <TableCell>
                           <Button
                             variant="destructive"
                             size="sm"
                             onClick={() => {
                               setExpenseTransactions(expenseTransactions.filter(t => t.id !== transaction.id));
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
             ) : (
               <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                 まだ取引履歴がありません。新しい取引を追加してください。
               </div>
             )}
           </CardContent>
         </Card>
       </TabsContent>
       
       {/* New reminder tab */}
       <TabsContent value="reminders" className="mt-6">
         <ExpenseReminderForm onCreated={() => {
           // Additional logic when a reminder is created can be added here.
         }} />
       </TabsContent>
     </Tabs>
   </div>
 );
}