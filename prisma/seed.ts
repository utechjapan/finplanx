// prisma/seed.ts
// データベースにシードデータを入れるためのスクリプト
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // デモユーザーの作成
  const hashedPassword = await hash('password123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'デモユーザー',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  console.log(`Created demo user: ${demoUser.email}`);

  // 支出カテゴリーのサンプルデータ
  const expenseCategories = [
    '家賃・住宅', '水道・光熱費', '通信費', '食費', '交通費', 
    '医療費', '教育費', '娯楽費', '保険', 'サブスクリプション', 'その他'
  ];

  // サンプル支出データ
  const expenses = [
    {
      name: '家賃',
      amount: 80000,
      category: '家賃・住宅',
      date: new Date(2025, 2, 25), // 2025年3月25日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '電気代',
      amount: 8000,
      category: '水道・光熱費',
      date: new Date(2025, 2, 15), // 2025年3月15日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '水道代',
      amount: 4000,
      category: '水道・光熱費',
      date: new Date(2025, 2, 20), // 2025年3月20日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: 'インターネット',
      amount: 5200,
      category: '通信費',
      date: new Date(2025, 2, 10), // 2025年3月10日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '携帯電話',
      amount: 3980,
      category: '通信費',
      date: new Date(2025, 2, 5), // 2025年3月5日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '食料品',
      amount: 40000,
      category: '食費',
      date: new Date(2025, 2, 1), // 2025年3月1日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '交通費',
      amount: 12000,
      category: '交通費',
      date: new Date(2025, 2, 1), // 2025年3月1日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: '映画館',
      amount: 3600,
      category: '娯楽費',
      date: new Date(2025, 2, 12), // 2025年3月12日
      recurring: false,
    },
  ];

  // 支出データをデータベースに追加
  for (const expense of expenses) {
    await prisma.expense.create({
      data: {
        userId: demoUser.id,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        recurring: expense.recurring,
        frequency: expense.frequency,
        nextDate: expense.recurring
          ? new Date(expense.date.getFullYear(), expense.date.getMonth() + 1, expense.date.getDate())
          : undefined,
        description: `サンプル支出: ${expense.name}`,
      },
    });
  }
  console.log(`Created ${expenses.length} sample expenses`);

  // サンプル収入データ
  const incomes = [
    {
      name: '給与',
      amount: 290000,
      category: '給与',
      date: new Date(2025, 2, 25), // 2025年3月25日
      recurring: true,
      frequency: 'monthly',
    },
    {
      name: 'ボーナス',
      amount: 580000,
      category: 'ボーナス',
      date: new Date(2025, 5, 25), // 2025年6月25日
      recurring: false,
    },
    {
      name: '副業収入',
      amount: 50000,
      category: 'その他',
      date: new Date(2025, 2, 15), // 2025年3月15日
      recurring: true,
      frequency: 'monthly',
    },
  ];

  // 収入データをデータベースに追加
  for (const income of incomes) {
    await prisma.income.create({
      data: {
        userId: demoUser.id,
        name: income.name,
        amount: income.amount,
        category: income.category,
        date: income.date,
        recurring: income.recurring,
        frequency: income.frequency,
        nextDate: income.recurring
          ? new Date(income.date.getFullYear(), income.date.getMonth() + 1, income.date.getDate())
          : undefined,
        description: `サンプル収入: ${income.name}`,
      },
    });
  }
  console.log(`Created ${incomes.length} sample incomes`);

  // サンプル取引履歴データ
  const transactions = [
    {
      name: 'スーパーマーケット',
      amount: -5689,
      category: '食費',
      date: new Date(2025, 2, 2), // 2025年3月2日
      type: 'expense',
    },
    {
      name: 'カフェ',
      amount: -850,
      category: '食費',
      date: new Date(2025, 2, 3), // 2025年3月3日
      type: 'expense',
    },
    {
      name: '電車定期券',
      amount: -10800,
      category: '交通費',
      date: new Date(2025, 2, 5), // 2025年3月5日
      type: 'expense',
    },
    {
      name: '書籍購入',
      amount: -2800,
      category: '教育費',
      date: new Date(2025, 2, 8), // 2025年3月8日
      type: 'expense',
    },
    {
      name: '給与入金',
      amount: 290000,
      category: '給与',
      date: new Date(2025, 2, 25), // 2025年3月25日
      type: 'income',
    },
  ];

  // 取引データをデータベースに追加
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        userId: demoUser.id,
        name: transaction.name,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
        description: `サンプル取引: ${transaction.name}`,
      },
    });
  }
  console.log(`Created ${transactions.length} sample transactions`);

  // サンプル借金データ
  const debts = [
    {
      name: '住宅ローン',
      totalAmount: 25000000,
      remainingAmount: 22500000,
      interestRate: 1.2,
      startDate: new Date(2023, 3, 1), // 2023年4月1日
      minimumPayment: 85000,
      category: '住宅ローン',
    },
    {
      name: '自動車ローン',
      totalAmount: 1800000,
      remainingAmount: 1200000,
      interestRate: 2.5,
      startDate: new Date(2024, 6, 1), // 2024年7月1日
      minimumPayment: 30000,
      category: '自動車ローン',
    },
    {
      name: 'クレジットカード借入',
      totalAmount: 250000,
      remainingAmount: 230000,
      interestRate: 12.8,
      startDate: new Date(2025, 1, 15), // 2025年2月15日
      minimumPayment: 10000,
      category: 'クレジットカード',
    },
  ];

  // 借金データをデータベースに追加
  for (const debt of debts) {
    await prisma.debt.create({
      data: {
        userId: demoUser.id,
        name: debt.name,
        totalAmount: debt.totalAmount,
        remainingAmount: debt.remainingAmount,
        interestRate: debt.interestRate,
        startDate: debt.startDate,
        minimumPayment: debt.minimumPayment,
        category: debt.category,
        description: `サンプル借金: ${debt.name}`,
      },
    });
  }
  console.log(`Created ${debts.length} sample debts`);

  // サンプル投資データ
  const investments = [
    {
      name: 'インデックスファンド',
      amount: 1000000,
      currentValue: 1050000,
      type: '投資信託',
      startDate: new Date(2024, 0, 10), // 2024年1月10日
      returnRate: 5.0,
    },
    {
      name: '個別株式',
      amount: 500000,
      currentValue: 530000,
      type: '株式',
      startDate: new Date(2024, 3, 15), // 2024年4月15日
      returnRate: 6.0,
    },
    {
      name: 'NISA口座',
      amount: 1200000,
      currentValue: 1230000,
      type: 'NISA',
      startDate: new Date(2023, 0, 15), // 2023年1月15日
      returnRate: 2.5,
    },
  ];

  // 投資データをデータベースに追加
  for (const investment of investments) {
    await prisma.investment.create({
      data: {
        userId: demoUser.id,
        name: investment.name,
        amount: investment.amount,
        currentValue: investment.currentValue,
        type: investment.type,
        startDate: investment.startDate,
        returnRate: investment.returnRate,
        description: `サンプル投資: ${investment.name}`,
      },
    });
  }
  console.log(`Created ${investments.length} sample investments`);

  // サンプル予算データ
  const budgets = [
    {
      name: '食費予算',
      amount: 50000,
      category: '食費',
      startDate: new Date(2025, 2, 1), // 2025年3月1日
      endDate: new Date(2025, 2, 31), // 2025年3月31日
    },
    {
      name: '娯楽費予算',
      amount: 20000,
      category: '娯楽費',
      startDate: new Date(2025, 2, 1), // 2025年3月1日
      endDate: new Date(2025, 2, 31), // 2025年3月31日
    },
    {
      name: '交際費予算',
      amount: 15000,
      category: 'その他',
      startDate: new Date(2025, 2, 1), // 2025年3月1日
      endDate: new Date(2025, 2, 31), // 2025年3月31日
    },
  ];

  // 予算データをデータベースに追加
  for (const budget of budgets) {
    await prisma.budget.create({
      data: {
        userId: demoUser.id,
        name: budget.name,
        amount: budget.amount,
        category: budget.category,
        startDate: budget.startDate,
        endDate: budget.endDate,
        description: `サンプル予算: ${budget.name}`,
      },
    });
  }
  console.log(`Created ${budgets.length} sample budgets`);

  // サンプル目標データ
  const goals = [
    {
      name: '貯蓄目標',
      targetAmount: 5000000,
      currentAmount: 1200000,
      category: '貯蓄',
      startDate: new Date(2025, 0, 1), // 2025年1月1日
      targetDate: new Date(2026, 11, 31), // 2026年12月31日
    },
    {
      name: '海外旅行資金',
      targetAmount: 500000,
      currentAmount: 150000,
      category: '旅行',
      startDate: new Date(2025, 0, 1), // 2025年1月1日
      targetDate: new Date(2025, 7, 31), // 2025年8月31日
    },
    {
      name: '新車購入',
      targetAmount: 2000000,
      currentAmount: 800000,
      category: '自動車',
      startDate: new Date(2024, 6, 1), // 2024年7月1日
      targetDate: new Date(2026, 5, 30), // 2026年6月30日
    },
  ];

  // 目標データをデータベースに追加
  for (const goal of goals) {
    await prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        category: goal.category,
        startDate: goal.startDate,
        targetDate: goal.targetDate,
        description: `サンプル目標: ${goal.name}`,
      },
    });
  }
  console.log(`Created ${goals.length} sample goals`);

  // サンプル通知データ
  const notifications = [
    {
      title: '家賃の支払い期限',
      message: '25日までに家賃の支払いを忘れないでください',
      type: 'expense_reminder',
      targetDate: new Date(new Date().setDate(25)),
      isRead: false,
    },
    {
      title: '水道光熱費の支払い',
      message: '今月の水道光熱費の支払い期限は28日です',
      type: 'expense_reminder',
      targetDate: new Date(new Date().setDate(28)),
      isRead: true,
    },
    {
      title: '投資ポートフォリオの確認',
      message: '半年に一度のポートフォリオリバランスを行う時期です',
      type: 'investment_update',
      targetDate: new Date(),
      isRead: false,
    },
  ];

  // 通知データをデータベースに追加
  for (const notification of notifications) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        targetDate: notification.targetDate,
        isRead: notification.isRead,
      },
    });
  }
  console.log(`Created ${notifications.length} sample notifications`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
