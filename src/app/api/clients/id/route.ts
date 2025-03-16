import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour le mode standalone
export const dynamic = 'force-dynamic';

type RouteParams = {
  params: {
    id: string;
  };
};
