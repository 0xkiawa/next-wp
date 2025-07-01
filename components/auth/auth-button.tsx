'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Settings, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function AuthButton() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link 
        href={`/sign-up?redirect=${encodeURIComponent(pathname)}`}
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <User size={20} />
        <span className="text-sm font-medium hidden sm:inline">Sign Up</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/saved-articles" className="flex items-center gap-2">
            <Bookmark size={16} />
            Saved Articles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <Settings size={16} />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LogOut size={16} />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}