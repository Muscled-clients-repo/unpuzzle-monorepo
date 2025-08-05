"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@unpuzzle/auth';
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

// TODO: Replace with your actual authentication check
async function auth() {
  return { id: 'user-123', email: 'student@example.com', name: 'John Doe' };
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current?: boolean;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Learning', href: '/dashboard/my-learning', icon: BookOpenIcon },
  { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartPieIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
];

const secondaryNavigation: SidebarItem[] = [
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Logout', href: '/logout', icon: ArrowRightStartOnRectangleIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPath: string;
}

function Sidebar({ sidebarOpen, setSidebarOpen, currentPath }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
            <SidebarContent currentPath={currentPath} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <SidebarContent currentPath={currentPath} />
      </div>
    </>
  );
}

interface SidebarContentProps {
  currentPath: string;
  onClose?: () => void;
}

function SidebarContent({ currentPath, onClose }: SidebarContentProps) {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        <div className="flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Unpuzzle</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="lg:hidden"
            onClick={onClose}
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 pb-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={user?.image_url || "/assets/profileUser.svg"} 
              alt="Profile" 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/userAvatar.svg';
                e.currentTarget.onerror = null;
              }}
            />
          </div>
          <div className="min-w-0 flex-1" style={{ marginLeft: '16px' }}>
            <p className="text-sm font-semibold text-gray-900">
              {isLoading ? 'Loading...' : (
                user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user?.first_name || 'Student'
              )}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {isLoading ? '...' : (user?.email || 'No email provided')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isCurrent = currentPath === item.href || 
                  (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                        'group flex items-center rounded-md p-3 text-sm font-medium transition-colors'
                      )}
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={classNames(
                            isCurrent ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700',
                            'h-6 w-6 shrink-0'
                          )}
                        />
                      </div>
                      <span style={{ marginLeft: '16px' }}>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          {/* Secondary navigation */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => {
                const isCurrent = currentPath === item.href;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isCurrent
                          ? 'bg-gray-50 text-gray-900'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        item.name === 'Logout' 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          : '',
                        'group flex items-center rounded-md p-3 text-sm font-medium transition-colors'
                      )}
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={classNames(
                            isCurrent ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900',
                            item.name === 'Logout' 
                              ? 'text-red-400 group-hover:text-red-600'
                              : '',
                            'h-6 w-6 shrink-0'
                          )}
                        />
                      </div>
                      <span style={{ marginLeft: '16px' }}>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // TODO: Implement actual authentication check
  // const user = await auth();
  // if (!user) {
  //   redirect('/login');
  // }

  return (
    <div className="flex max-h-[100vh] bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentPath={pathname || '/dashboard'} 
      />

      {/* Main content - scrollable */}
      <div className="flex-1 max-h-screen h-screen overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}