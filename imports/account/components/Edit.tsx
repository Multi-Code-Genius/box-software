import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { Pen } from "lucide-react";
import { fetchUserData, UpdateUserData, uploadImage } from "@/api/account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface FooterProfileProps {
  setShowEditModal: (value: boolean) => void;
  showEditModal: boolean;
}

const Edit: React.FC<FooterProfileProps> = ({
  setShowEditModal,
  showEditModal,
}) => {
  const { user, setUser, image, setUserImage } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobileNumber: "",
    profile_pic: "/images/profile.jpg",
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
      mobileNumber: user.mobileNumber ?? "",
      profile_pic: user.profile_pic ?? "/images/profile.jpg",
    });
    setLocalImage(user.profile_pic ?? null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      await UpdateUserData(formData);
      setUser(formData);
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
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
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogClose className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted" />
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
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
                className="absolute bottom-1 right-3 bg-white p-3 rounded-full shadow-md"
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
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter Number"
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
