import {
  fetchUserData,
  uploadImage,
  useUpdateUserMutation,
} from "@/api/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { CircleAlert, Pencil } from "lucide-react";
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    profile_pic: "/avatars/jay.png",
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
      profile_pic: user.profile ?? "/avatars/jay.png",
      address: user.address ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      zip_code: user.zip_code ?? "",
    });
    setLocalImage(user.profile ?? null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const { [name]: removed, ...rest } = prevErrors;
        return rest;
      }
      return prevErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip_code.trim()) newErrors.zip_code = "Zip code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    upateUser(
      { data: formData, id: userId },
      {
        onSuccess: () => {
          setUser({ ...formData, id: userId, role: "" });
          setShowEditModal(false);
          setIsSaving(false);
          setErrors({});
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
          <DialogClose />
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="relative w-30 h-30 ">
              <img
                src={localImage ?? formData.profile_pic}
                alt="profile"
                className="rounded-full w-full h-full object-cover bg-white border border-4 border-foreground "
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                  <div className="w-6 h-6 border-2 border-t-transparent border-black rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-3 bg-card p-2 rounded-full shadow-xl"
              >
                <Pencil size={16} className="font-bolder" />
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
          <div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.email ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />
            </div>

            {errors.email && (
              <div className=" text-xs text-red-500 pl-1 pt-1">
                <span>{errors.email}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label className="text-[13px] font-normal">Name</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className={`border bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <div className=" text-xs text-red-500 pt-1 pl-1">
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label className="text-[13px] font-normal">Phone Number</Label>
              <div className="relative">
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Number"
                  className={`w-full border bg-card border-border focus:outline-none focus-visible:ring-0 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />

                {errors.phone && (
                  <div className=" text-xs text-red-500 pt-1 pl-1">
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <div className="space-y-2 w-full">
              <Label className="text-[13px] font-normal">City</Label>
              <div className="relative">
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className={`w-full border bg-card border-border focus:outline-none focus-visible:ring-0 ${
                    errors.city ? "border-red-500" : ""
                  }`}
                />
                {errors.city && (
                  <div className=" text-xs text-red-500 pt-1 pl-1">
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label className="text-[13px] font-normal">State</Label>
              <div>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  className={`w-full border bg-card border-border focus:outline-none focus-visible:ring-0 ${
                    errors.state ? "border-red-500" : ""
                  }`}
                />
                {errors.state && (
                  <div className=" text-xs text-red-500 pt-1 pl-1">
                    <span>{errors.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-normal">Zip code</Label>
            <div>
              <Input
                type="number"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="Enter Zip code"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.zip_code ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />
              {errors.zip_code && (
                <div className=" text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.zip_code}</span>
                </div>
              )}
            </div>
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
