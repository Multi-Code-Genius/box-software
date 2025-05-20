import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { Pen, X } from "lucide-react";
import { fetchUserData, UpdateUserData, uploadImage } from "@/api/account";

const Edit = ({ setShowEditModal }: any) => {
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
      !/^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Number  is required";
    } else if (formData.mobileNumber.length < 10) {
      newErrors.mobileNumber = "Number  must be at least 10 digits";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center w-[100vw] h-[100vh]">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] z-40 w-full" />

      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full z-50">
        <button
          onClick={() => setShowEditModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-5  cursor-pointer"
        >
          <X />
        </button>
        <div className="flex items-center justify-center flex-col gap-5">
          <form
            className="w-[100%] px-14 py-14 rounded-lg flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <div className="xl:h-38 xl:w-46 flex-shrink-0 relative w-20 h-20 mx-auto">
              <div className="relative group">
                <img
                  src={formData.profile_pic || localImage}
                  alt="user photo"
                  className="rounded-full xl:h-46 xl:w-46 h-20 w-20 object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="absolute bottom-3 xl:right-2 bg-white p-1 rounded-full shadow-md cursor-pointer xl:w-10 xl:h-10 right-[-1] h-6 w-6 flex items-center justify-center"
                  aria-label="Upload profile picture"
                >
                  <Pen color="black" size={18} />
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

            <Label className="mx-auto text-xl font-bold pt-5">
              Profile information
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
                <span className="text-red-500 text-xs">{errors.email}</span>
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
                <span className="text-red-500 text-xs">{errors.name}</span>
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
                <span className="text-red-500 text-xs">
                  {errors.mobileNumber}
                </span>
              )}
            </div>

            <div className="mx-auto px-5">
              <Button
                type="submit"
                disabled={isLoading}
                className=" cursor-pointer"
              >
                {isLoading ? "Submitting..." : "Submit info"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
