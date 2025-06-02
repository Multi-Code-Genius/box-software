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
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.hourlyPrice || isNaN(formData.hourlyPrice))
      newErrors.hourlyPrice = "Hourly price must be a valid number";

    if (!formData.gameInfo.maxPlayers || isNaN(formData.gameInfo.maxPlayers))
      newErrors.maxPlayers = "Max players must be a valid number";

    if (!formData.grounds || isNaN(formData.grounds))
      newErrors.grounds = "Grounds must be a valid number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { validate, errors };
};
