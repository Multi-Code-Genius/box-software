import { VenueFormData } from "@/types/vanue";
import { useState } from "react";

interface Errors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Errors>({});

  const validate = (formData: VenueFormData): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.location.city.trim()) newErrors.city = "City is required";
    if (!formData.location.area.trim()) newErrors.area = "Area is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.game_info.maxPlayers || isNaN(formData.game_info.maxPlayers))
      if (!formData.game_info.type) {
        newErrors.type = "Turf type is required";
      }

    formData.ground_details.forEach((ground, index) => {
      const prefix = `ground_details[${index}]`;

      if (!ground.ground || isNaN(Number(ground.ground))) {
        newErrors[`${prefix}.ground`] = "Ground is required";
      }

      if (!ground.hourly_price || isNaN(Number(ground.hourly_price))) {
        newErrors[`${prefix}.hourly_price`] = "Price is required";
      }

      if (!ground.capacity || isNaN(Number(ground.capacity))) {
        newErrors[`${prefix}.capacity`] = "Capacity is required";
      }

      if (!ground.width || isNaN(Number(ground.width))) {
        newErrors[`${prefix}.width`] = "Width is required";
      }

      if (!ground.height || isNaN(Number(ground.height))) {
        newErrors[`${prefix}.height`] = "Height is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  return { validate, errors, clearError, setErrors };
};
