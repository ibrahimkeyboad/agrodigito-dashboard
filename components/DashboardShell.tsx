'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  LogOut,
  Leaf,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen bg-[#F2F5F3] p-4 md:p-6 lg:flex lg:gap-6 font-sans text-slate-900 overflow-hidden'>
      {/* --- DESKTOP SIDEBAR (Floating Glass Style) --- */}
      <aside className='hidden lg:flex flex-col w-[280px] shrink-0 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden relative'>
        <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-50/80 to-transparent pointer-events-none' />

        {/* Logo Area */}
        <div className='relative px-6 py-8 flex items-center gap-3'>
          <div className='h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20'>
            <Leaf className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='font-bold text-xl tracking-tight text-slate-900'>
              AgroDigito
            </h1>
            <span className='text-xs font-medium text-green-600 tracking-wide uppercase'>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className='flex-1 px-4'>
          <div className='space-y-1 py-2'>
            <NavLabel>Overview</NavLabel>
            <NavItem href='/dashboard' icon={Home} label='Dashboard' />

            <NavLabel className='mt-6'>Management</NavLabel>
            <NavItem
              href='/dashboard/products'
              icon={Package}
              label='Products'
            />
            <NavItem
              href='/dashboard/orders'
              icon={ShoppingCart}
              label='Orders'
            />
            <NavItem href='/dashboard/users' icon={Users} label='Users' />

            <NavLabel className='mt-6'>System</NavLabel>
            <NavItem href='/settings' icon={Settings} label='Settings' />
          </div>
        </ScrollArea>

        {/* User Profile Footer */}
        <div className='p-4 mt-auto border-t border-slate-100 bg-slate-50/50'>
          <div className='flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm'>
            <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
              <AvatarImage src='/placeholder-user.jpg' alt='User' />
              <AvatarFallback className='bg-green-100 text-green-700 font-bold'>
                JD
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 overflow-hidden'>
              <p className='text-sm font-semibold truncate'>Jane Doe</p>
              <p className='text-xs text-slate-500 truncate'>Administrator</p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-slate-400 hover:text-red-500'>
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className='flex-1 flex flex-col min-w-0 rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden'>
        {/* Header */}
        <header className='h-20 px-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50'>
          {/* Mobile Menu Trigger */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='rounded-xl'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[300px] sm:w-[350px] p-0'>
                <div className='p-6'>
                  <h2 className='font-bold text-lg mb-6 flex items-center gap-2'>
                    <Leaf className='text-green-600' /> AgroDigito
                  </h2>
                  <nav className='flex flex-col gap-2'>
                    <NavItem href='/dashboard' icon={Home} label='Dashboard' />
                    <NavItem
                      href='/dashboard/products'
                      icon={Package}
                      label='Products'
                    />
                    <NavItem
                      href='/dashboard/orders'
                      icon={ShoppingCart}
                      label='Orders'
                    />
                    <NavItem
                      href='/dashboard/users'
                      icon={Users}
                      label='Users'
                    />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div className='hidden md:flex items-center flex-1 max-w-md mx-6'>
            <div className='relative w-full group'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors' />
              <Input
                placeholder='Search anything...'
                className='pl-10 h-11 rounded-2xl border-slate-200 bg-slate-50 focus-visible:ring-green-500/20 focus-visible:border-green-500 transition-all'
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-xl relative text-slate-500 hover:text-slate-700 hover:bg-slate-100'>
              <Bell className='h-5 w-5' />
              <span className='absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white' />
            </Button>

            <div className='h-8 w-px bg-slate-200 mx-1 hidden sm:block' />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='gap-2 rounded-xl pl-2 pr-3 hover:bg-slate-100 hidden sm:flex'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-green-600 text-white'>
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-medium text-slate-700'>
                    Admin Account
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56 rounded-xl p-2'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='rounded-lg cursor-pointer'>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className='rounded-lg cursor-pointer'>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='rounded-lg cursor-pointer text-red-600 focus:text-red-700'>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Scroller */}
        <ScrollArea className='flex-1 overflow-y-auto bg-slate-50/30'>
          <main className='p-6 lg:p-10 max-w-7xl mx-auto'>{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}

// --- Helper Components ---

function NavLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        'px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider',
        className,
      )}>
      {children}
    </h3>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {    
  href: string;
  icon: any;
  label: string;
}) {
  const pathname = usePathname();

  // FIX: Exact match for the root dashboard, loose match for sub-pages
  const isActive =
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
      )}>
      <div className='flex items-center gap-3'>
        <Icon
          className={cn(
            'h-5 w-5 transition-colors',
            isActive
              ? 'text-white'
              : 'text-slate-400 group-hover:text-slate-600',
          )}
        />
        <span>{label}</span>
      </div>

      {isActive ? (
        <ChevronRight className='h-4 w-4 text-green-200' />
      ) : null}
    </Link>
  );
}
