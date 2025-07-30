import { Users, type LucideIcon } from 'lucide-react';

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: MenuItem[];
  isPlaceholder?: boolean;
  badge?: string;
}

export const menuItems: MenuItem[] = [
  {
    title: 'Customers',
    href: '/customers',
    icon: Users
  }
];