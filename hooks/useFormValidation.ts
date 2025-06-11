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
      newErrors.maxPlayers = "Max players must be a valid number";

    if (!formData.location.lat || isNaN(formData.location.lat))
      newErrors.lat = "Latitude must be a valid number";

    if (!formData.location.lng || isNaN(formData.location.lng))
      newErrors.lng = "Longitude must be a valid number";

    if (!formData.game_info.type) {
      newErrors.type = "Turf type is required";
    }

    if (
      !formData.ground_details[0].ground ||
      isNaN(formData.ground_details[0].ground)
    ) {
      newErrors.ground = "Ground is required";
    }

    if (
      !formData.ground_details[0].hourly_price ||
      isNaN(formData.ground_details[0].hourly_price)
    ) {
      newErrors.hourly_price = "Price is required";
    }

    if (
      !formData.ground_details[0].capacity ||
      isNaN(formData.ground_details[0].capacity)
    ) {
      newErrors.capacity = "Capacity is required";
    }

    if (
      !formData.ground_details[0].width ||
      isNaN(formData.ground_details[0].width)
    ) {
      newErrors.width = "Width is required";
    }

    if (
      !formData.ground_details[0].height ||
      isNaN(formData.ground_details[0].height)
    ) {
      newErrors.height = "Height is required";
    }
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

  return { validate, errors, clearError };
};
