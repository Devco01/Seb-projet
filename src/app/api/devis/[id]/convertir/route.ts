import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Conversion du devis:", params.id);
    
    // Simulation d'une réponse
    return NextResponse.json({
      success: true,
      message: "Conversion effectuée avec succès",
      factureId: Math.floor(Math.random() * 1000)
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Mocked function for development
export async function POSTMock(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulation d'une réponse
    return NextResponse.json({
      success: true,
      message: "Conversion effectuée avec succès",
      factureId: Math.floor(Math.random() * 1000)
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 