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
import { VenueFormData, GroundDetail } from "@/types/vanue";
import { CircleAlert, CircleMinus, CirclePlus, ImageUp, X } from "lucide-react";
import { useAddVenue, useVenues } from "@/api/vanue";
import { useVenueStore } from "@/store/venueStore";

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
  const { setVenue } = useVenueStore();
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
      onSuccess: (response: any) => {
        const createdVenue = response?.venue;

        console.log(createdVenue);
        if (createdVenue) {
          setVenue(createdVenue);
        }

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
    field: keyof GroundDetail,
    value: string
  ) => {
    const updated = [...formData.ground_details];

    if (value === "") {
      updated[index][field] = "" as never;
    } else {
      const parsedValue =
        field === "hourly_price" ? parseFloat(value) : parseInt(value, 10);

      updated[index][field] = isNaN(parsedValue) ? 0 : parsedValue;
    }

    setFormData((prev) => ({
      ...prev,
      ground_details: updated,
    }));

    if (value !== "") {
      clearError(`${field}_${index}`);
    }
  };
  const handleRemoveImage = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-[calc(100vh-75px)] w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] flex flex-col gap-4 px-10 py-8 rounded-lg border"
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
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                  errors.name ? "border-red-500" : ""
                }`}
              />

              {errors.name && (
                <div className="text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <Label className="block text-sm font-medium">Description</Label>
            <div className="relative">
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                  errors.description ? "border-red-500" : ""
                }`}
              />

              {errors.description && (
                <div className=" text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-1 w-full">
            <Label className="block text-sm font-medium">Area</Label>
            <div className="relative">
              <Input
                name="area"
                value={formData.location.area}
                onChange={handleChange}
                placeholder="Enter area"
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                  errors.area ? "border-red-500" : ""
                }`}
              />
              {errors.area && (
                <div className=" text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.area}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <Label className="block text-sm font-medium">City</Label>
            <div className="relative">
              <Input
                name="city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
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
        </div>

        <div className="flex gap-5">
          <div className="space-y-1 w-full">
            <Label className="block text-sm font-medium">Address</Label>
            <div className="relative">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <div className=" text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 w-full">
            <Label className="block text-sm font-medium">Max Players</Label>
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
                placeholder="Enter max players"
                className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                  errors.maxPlayers ? "border-red-500" : ""
                }`}
              />
              {errors.maxPlayers && (
                <div className=" text-xs text-red-500 pt-1 pl-1">
                  <span>{errors.maxPlayers}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-sm font-medium">Category</Label>
          <div className="relative">
            <RadioGroup
              className="flex gap-4"
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
                  className={`cursor-pointer px-10 py-1 rounded-lg border bg-card ${
                    formData.category === "indoor"
                      ? "border-primary"
                      : errors.category
                      ? "border-red-500"
                      : "border-border"
                  }`}
                >
                  Indoor
                </label>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="outdoor"
                    id="outdoor"
                    className="sr-only"
                  />
                  <label
                    htmlFor="outdoor"
                    className={`cursor-pointer px-10 py-1 rounded-lg border bg-card ${
                      formData.category === "outdoor"
                        ? "border-primary"
                        : errors.category
                        ? "border-red-500"
                        : "border-border"
                    }`}
                  >
                    Outdoor
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roof" id="roof" className="sr-only" />
                <label
                  htmlFor="roof"
                  className={`cursor-pointer px-10 py-1 rounded-lg border bg-card ${
                    formData.category === "roof"
                      ? "border-primary"
                      : errors.category
                      ? "border-red-500"
                      : "border-border"
                  }`}
                >
                  Roof
                </label>
              </div>
            </RadioGroup>

            {errors.category && (
              <div className=" text-xs text-red-500 pt-1 pl-1">
                <span>{errors.category}</span>
              </div>
            )}
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
                  errors.type ? "border-red-500 ring-0" : "border-border"
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
              <div className=" text-xs text-red-500 pt-1 pl-1">
                <span>{errors.type}</span>
              </div>
            )}
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
                    placeholder="Enter ground "
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
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.ground}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Hourly Price</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter hourly Price"
                    value={ground.hourly_price}
                    onChange={(e) => {
                      clearError("hourly_price");
                      handleGroundFieldChange(
                        index,
                        "hourly_price",
                        e.target.value
                      );
                    }}
                    className={`border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none w-full ${
                      errors.hourly_price ? "border-red-500" : ""
                    }`}
                  />

                  {errors.hourly_price && (
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.hourly_price}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Capacity</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter capacity"
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
                      errors.capacity ? "border-red-500" : ""
                    }`}
                  />

                  {errors.capacity && (
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.capacity}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Width</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter width"
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
                      errors.width ? "border-red-500" : ""
                    }`}
                  />

                  {errors.width && (
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.width}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <Label>Height</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter Height"
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
                      errors.height ? "border-red-500" : ""
                    }`}
                  />
                  {errors.height && (
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.height}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-transparent my-auto  cursor-pointer"
                  onClick={handleAddGroundDetail}
                >
                  <CirclePlus className="text-foreground" size={16} />
                </button>

                {formData.ground_details.length > 1 && (
                  <button
                    type="button"
                    className="bg-transparent my-auto  cursor-pointer"
                    onClick={() => handleRemoveGroundDetail(index)}
                  >
                    <CircleMinus className="text-foreground" size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="space-y-3 w-full ">
            <Label>Upload Images</Label>
            <div className="flex items-center space-x-4 flex-wrap ">
              {preview.length > 0 &&
                preview.map((src, index) => (
                  <div
                    key={index}
                    className="relative  flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-lg bg-card overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className=" h-full object-contain  "
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-[0] right-[0] cursor-pointer p-1 rounded-full bg-black text-white rounded-full  transition"
                    >
                      <X size={10} />
                    </button>
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
