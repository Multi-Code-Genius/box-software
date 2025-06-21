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
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useAddVenue, useVenues } from "@/api/vanue";
import { useVenueStore } from "@/store/venueStore";
import { Textarea } from "@/components/ui/textarea";

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

    const cleanedValue = value.replace(/^0+(?!$)/, "");

    if (cleanedValue === "") {
      updated[index][field] = "" as never;
    } else {
      const parsedValue =
        field === "hourly_price"
          ? parseFloat(cleanedValue)
          : parseInt(cleanedValue, 10);

      updated[index][field] = isNaN(parsedValue) ? 0 : parsedValue;
    }

    setFormData((prev) => ({
      ...prev,
      ground_details: updated,
    }));

    clearError(`ground_details[${index}].${field}`);
  };

  const handleRemoveImage = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-[calc(100vh-75px)] w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl flex flex-col gap-3 px-10 py-8 rounded-lg border shadow-lg"
      >
        <Label className="mx-auto text-2xl mb-4 block text-center font-semibold ">
          Add venue
        </Label>

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
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className={` pr-3 py-2 w-full h-[36px] min-h-[unset] min-h-[36px]  text-sm leading-none  border bg-card border-border focus-visible:ring-0 focus:outline-none ${
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
        <div className="flex gap-3">
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

        <div className="w-full space-y-3">
          {formData.ground_details.map((ground, index) => (
            <div
              key={index}
              className="relative p-4 border border-border  rounded-xl  shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-base flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  Ground Details
                </h3>
                {formData.ground_details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGroundDetail(index)}
                    className=" bg-sidebar-ring hover:bg-red-500 transition-colors p-1.5 rounded-full"
                    title="Remove ground"
                  >
                    <Trash2 size={13} className="text-primary-foreground" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Hourly Price (₹)
                  </Label>
                  <Input
                    type="text"
                    placeholder="50"
                    value={ground.hourly_price}
                    onChange={(e) => {
                      clearError(`ground_details[${index}].hourly_price`);
                      handleGroundFieldChange(
                        index,
                        "hourly_price",
                        e.target.value
                      );
                    }}
                    className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                      errors[`ground_details[${index}].hourly_price`]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  {errors[`ground_details[${index}].hourly_price`] && (
                    <p className="text-xs text-red-500">
                      {errors[`ground_details[${index}].hourly_price`]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Capacity</Label>
                  <Input
                    type="text"
                    placeholder="10"
                    value={
                      typeof ground.capacity === "number" &&
                      !isNaN(ground.capacity)
                        ? ground.capacity
                        : ""
                    }
                    onChange={(e) => {
                      clearError(`ground_details[${index}].capacity`);
                      handleGroundFieldChange(
                        index,
                        "capacity",
                        e.target.value
                      );
                    }}
                    className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                      errors[`ground_details[${index}].capacity`]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  {errors[`ground_details[${index}].capacity`] && (
                    <p className="text-xs text-red-500">
                      {errors[`ground_details[${index}].capacity`]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Width (m)</Label>
                  <Input
                    type="text"
                    placeholder="20"
                    value={
                      typeof ground.width === "number" && !isNaN(ground.width)
                        ? ground.width
                        : ""
                    }
                    onChange={(e) => {
                      clearError(`ground_details[${index}].width`);
                      handleGroundFieldChange(index, "width", e.target.value);
                    }}
                    className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                      errors[`ground_details[${index}].width`]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  {errors[`ground_details[${index}].width`] && (
                    <p className="text-xs text-red-500">
                      {errors[`ground_details[${index}].width`]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Height (m)</Label>
                  <Input
                    type="text"
                    placeholder="30"
                    value={
                      typeof ground.height === "number" && !isNaN(ground.height)
                        ? ground.height
                        : ""
                    }
                    onChange={(e) => {
                      clearError(`ground_details[${index}].height`);
                      handleGroundFieldChange(index, "height", e.target.value);
                    }}
                    className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                      errors[`ground_details[${index}].height`]
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-primary"
                    }`}
                  />
                  {errors[`ground_details[${index}].height`] && (
                    <p className="text-xs text-red-500">
                      {errors[`ground_details[${index}].height`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div>
            <div className="flex justify-end items-center">
              <button
                type="button"
                onClick={handleAddGroundDetail}
                className="relative  inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary group"
              >
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all"></span>
                <span className="absolute inset-0.5 rounded-md bg-white dark:bg-gray-900"></span>
                <Plus size={16} className="relative z-10 shrink-0" />
                <span className="relative z-10">Add Another Ground</span>
              </button>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Add Ground Photos</Label>

              <div className="flex flex-wrap gap-3">
                {preview.map((src, index) => (
                  <div key={index} className="relative">
                    <div className="w-20 h-20 rounded-md border overflow-hidden">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <label className="block">
                  <div className="w-20 h-20 flex items-center justify-center border-2 border-dashed hover:border-sidebar-ring rounded-md cursor-pointer ">
                    <ImagePlus size={20} className="text-sidebar-ring" />
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

              {preview.length === 0 && (
                <p className="text-xs text-gray-500">No photos added yet</p>
              )}
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
