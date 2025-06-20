"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitials } from "@/utils/helpers";
import { useUserData } from "@/api/account";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogoutConfirmModal } from "../account/components/LogoutModel";
import Edit from "../account/components/Edit";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data } = useUserData();
  const { setUser, user } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, setUser]);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setDropdownOpen(false);
    router.push("/login");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={user?.profile ?? "/avatars/jay.png"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.profile ?? "/avatars/jay.png"}
                      alt={user?.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowEditModal(true);
                  }}
                >
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setShowLogoutModal(true);
                  setDropdownOpen(false);
                }}
              >
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {showLogoutModal && (
        <LogoutConfirmModal
          open={showLogoutModal}
          onOpenChange={(open) => {
            setShowLogoutModal(open);
            if (!open) {
              setDropdownOpen(false);
            }
          }}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      {showEditModal && (
        <Edit
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
    </>
  );
}
