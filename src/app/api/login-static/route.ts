import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    // Vérification simple des identifiants en dur
    if (email === 'admin@example.com' && password === 'admin123') {
      const oneDay = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
      
      // Créer la réponse
      const response = NextResponse.json({
        success: true,
        message: 'Authentification réussie'
      });
      
      // Ajouter le cookie directement à la réponse
      response.cookies.set({
        name: 'user-session',
        value: JSON.stringify({
          id: '1',
          email: 'admin@example.com',
          isLoggedIn: true
        }),
        expires: new Date(Date.now() + oneDay),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return response;
    }
    
    // Authentification échouée
    return NextResponse.json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    }, { status: 401 });
    
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la tentative de connexion'
    }, { status: 500 });
  }
} 