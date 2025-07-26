import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'instructor',
    timestamp: new Date().toISOString()
  });
}