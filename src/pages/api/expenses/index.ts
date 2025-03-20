// src/pages/api/expenses/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const expenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: '有効な日付を入力してください',
  }),
  isRecurring: z.boolean().default(false),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = session.user.id;
  
  // GET: 全ての経費を取得
  if (req.method === 'GET') {
    try {
      const expenses = await prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });
      
      return res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // POST: 新しい経費を作成
  if (req.method === 'POST') {
    try {
      const validatedData = expenseSchema.parse(req.body);
      
      const expense = await prisma.expense.create({
        data: {
          amount: validatedData.amount,
          category: validatedData.category,
          description: validatedData.description,
          date: new Date(validatedData.date),
          isRecurring: validatedData.isRecurring,
          user: { connect: { id: userId } },
        },
      });
      
      return res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      console.error('Error creating expense:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}