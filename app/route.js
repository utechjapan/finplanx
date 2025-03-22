export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response('FinPlanX API is running', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}