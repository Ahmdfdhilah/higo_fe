import { UserDropdown } from './UserDropdown';
import { cn } from '@/lib/utils';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {


  return (
    <>
      <div className={cn("border-t border-sidebar-border flex-shrink-0 mt-auto", collapsed ? "p-2 space-y-2" : "p-4 pt-3 space-y-3")}>
        <UserDropdown collapsed={collapsed} />
      </div>
    </>
  );
}