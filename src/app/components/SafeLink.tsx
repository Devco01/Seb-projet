'use client';

import { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  ({ href, children, className = '', onClick, ...rest }, ref) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Si onClick est fourni, l'exécuter d'abord
      if (onClick) {
        onClick(e);
      }

      // Si l'événement n'a pas été annulé et que ce n'est pas un lien externe
      if (!e.defaultPrevented && !href.startsWith('http') && !href.startsWith('mailto:')) {
        e.preventDefault();
        
        try {
          // Utiliser setTimeout pour éviter les problèmes de navigation
          setTimeout(() => {
            router.push(href);
          }, 100);
        } catch (error) {
          console.error('Erreur de navigation SafeLink:', error);
          // Fallback à la navigation native
          window.location.href = href;
        }
      }
    };

    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

SafeLink.displayName = 'SafeLink';

export default SafeLink; 