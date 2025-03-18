export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Retourne directement les enfants sans ajouter de conteneur
  // pour éviter les doublons avec MainLayout
  return children;
} 