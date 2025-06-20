"use client";

import { useState } from "react";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/helpers";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogoutConfirmModal } from "../account/components/LogoutModel";
import Edit from "../account/components/Edit";

export default function AccountSwitcher() {
  const { user } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);

    router.push("/login");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 rounded-lg">
            <AvatarImage
              src={user?.profile ?? "/avatars/jay.png"}
              alt={user?.name}
            />

            <AvatarFallback className="rounded-lg">
              {getInitials(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 space-y-1 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuItem>
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage
                  src={user?.profile ?? "/avatars/jay.png"}
                  alt={user?.name ?? ""}
                />

                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                setShowEditModal(true);
              }}
            >
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
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
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
