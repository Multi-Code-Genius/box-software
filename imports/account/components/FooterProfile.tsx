import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirmModal } from "./LogoutModel";
import { fetchUserData } from "@/api/account";
import { TbLogout } from "react-icons/tb";
import ProfileBedge from "./ProfileBedge";

const FooterProfile = () => {
  const { setUser, user } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const handleOpenForm = () => {
    setShowProfile((prev) => !prev);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, [setUser]);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowProfile(false);
  };

  return (
    <>
      <div
        className="border-t pt-4 overflow-hidden  relative "
        ref={profileRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex   items-center ">
          <div className="flex gap-3 w-[100%]">
            <button
              type="button"
              className="cursor-pointer w-fit"
              onClick={handleOpenForm}
              aria-label="Open user profile"
            >
              <Avatar>
                <AvatarImage
                  src={user?.profile_pic || "/images/profile.jpg"}
                  alt="profile"
                  className="rounded-full"
                />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </button>

            <div className="text-[13px] w-[100%] ">
              <div className="flex justify-between ">
                <p>{user?.name || "User"}</p>
                <div>
                  <TbLogout
                    className="cursor-pointer text-xl"
                    onClick={() => setShowLogoutModal(true)}
                  />
                  <LogoutConfirmModal
                    open={showLogoutModal}
                    onOpenChange={setShowLogoutModal}
                    onConfirm={handleLogoutConfirm}
                    onCancel={() => setShowLogoutModal(false)}
                  />
                </div>
              </div>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        <ProfileBedge
          setShowProfile={setShowProfile}
          showProfile={showProfile}
        />
      </div>
    </>
  );
};

export default FooterProfile;
