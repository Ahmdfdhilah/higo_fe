import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ collapsed, onToggleCollapse }: SidebarHeaderProps) {
  
  return (
    <>
      <div className={cn("flex h-14 lg:h-16 items-center flex-shrink-0 border-b border-sidebar-border", collapsed ? "px-2 lg:px-3 justify-center" : "px-4 lg:px-6 justify-between")}>
        <Link href="/" className={cn("flex items-center min-w-0", collapsed ? "justify-center" : "space-x-2")}>
          <div className={cn("transition-all duration-300 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold", collapsed ? "w-8 h-8 text-sm" : "w-32 h-12 text-xl")}>
            {collapsed ? 'H' : 'Higo'}
          </div>
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex h-11 w-11 p-0 flex-shrink-0"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center px-2 lg:px-3 py-2 border-b border-sidebar-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 p-0"
            onClick={onToggleCollapse}
            title="Expand sidebar"
          >
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      )}
    </>
  );
}