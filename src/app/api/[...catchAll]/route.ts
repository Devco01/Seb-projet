import { NextRequest, NextResponse } from 'next/server';

// Cette route intercepte toutes les requêtes API qui ne sont pas gérées
// et renvoie une réponse JSON appropriée au lieu d'un HTML
export async function GET(request: NextRequest, props: { params: Promise<{ catchAll: string[] }> }) {
  const params = await props.params;
  const path = params.catchAll.join('/');

  console.log(`Route API non trouvée: /${path}`);

  return NextResponse.json({
    error: 'Route API non trouvée',
    path: `/${path}`,
  }, { status: 404 });
}

export async function POST(request: NextRequest, props: { params: Promise<{ catchAll: string[] }> }) {
  const params = await props.params;
  const path = params.catchAll.join('/');

  console.log(`Route API non trouvée: /${path}`);

  return NextResponse.json({
    error: 'Route API non trouvée',
    path: `/${path}`,
  }, { status: 404 });
}

export async function PUT(request: NextRequest, props: { params: Promise<{ catchAll: string[] }> }) {
  const params = await props.params;
  const path = params.catchAll.join('/');

  console.log(`Route API non trouvée: /${path}`);

  return NextResponse.json({
    error: 'Route API non trouvée',
    path: `/${path}`,
  }, { status: 404 });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ catchAll: string[] }> }) {
  const params = await props.params;
  const path = params.catchAll.join('/');

  console.log(`Route API non trouvée: /${path}`);

  return NextResponse.json({
    error: 'Route API non trouvée',
    path: `/${path}`,
  }, { status: 404 });
} 