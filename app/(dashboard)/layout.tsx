import { ReactNode } from "react";

import { cookies } from "next/headers";

import {
  getSidebarCollapsible,
  getSidebarVariant,
} from "@/lib/layout-preferences";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/imports/sidebar/app-sidebar";
import LayoutControls from "@/imports/sidebar/layout-controls";
import ThemeSwitcher from "@/imports/sidebar/theme-switcher";
import AccountSwitcher from "@/imports/sidebar/account-switcher";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const sidebarVariant = await getSidebarVariant();
  const sidebarCollapsible = await getSidebarCollapsible();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-base font-medium">Documents</h1>
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls
                variant={sidebarVariant}
                collapsible={sidebarCollapsible}
              />
              <ThemeSwitcher />
              <AccountSwitcher />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
