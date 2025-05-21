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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ProfileBedgeProps {
  setShowEditModal: (value: boolean) => void;

  showEditModal: boolean;
}

const Edit: React.FC<ProfileBedgeProps> = ({
  setShowEditModal,
  showEditModal,
}) => {
  const { user, setUser } = useUserStore();
  const { image, setUserImage } = useUserStore();
  const [localImage, setLocalImage] = useState(image);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    mobileNumber: user?.mobileNumber || "",
    profile_pic: user?.profile_pic || "/images/profile.jpg",
  });

  const [errors, setErrors] = useState<{
    email: string | null;
    name: string | null;
    mobileNumber: string | null;
  }>({
    email: null,
    name: null,
    mobileNumber: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { email?: string; name?: string; mobileNumber?: string } =
      {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Number is required";
    } else if (formData.mobileNumber.length < 10) {
      newErrors.mobileNumber = "Number must be at least 10 digits";
    }

    setErrors({
      email: newErrors.email ?? null,
      name: newErrors.name ?? null,
      mobileNumber: newErrors.mobileNumber ?? null,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      const updatedUser = {
        email: formData.email,
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        profile_pic: formData.profile_pic,
      };

      setUser(updatedUser);

      try {
        await UpdateUserData(updatedUser);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user, image]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setUploading(true);
      try {
        const uploadedImageUrl = await uploadImage(file);
        setLocalImage(uploadedImageUrl);
        setUserImage(uploadedImageUrl);
        setFormData((prev) => ({
          ...prev,
          profile_pic: uploadedImageUrl,
        }));
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogClose
            asChild
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-muted"
          >
            {/* <X className="w-5 h-5" /> */}
          </DialogClose>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <img
                src={formData.profile_pic || localImage}
                alt="user photo"
                className="rounded-full w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                  <div className="w-6 h-6 border-2 border-t-transparent border-black rounded-full animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={handleButtonClick}
                className="absolute bottom-1 right-3 bg-white p-3 rounded-full shadow-md cursor-pointer"
              >
                <Pen size={16} />
              </button>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
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
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
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
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
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
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Info"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
