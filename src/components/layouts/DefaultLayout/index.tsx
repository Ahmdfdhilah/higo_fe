import { ReactNode } from 'react';

interface DefaultLayoutProps {
  children?: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="flex-1 min-h-screen">
      {children}
    </main>
  );
}