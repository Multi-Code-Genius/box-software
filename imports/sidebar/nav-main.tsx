"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { PlusCircleIcon, MailIcon, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  NavGroup,
  NavMainItem,
} from "@/imports/navigation/sidebar/sidebar-items";
import { useDashboardStore } from "@/store/dashboardStore";
import { useVenues } from "@/api/vanue";
import { useVenueStore } from "@/store/venueStore";
import { toast } from "sonner";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
    Soon
  </span>
);

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  isSubmenuOpen: (subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={isSubmenuOpen(item.subItems)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              disabled={item.comingSoon}
              isActive={isActive(item.url, item.subItems)}
              tooltip={item.title}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              asChild
              aria-disabled={item.comingSoon}
              isActive={isActive(item.url)}
              tooltip={item.title}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    aria-disabled={subItem.comingSoon}
                    isActive={isActive(subItem.url)}
                    asChild
                  >
                    <Link href={subItem.url}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.comingSoon && <IsComingSoon />}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavItemCollapsed = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <SidebarMenuItem key={item.title}>
      {hasSubItems ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              disabled={item.comingSoon}
              tooltip={item.title}
              isActive={isActive(item.url, item.subItems)}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-50 space-y-1"
            side="right"
            align="start"
          >
            {item?.subItems?.map((subItem) => (
              <DropdownMenuItem key={subItem.title} asChild>
                {subItem.comingSoon ? (
                  <SidebarMenuSubButton
                    className="cursor-not-allowed opacity-60"
                    isActive={false}
                    aria-disabled
                  >
                    {subItem.icon && (
                      <subItem.icon className="[&>svg]:text-sidebar-foreground" />
                    )}
                    <span>{subItem.title}</span>
                    <IsComingSoon />
                  </SidebarMenuSubButton>
                ) : (
                  <SidebarMenuSubButton
                    asChild
                    className="focus-visible:ring-0"
                    isActive={isActive(subItem.url)}
                  >
                    <Link href={subItem.url}>
                      {subItem.icon && (
                        <subItem.icon className="[&>svg]:text-sidebar-foreground" />
                      )}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : item.comingSoon ? (
        <div className="opacity-60">
          <SidebarMenuButton disabled tooltip={item.title} isActive={false}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <IsComingSoon />
          </SidebarMenuButton>
        </div>
      ) : (
        <Link href={item.url}>
          <SidebarMenuButton tooltip={item.title} isActive={isActive(item.url)}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </Link>
      )}
    </SidebarMenuItem>
  );
};

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();
  const { state, isMobile } = useSidebar();
  const router = useRouter();
  const { venue } = useVenueStore();

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url));
    }
    return path === url;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) => {
    return subItems?.some((sub) => path.startsWith(sub.url)) ?? false;
  };

  const handleVenueClick = (venue: any) => {
    if (venue?.id) {
      const hourlyPrice = venue?.ground_details?.[0]?.hourly_price ?? 0;
      const grounds = venue?.ground_details?.[0]?.ground ?? 0;

      router.push(
        `/schedule/${venue.id}?id=${venue.id}&name=${encodeURIComponent(
          venue.name
        )}&price=${hourlyPrice}&grounds=${grounds}`
      );
    } else {
      toast.error("Venue not found");
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                onClick={() => handleVenueClick(venue)}
                tooltip="Quick Create"
                className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <PlusCircleIcon />
                <span>Quick Booking</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MailIcon />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) =>
                state === "collapsed" && !isMobile ? (
                  <NavItemCollapsed
                    key={item.title}
                    item={item}
                    isActive={isItemActive}
                  />
                ) : (
                  <NavItemExpanded
                    key={item.title}
                    item={item}
                    isActive={isItemActive}
                    isSubmenuOpen={isSubmenuOpen}
                  />
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
