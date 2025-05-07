import { FormData } from "@/types/vanue";
import { useState } from "react";

interface Errors {
  [key: string]: string;
}

export const useFormValidation = (formData: FormData) => {
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.capacity.trim() || isNaN(Number(formData.capacity)))
      newErrors.capacity = "Capacity required and should be a number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.hourlyPrice.trim() || isNaN(Number(formData.hourlyPrice)))
      newErrors.hourlyPrice = "Hourly price required and should be a number";
    if (!formData.surface.trim()) newErrors.surface = "Surface is required";
    if (!formData.net.trim()) newErrors.net = "Net info required";
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { validate, errors };
};
