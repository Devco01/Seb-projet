import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

// Configuration de l'authentification
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Identifiants",
      credentials: {
        username: { label: "Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Identifiants corrects fournis par le client
        const validUsername = "facturepro"; 
        const validPassword = "FacturePro@2023!";

        if (credentials?.username === validUsername && credentials?.password === validPassword) {
          return {
            id: "1",
            name: "Administrateur",
            email: "admin@exemple.fr",
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Force la redirection vers le dashboard après connexion réussie
      if (url === baseUrl || url === `${baseUrl}/` || url.startsWith(`${baseUrl}/api/auth`)) {
        return `${baseUrl}/dashboard`;
      }
      
      // Gérer explicitement l'URL de redirection
      // Les URL relatives ne doivent pas être traitées comme des URLs complètes
      if (url.startsWith('/')) {
        // C'est un chemin relatif, utiliser baseUrl
        return `${baseUrl}${url}`;
      }
      
      // Si l'URL commence par le baseUrl, on l'accepte
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Sinon, rediriger vers le dashboard
      return `${baseUrl}/dashboard`;
    }
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};

// Handler pour les routes d'authentification
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 