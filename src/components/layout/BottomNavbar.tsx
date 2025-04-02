
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, CheckCircle, HomeIcon, Settings, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: '/',
      icon: HomeIcon,
      label: 'Home',
    },
    {
      path: '/tasks',
      icon: CheckCircle,
      label: 'Tasks',
    },
    {
      path: '/add',
      icon: PlusCircle,
      label: 'Add',
      highlight: true,
    },
    {
      path: '/schedule',
      icon: CalendarDays,
      label: 'Schedule',
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-10">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center w-1/5 h-full transition-colors',
              isActive ? 'text-primary' : 'text-gray-500',
              item.highlight && !isActive && 'text-primary'
            )}
          >
            {item.highlight ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white -mt-8 shadow-lg">
                <item.icon className="h-6 w-6" />
              </div>
            ) : (
              <item.icon className="h-6 w-6" />
            )}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
