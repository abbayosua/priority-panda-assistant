
import React from 'react';
import BottomNavbar from './BottomNavbar';
import { useApp } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, hideNav = false }) => {
  const { isLoading } = useApp();
  const isMobile = useIsMobile();

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${isMobile ? 'pb-16' : ''}`}>
      <main className="flex-1 p-4 max-w-6xl mx-auto w-full">
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          children
        )}
      </main>
      
      {!hideNav && <BottomNavbar />}
    </div>
  );
};

export default AppLayout;
