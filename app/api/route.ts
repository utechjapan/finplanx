import { NextRequest, NextResponse } from 'next/server';

// GET route handler for API root
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'FinPlanX API is running',
    version: '1.0.0'
  });
}

// HEAD route handler for health checks
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}