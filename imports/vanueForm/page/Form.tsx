"use client";
import { useAddGame } from "@/api/vanue";
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
import { FormData as FormDataTypes } from "@/types/vanue";
import {
  Building2,
  CircleAlert,
  DollarSign,
  FileText,
  Grid3X3,
  Home,
  ImageUp,
  Layers,
  MapPin,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const Form: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataTypes>({
    name: "",
    description: "",
    city: "Surat",
    area: "Vesu",
    address: "",
    capacity: "",
    category: "",
    hourlyPrice: "",
    turfType: "indoor",
    surface: "",
    net: "",
    image: null,
  });

  const { validate, errors } = useFormValidation(formData);

  const { mutate, isSuccess } = useAddGame();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? (files ? files[0] : null) : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleTurfTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      turfType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("category", formData.category);
    formdata.append("description", formData.description);
    formdata.append("hourlyPrice", formData.hourlyPrice);
    formdata.append("capacity", formData.capacity);
    formdata.append("location[city]", formData.city);
    formdata.append("location[area]", formData.area);
    formdata.append("address", formData.address);
    formdata.append("gameInfo[surface]", formData.surface);
    formdata.append("gameInfo[turfType]", formData.turfType);

    formdata.append(
      "gameInfo[indoor]",
      formData.turfType === "indoor" ? "true" : "false"
    );
    formdata.append("gameInfo[equipment provided]", "true");
    formdata.append("net", formData.net);

    if (Array.isArray(formData.image)) {
      formData.image.forEach((file: File) => {
        formdata.append("game", file);
      });
    } else if (
      formData.image &&
      (formData.image as unknown as object) instanceof File
    ) {
      formdata.append("game", formData.image);
    }
    mutate(formdata, {
      onSettled: () => setLoading(false),
    });

    console.log(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        name: "",
        description: "",
        city: "",
        area: "",
        address: "",
        capacity: "",
        category: "",
        hourlyPrice: "",
        turfType: "indoor",
        surface: "",
        net: "",
        image: null,
      });
      setPreview(null);
    }
  }, [isSuccess]);

  const [preview, setPreview] = useState<string | null>(null);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="h-[calc(100vh-75px)]  w-full flex justify-center items-center m-auto">
      <form
        className="w-[60%] flex flex-col gap-6 border px-14 py-10 shadow-lg rounded-lg "
        onSubmit={handleSubmit}
      >
        <div className="flex gap-5">
          <div className="space-y-2 w-[90%]">
            <Label>Name</Label>
            <div className="flex items-center border rounded-md px-3">
              <User className="w-4 h-4 mr-2" />
              <Input
                name="name"
                type="text"
                placeholder="Please Enter Name"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            {errors.name && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 w-[90%]">
            <Label>Description</Label>
            <div className="flex items-center border rounded-md px-3">
              <FileText className="w-4 h-4 mr-2" />
              <Input
                name="description"
                type="text"
                placeholder="Please Enter Description"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
            {errors.description && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-[90%]">
            <Label>City</Label>
            <div className="flex items-center border rounded-md px-3">
              <MapPin className="w-4 h-4 mr-2" />
              <Input
                name="city"
                type="text"
                placeholder="Please Enter City"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.city}
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2 w-[90%]">
            <Label>Area</Label>
            <div className="flex items-center border rounded-md px-3">
              <Building2 className="w-4 h-4 mr-2" />
              <Input
                name="area"
                type="text"
                placeholder="Please Enter Area"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.area}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="space-y-2 w-[90%]">
            <Label>Address</Label>
            <div className="flex items-center border rounded-md px-3">
              <Home className="w-4 h-4 mr-2" />
              <Input
                name="address"
                type="text"
                placeholder="Please Enter Address"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.address}
              />
            </div>
            {errors.address && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.address}</span>
              </div>
            )}
          </div>
          <div className="space-y-2 w-[90%]">
            <Label>Capacity</Label>
            <div className="flex items-center border rounded-md px-3">
              <Layers className="w-4 h-4 mr-2" />
              <Input
                name="capacity"
                type="number"
                placeholder="Please Enter Capacity"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.capacity}
              />
            </div>
            {errors.capacity && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.capacity}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-[90%]">
            <Label>Category</Label>
            <Select
              onValueChange={handleSelectChange}
              value={formData.category}
            >
              <SelectTrigger className="w-full flex items-center justify-between">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Cricket">Cricket</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.category}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 w-[90%]">
            <Label>Hourly Price</Label>
            <div className="flex items-center border rounded-md px-3">
              <DollarSign className="w-4 h-4 mr-2" />
              <Input
                name="hourlyPrice"
                type="number"
                placeholder="Please Enter Hourly Price"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.hourlyPrice}
              />
            </div>
            {errors.hourlyPrice && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">
                  {errors.hourlyPrice}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Turf Type</Label>
          <RadioGroup
            value={formData.turfType}
            onValueChange={handleTurfTypeChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="indoor" id="indoor" className="sr-only" />
              <label
                htmlFor="indoor"
                className={`cursor-pointer px-10 py-1 rounded-lg border text-gray-800 hover:bg-black hover:text-white ${
                  formData.turfType === "indoor" ? "bg-black text-white" : ""
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
                className={`cursor-pointer px-10 py-1 rounded-lg border text-gray-800 hover:bg-black hover:text-white ${
                  formData.turfType === "outdoor" ? "bg-black text-white" : ""
                }`}
              >
                Outdoor
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roof" id="roof" className="sr-only" />
              <label
                htmlFor="roof"
                className={`cursor-pointer px-10 py-1 rounded-lg border text-gray-800 hover:bg-black hover:text-white ${
                  formData.turfType === "roof" ? "bg-black text-white" : ""
                }`}
              >
                Roof
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-5">
          <div className="space-y-2 w-[90%]">
            <Label>Surface</Label>
            <div className="flex items-center border rounded-md px-3">
              <Grid3X3 className="w-4 h-4 mr-2" />
              <Input
                name="surface"
                type="text"
                placeholder="Please Enter Surface"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.surface}
              />
            </div>
            {errors.surface && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.surface}</span>
              </div>
            )}
          </div>
          <div className="space-y-2 w-[90%]">
            <Label>Net</Label>
            <div className="flex items-center border rounded-md px-3">
              <Layers className="w-4 h-4 mr-2" />
              <Input
                name="net"
                type="number"
                placeholder="Please Enter Net"
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
                value={formData.net}
              />
            </div>
            {errors.net && (
              <div className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" size={16} />
                <span className="text-red-500 text-sm">{errors.net}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Upload Image</Label>
          <label className="flex items-center justify-center w-16">
            <div className="flex flex-col items-center justify-center w-full h-16 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center ">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-16 h-16 object-contain rounded-md"
                  />
                ) : (
                  <ImageUp />
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                name="image"
                accept="image/*"
                onChange={handleChanges}
              />
            </div>
          </label>
          {errors.image && (
            <div className="flex gap-2 items-center">
              <CircleAlert className="text-red-600" size={16} />
              <span className="text-red-500 text-sm">{errors.image}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="w-[50%]"
            variant="default"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
