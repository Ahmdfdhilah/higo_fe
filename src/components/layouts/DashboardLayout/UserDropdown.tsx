import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  User,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UserDropdownProps {
  collapsed?: boolean;
  className?: string;
}

export function UserDropdown({ collapsed = false, className }: UserDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Mock user data - replace with real auth
  const user = {
    nama: 'John Doe',
    email: 'john@example.com',
    is_active: true
  };
  const loading = false;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.nama) return 'U';
    const nameParts = user.nama.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return user.nama.charAt(0).toUpperCase();
  };

  // Get user display name with truncation
  const getUserDisplayName = (maxLength = 20) => {
    const name = user?.nama || 'User';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };


  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Add your logout logic here
      toast('Logout berhasil', {
        description: 'Anda telah berhasil keluar dari sistem.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user || loading) {
    return (
      <div className={cn("flex", collapsed ? "justify-center" : "justify-start", className)}>
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-muted rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", collapsed ? "justify-center" : "justify-start", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-transparent",
              collapsed ? "p-1.5 flex items-center justify-center h-auto" : "p-2 flex items-center space-x-2 w-full"
            )}
            disabled={isLoggingOut}
          >
            <div className="relative">
              <Avatar className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-6 w-6")}>
                {/* <AvatarImage src={fileUtils.getFullFileUrl(user?.avatar_file?.file_url || '')} alt={getUserDisplayName()} /> */}
                <AvatarFallback className={cn(collapsed ? "text-[10px]" : "text-xs")}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {/* Active user indicator */}
              {user.is_active && (
                <div className={cn(
                  "absolute bg-green-500 rounded-full border border-background",
                  collapsed ? "-top-0.5 -right-0.5 h-2 w-2" : "-top-1 -right-1 h-3 w-3"
                )}></div>
              )}
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]" title={user?.nama}>
                    {getUserDisplayName(18)}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={collapsed ? "start" : "end"} className="w-56" side={collapsed ? "right" : "bottom"}>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <span className="font-medium truncate" title={user?.nama}>{getUserDisplayName(25)}</span>
              {user.email && <span className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</span>}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}