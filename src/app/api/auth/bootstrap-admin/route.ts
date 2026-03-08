import { NextResponse } from 'next/server';
import {
  AdminBootstrapError,
  createInitialAdmin,
  hasAdminUser,
} from '@/lib/admin-bootstrap';

export async function GET() {
  const adminExists = await hasAdminUser();
  return NextResponse.json({ adminExists });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as
    | { email?: string; password?: string; name?: string }
    | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  try {
    const user = await createInitialAdmin({
      email: body.email,
      password: body.password,
      name: body.name,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AdminBootstrapError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Failed to bootstrap admin:', error);
    return NextResponse.json(
      { error: 'Failed to create the initial admin account.' },
      { status: 500 },
    );
  }
}
