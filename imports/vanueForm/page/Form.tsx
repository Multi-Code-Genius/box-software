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
import { GroundDetails, VenueFormData } from "@/types/vanue";
import { CircleAlert, CircleMinus, CirclePlus, ImageUp } from "lucide-react";
import { useAddVenue, useVenues } from "@/api/vanue";

const initialFormData: VenueFormData = {
  name: "",
  description: "",
  category: "",
  location: {
    city: "",
    lat: 0,
    lng: 0,
    area: "",
  },
  address: "",
  game_info: {
    type: "",
    maxPlayers: 0,
  },
  ground_details: [
    {
      ground: 1,
      hourly_price: 0,
      capacity: 0,
      width: 0,
      height: 0,
    },
  ],
  images: [],
};

const Form: React.FC = () => {
  const [formData, setFormData] = useState<VenueFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  const { validate, errors, clearError } = useFormValidation();

  const { mutate } = useAddVenue();
  const { refetch } = useVenues();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    clearError(name);

    if (["lat", "lng", "city", "area"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: name === "lat" || name === "lng" ? parseFloat(value) : value,
        },
      }));
    } else if (name === "maxPlayers") {
      setFormData((prev) => ({
        ...prev,
        game_info: {
          ...prev.game_info,
          [name]: parseInt(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(formData);
    if (!isValid) return;

    setLoading(true);

    const formdata = new FormData();

    const data = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      location: {
        city: formData.location.city,
        lat: formData.location.lat,
        lng: formData.location.lng,
        area: formData.location.area,
      },
      address: formData.address,
      gameInfo: {
        type: formData.game_info.type,
        maxPlayers: formData.game_info.maxPlayers,
      },
      ground_details: formData.ground_details,
    };

    formdata.append("data", JSON.stringify(data));

    formData.images.forEach((file: File) => {
      formdata.append("images", file);
    });

    mutate(formdata, {
      onSuccess: () => {
        refetch();
        setFormData(initialFormData);
        setPreview([]);
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
    clearError("type");
    setFormData((prev) => ({
      ...prev,
      game_info: {
        ...prev.game_info,
        type: value,
      },
    }));
  };

  const handleSelectChange = (value: string) => {
    clearError("category");
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);

      selectedFiles.forEach((file) => {
        console.log("File name:", file.name);
        console.log("File type:", file.type);
        console.log("File size (bytes):", file.size);
      });

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }));

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleAddGroundDetail = () => {
    setFormData((prev) => ({
      ...prev,
      ground_details: [
        ...prev.ground_details,
        {
          ground: 0,
          hourly_price: 0,
          capacity: 0,
          width: 0,
          height: 0,
        },
      ],
    }));
  };

  const handleRemoveGroundDetail = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      ground_details: prev.ground_details.filter((_, i) => i !== indexToRemove),
    }));
  };
  const handleGroundFieldChange = (
    index: number,
    field: keyof (typeof formData.ground_details)[0],
    value: string
  ) => {
    const updated = [...formData.ground_details];

    const parsedValue =
      field === "hourly_price" ? parseFloat(value) : parseInt(value);
    updated[index][field] = isNaN(parsedValue) ? 0 : parsedValue;

    setFormData((prev) => ({
      ...prev,
      ground_details: updated,
    }));

    if (!isNaN(parsedValue)) {
      const errorKey = `${field}_${index}`;
      clearError(errorKey);
    }
  };

  return (
    <div className=" min-h-[calc(100vh-48px)]  w-full flex justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] border  overflow-y-auto flex flex-col gap-4 my-4 px-10 py-10 rounded-lg shadow-lg"
      >
        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Name</Label>
            <div className="relative">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter venue name"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.name ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />
              {errors.name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label>Description</Label>
            <div className="relative">
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.description ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />
              {errors.description && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Area</Label>
            <div className="relative">
              <Input
                name="area"
                value={formData.location.area}
                onChange={handleChange}
                placeholder="Enter area"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.area ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.area && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label>City</Label>
            <div className="relative">
              <Input
                name="city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.city ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.city && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Address</Label>
            <div className="relative">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.address ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.address && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 w-full">
            <Label>Max Players</Label>
            <div className="relative">
              <Input
                name="maxPlayers"
                type="number"
                value={
                  typeof formData.game_info.maxPlayers === "number" &&
                  !isNaN(formData.game_info.maxPlayers)
                    ? formData.game_info.maxPlayers
                    : ""
                }
                onChange={handleChange}
                placeholder="Max players"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.maxPlayers ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.maxPlayers && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label>Turf Type</Label>
          <div className="relative">
            <Select
              value={formData.game_info.type}
              onValueChange={handleTurfTypeChange}
            >
              <SelectTrigger
                className={`w-full flex items-center justify-between bg-card ${
                  errors.type
                    ? "border-red-500 ring-0 ring-red-500"
                    : "border-border"
                }`}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Cricket">Cricket</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                <CircleAlert size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 ">
          <Label className="text-sm">Category</Label>
          <div className="relative">
            <RadioGroup
              className="flex gap-4 "
              value={formData.game_info.type}
              onValueChange={handleSelectChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="indoor"
                  id="indoor"
                  className="sr-only"
                />
                <label
                  htmlFor="indoor"
                  className={`cursor-pointer px-10 py-1 rounded-lg border ${
                    formData.category === "indoor"
                      ? "border-primary focus-visible:ring-0"
                      : errors.category
                      ? "border-red-500 ring-0 ring-red-500"
                      : "border-border"
                  } bg-card`}
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
                  className={`cursor-pointer px-10 py-1 rounded-lg border ${
                    formData.category === "outdoor"
                      ? "border-primary focus-visible:ring-0"
                      : errors.category
                      ? "border-red-500 ring-0 ring-red-500"
                      : "border-border"
                  } bg-card`}
                >
                  Outdoor
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roof" id="roof" className="sr-only" />
                <label
                  htmlFor="roof"
                  className={`cursor-pointer px-10 py-1 rounded-lg border ${
                    formData.category === "roof"
                      ? "border-primary focus-visible:ring-0"
                      : errors.category
                      ? "border-red-500 ring-0 ring-red-500"
                      : "border-border"
                  } bg-card`}
                >
                  Roof
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-full">
            <Label>Latitude</Label>
            <div className="relative">
              <Input
                name="lat"
                type="number"
                value={
                  typeof formData.location.lat === "number" &&
                  !isNaN(formData.location.lat)
                    ? formData.location.lat
                    : ""
                }
                onChange={handleChange}
                placeholder="Latitude"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.lat ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.lat && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label>Longitude</Label>
            <div className="relative">
              <Input
                name="lng"
                type="number"
                value={
                  typeof formData.location.lng === "number" &&
                  !isNaN(formData.location.lng)
                    ? formData.location.lng
                    : ""
                }
                onChange={handleChange}
                placeholder="Longitude"
                className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                  errors.lng ? "ring-0 ring-red-500 border-red-500" : ""
                }`}
              />

              {errors.lng && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <CircleAlert size={16} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          {formData.ground_details.map((ground, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="space-y-1 w-full">
                <Label>Ground</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Ground "
                    value={
                      typeof ground.ground === "number" && !isNaN(ground.ground)
                        ? ground.ground
                        : ""
                    }
                    onChange={(e) => {
                      clearError("ground");
                      handleGroundFieldChange(index, "ground", e.target.value);
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.ground ? "ring-0 ring-red-500 border-red-500" : ""
                    }`}
                  />

                  {errors.ground && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <CircleAlert size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Hourly Price</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Hourly Price"
                    value={
                      typeof ground.hourly_price === "number" &&
                      !isNaN(ground.hourly_price)
                        ? ground.hourly_price
                        : ""
                    }
                    onChange={(e) => {
                      clearError("hourly_price");

                      handleGroundFieldChange(
                        index,
                        "hourly_price",
                        e.target.value
                      );
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.hourly_price
                        ? "ring-0 ring-red-500 border-red-500"
                        : ""
                    }`}
                  />

                  {errors.hourly_price && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <CircleAlert size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Capacity</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={
                      typeof ground.capacity === "number" &&
                      !isNaN(ground.capacity)
                        ? ground.capacity
                        : ""
                    }
                    onChange={(e) => {
                      clearError("capacity");

                      handleGroundFieldChange(
                        index,
                        "capacity",
                        e.target.value
                      );
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.capacity
                        ? "ring-0 ring-red-500 border-red-500"
                        : ""
                    }`}
                  />

                  {errors.capacity && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <CircleAlert size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Width</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Width"
                    value={
                      typeof ground.width === "number" && !isNaN(ground.width)
                        ? ground.width
                        : ""
                    }
                    onChange={(e) => {
                      clearError("width");

                      handleGroundFieldChange(index, "width", e.target.value);
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.width ? "ring-0 ring-red-500 border-red-500" : ""
                    }`}
                  />

                  {errors.width && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <CircleAlert size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Height</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Height"
                    value={
                      typeof ground.height === "number" && !isNaN(ground.height)
                        ? ground.height
                        : ""
                    }
                    onChange={(e) => {
                      clearError("height");

                      handleGroundFieldChange(index, "height", e.target.value);
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.width ? "ring-0 ring-red-500 border-red-500" : ""
                    }`}
                  />

                  {errors.height && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <CircleAlert size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-transparent my-auto pt-5 cursor-pointer"
                  onClick={handleAddGroundDetail}
                >
                  <CirclePlus className="text-foreground" size={16} />
                </button>

                {formData.ground_details.length > 1 && (
                  <button
                    type="button"
                    className="bg-transparent my-auto pt-5 cursor-pointer"
                    onClick={() => handleRemoveGroundDetail(index)}
                  >
                    <CircleMinus className="text-foreground" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="space-y-3 w-full">
            <Label>Upload Images</Label>
            <div className="flex items-center space-x-4 flex-wrap">
              {preview.length > 0 &&
                preview.map((src, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg bg-card overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}

              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg bg-card">
                  <ImageUp />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button type="submit" disabled={loading} className="w-1/4 mx-auto">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
