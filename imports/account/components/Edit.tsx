import {
  fetchUserData,
  uploadImage,
  useUpdateUserMutation,
} from "@/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FooterProfileProps {
  setShowEditModal: (value: boolean) => void;
  showEditModal: boolean;
}

const Edit: React.FC<FooterProfileProps> = ({
  setShowEditModal,
  showEditModal,
}) => {
  const { user, setUser, setUserImage } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const { mutate: upateUser } = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    profile_pic: "/images/profile.jpg",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    if (!showEditModal) return;

    const load = async () => {
      try {
        const data = await fetchUserData();
        setUser(data.user);
      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    };

    load();
  }, [showEditModal, setUser]);

  useEffect(() => {
    if (!user) return;
    setFormData({
      email: user.email ?? "",
      name: user.name ?? "",
      phone: user.phone ?? "",
      profile_pic: user.profile_pic ?? "/images/profile.jpg",
      address: user.address ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      zip_code: user.zip_code ?? "",
    });
    setLocalImage(user.profile_pic ?? null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const userId = user?.id;
    console.log(userId);

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    upateUser(
      { data: formData, id: userId },
      {
        onSuccess: () => {
          setUser({
            ...formData,
            id: userId,
            role: "",
          });
          setShowEditModal(false);
          setIsSaving(false);
        },
        onError: (err: any) => {
          console.error("Update failed:", err);
          setIsSaving(false);
        },
      }
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setLocalImage(url);
      setUserImage(url);
      setFormData((prev) => ({ ...prev, profile_pic: url }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-lg w-full gap-0">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogClose className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted" />
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="relative w-30 h-30">
              <img
                src={localImage ?? formData.profile_pic}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                  <div className="w-6 h-6 border-2 border-t-transparent border-black rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-3 bg-white p-2 rounded-full shadow-md"
              >
                <Pen size={16} />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <Label className="text-center mx-auto text-xl font-bold">
            Profile Information
          </Label>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Number"
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              type="tel"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter City"
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter Number"
            />
          </div>
          <div className="space-y-2">
            <Label>Zip code</Label>
            <Input
              type="number"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="Enter Zip code"
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
