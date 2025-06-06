"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormValidation } from "@/hooks/useFormValidation";
import { VenueFormData } from "@/types/vanue";
import {
  CircleAlert,
  FileText,
  Home,
  ImageUp,
  IndianRupee,
  MapPin,
  User,
} from "lucide-react";
import { useAddGame, useVenues } from "@/api/vanue";

const initialFormData: VenueFormData = {
  name: "",
  description: "",
  category: "",
  hourlyPrice: 0,
  location: {
    city: "",
    lat: 0,
    lng: 0,
  },
  address: "",
  gameInfo: {
    type: "",
    maxPlayers: 0,
  },
  grounds: 0,
};

const Form: React.FC = () => {
  const [formData, setFormData] = useState<VenueFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { errors, validate } = useFormValidation();
  const { mutate } = useAddGame();
  const { refetch } = useVenues();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (["lat", "lng"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: parseFloat(value),
        },
      }));
    } else if (["maxPlayers"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        gameInfo: {
          ...prev.gameInfo,
          [name]: parseInt(value),
        },
      }));
    } else if (name === "grounds" || name === "hourlyPrice") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(formData);
    if (!isValid) return;

    setLoading(true);

    mutate(formData, {
      onSuccess: () => {
        refetch();
        setFormData(initialFormData);
        setPreview(null);
      },
      onError: (error) => {
        console.error("Error adding venue:", error);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  const handleTurfTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gameInfo: {
        ...prev.gameInfo,
        type: value,
      },
    }));
  };

  return (
    <div className="h-[calc(100vh-75px)] w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] flex flex-col gap-4 border px-10 py-8 shadow-lg rounded-lg"
      >
        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Name</Label>

            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter venue name"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.name && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label>Description</Label>

            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.description && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>City</Label>
            <Input
              name="city"
              value={formData.location.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    city: e.target.value,
                  },
                }))
              }
              placeholder="Enter city"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.city && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.city}
              </div>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label>Address</Label>

            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.address && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.address}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full flex items-center justify-between border-border bg-card">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Cricket">Cricket</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.category}
              </div>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label>Hourly Price</Label>

            <Input
              name="hourlyPrice"
              type="number"
              value={formData.hourlyPrice}
              onChange={handleChange}
              placeholder="Hourly price"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.hourlyPrice && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.hourlyPrice}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Turf Type</Label>
          <RadioGroup
            className="flex gap-4"
            value={formData.gameInfo.type}
            onValueChange={handleTurfTypeChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="indoor" id="indoor" className="sr-only" />
              <label
                htmlFor="indoor"
                className={`cursor-pointer px-10 py-1 rounded-lg border border-border bg-card${
                  formData.gameInfo.type === "indoor"
                    ? "border border-primary focus-visible:ring-0 border-border"
                    : " "
                }`}
              >
                Indoor
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="outdoor"
                id="outdoor"
                className="sr-only"
              />
              <label
                htmlFor="outdoor"
                className={`cursor-pointer px-10 py-1 rounded-lg border-border bg-card ${
                  formData.gameInfo.type === "outdoor"
                    ? "border border-primary focus-visible:ring-0 bg-transparent"
                    : "border "
                }`}
              >
                Outdoor
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roof" id="roof" className="sr-only" />
              <label
                htmlFor="roof"
                className={`cursor-pointer px-10 py-1 rounded-lg border-border bg-card ${
                  formData.gameInfo.type === "roof"
                    ? "border border-primary focus-visible:ring-0 bg-transparent"
                    : "border  "
                }`}
              >
                Roof
              </label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Latitude</Label>
            <Input
              name="lat"
              type="number"
              value={formData.location.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="border focus-visible:ring-0 border-border bg-card"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label>Longitude</Label>
            <Input
              name="lng"
              type="number"
              value={formData.location.lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="border focus-visible:ring-0 border-border bg-card"
            />
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Max Players</Label>
            <Input
              name="maxPlayers"
              type="number"
              value={formData.gameInfo.maxPlayers}
              onChange={handleChange}
              placeholder="Max players"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.maxPlayers && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.maxPlayers}
              </div>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label>Grounds</Label>
            <Input
              name="grounds"
              type="number"
              value={formData.grounds}
              onChange={handleChange}
              placeholder="Number of grounds"
              className="border focus-visible:ring-0 border-border bg-card"
            />
            {errors.grounds && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <CircleAlert size={16} /> {errors.grounds}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Upload Image</Label>
          <div className="flex items-center space-x-4 ">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg  bg-card">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <ImageUp />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {errors.image && (
              <span className="text-sm text-red-500">{errors.image}</span>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={loading} className="w-1/2">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
