import { Link, useMatchRoute } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem, useAppConfig } from '@/hooks/use-app-config';
import { useOpen } from '@/hooks/use-open';
import { cn } from '@/lib/utils';

const NavMainItem = ({ item }: { item: NavItem }) => {
  const matchRoute = useMatchRoute();

  const { open, onOpenChange } = useOpen({
    defaultOpen:
      !!matchRoute({ to: item.location.href, fuzzy: false }) ||
      item.items?.some((subItem) =>
        matchRoute({ to: subItem.location.href, fuzzy: false })
      ),
  });

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      key={item.title}
      asChild>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          onClick={() => {
            onOpenChange(true);
          }}>
          <Link to={item.location.href}>
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        {item.items?.length && item.items.length > 0 ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction
                className='data-[state=open]:rotate-90'
                onClick={() => {
                  onOpenChange(!open);
                }}>
                <ChevronRight />
                <span className='sr-only'>Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      className={cn(
                        matchRoute({
                          to: subItem.location.href,
                          fuzzy: false,
                        }) &&
                          'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                      )}>
                      <Link to={subItem.location.href}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export const NavMain = () => {
  const { items } = useAppConfig();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem
            key={item.title}
            item={item}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
