"use client";
import { useDeleteVenue, useEditVenue, useVenues } from "@/api/vanue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";

import { useVenueStore } from "@/store/venueStore";
import {
  CircleAlert,
  CircleMinus,
  CirclePlus,
  IndianRupee,
  Map,
  MapPin,
  MapPinned,
  Minus,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Mosaic } from "react-loading-indicators";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Textarea } from "@/components/ui/textarea";

const VenueDetail = () => {
  const { venues, setVenues } = useVenueStore();
  const { data } = useVenues();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedvenueId, setSelectedvenueId] = useState<any>(null);
  const DeleteDialog = dynamic(() => import("./DeleteDialog"), { ssr: false });
  const { mutate: editVenue } = useEditVenue();
  const { isLoading } = useVenues();
  const [hasMounted, setHasMounted] = useState(false);
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const { validate, errors, setErrors } = useFormValidation();

  const router = useRouter();

  const handleAddGroundDetail = () => {
    if (!selectedGame) return;

    const updatedGroundDetails = [
      ...selectedGame.ground_details,
      {
        ground: selectedGame.ground_details.length + 1,
        capacity: 0,
        width: 0,
        height: 0,
        hourly_price: 0,
      },
    ];

    setSelectedGame({
      ...selectedGame,
      ground_details: updatedGroundDetails,
    });
  };

  const handleRemoveGroundDetail = (index: number) => {
    if (!selectedGame) return;

    const updatedGroundDetails = selectedGame.ground_details.filter(
      (_: any, i: any) => i !== index
    );

    setSelectedGame({
      ...selectedGame,
      ground_details: updatedGroundDetails,
    });
  };

  const handleEditField = (
    field: string,
    value: any,
    isNested = false,
    nestedKey = "",
    index: number | null = null
  ) => {
    setSelectedGame((prev: any) => {
      if (!prev) return prev;

      if (isNested && nestedKey && typeof index === "number") {
        const updatedArray = [...prev[nestedKey]];
        updatedArray[index] = {
          ...updatedArray[index],
          [field]: value,
        };

        return {
          ...prev,
          [nestedKey]: updatedArray,
        };
      }

      if (isNested && nestedKey) {
        return {
          ...prev,
          [nestedKey]: {
            ...prev[nestedKey],
            [field]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });

    setErrors((prevErrors) => {
      if (prevErrors[field]) {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      }
      return prevErrors;
    });
  };

  const handleClick = () => {
    router.push("/addVenues");
  };

  useEffect(() => {
    if (data?.venues) {
      setVenues(data.venues);
    }
  }, [data, setVenues]);

  const handleCardClick = (game: any) => {
    setSelectedGame(game);
    setSelectedvenueId(game.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedGame(null);
    setShowModal(false);
  };

  const saveVenueChanges = () => {
    if (!selectedGame || !selectedGame.id) return;

    const isValid = validate(selectedGame);
    if (!isValid) return;

    const { id, ...rest } = selectedGame;

    editVenue(
      { venueId: id, data: rest },
      {
        onSuccess: () => {
          setErrors({});
          setShowModal(false);
        },
        onError: (error) => {
          console.error("Edit failed", error);
        },
      }
    );
  };

  const clearError = (field: string) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    venueId: string
  ) => {
    e.stopPropagation();
    setSelectedvenueId(venueId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedvenueId(null);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Mosaic color={["#3d4293", "#4e54b5", "#7277c4", "#2e326f"]} />
      </div>
    );
  }
  if (!data?.venues?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center px-4">
        <Image
          src="/images/nodata.svg"
          alt="No Venues Found"
          width={700}
          height={700}
          className="mb-6"
          priority
        />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No Venues Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Looks like you haven&apos;t added any venues yet. Start by creating
          your first venue to manage bookings and availability.
        </p>
        <Button
          onClick={handleClick}
          className="px-6 py-3 text-base rounded-md"
        >
          Create Your First Venue
        </Button>
      </div>
    );
  }
  const handleGroundFieldChange = (
    index: number,
    field: "capacity" | "height" | "width",
    value: string
  ) => {
    handleEditField(
      field,
      value === "" ? "" : Number(value),
      true,
      "ground_details",
      index
    );
  };

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="gap-0 shadow-xl cursor-pointer"
            onClick={() => handleCardClick(venue)}
          >
            <CardHeader className="grid grid-cols-[1fr_auto] items-center">
              <CardTitle className="text-lg">{venue.name || ""}</CardTitle>
              <button
                onClick={(e) => handleDeleteClick(e, venue.id)}
                className="p-2  rounded-full bg-sidebar-ring text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-muted-foreground text-base">
                {venue.category}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} />
                Address: {venue.address || ""}
              </p>
              <p className="flex items-center gap-2">
                <Users size={18} />
                Capacity: {venue?.game_info?.maxPlayers || ""}
              </p>
              <p className="flex items-center gap-2">
                <IndianRupee size={18} />
                Price: ₹{venue?.ground_details?.[0]?.hourly_price || 0}
              </p>
              <p className="flex items-center gap-2">
                <Map size={18} />
                {venue?.location?.city || ""}
              </p>
            </CardContent>
          </Card>
        ))}

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          selectedvenueId={selectedvenueId}
          onClose={handleCloseDialog}
        />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="min-w-[600px] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-between items-center">
              Edit Venue
            </DialogTitle>
          </DialogHeader>

          {selectedGame && (
            <div className="space-y-4 pt-4">
              <div className="flex gap-3 ">
                <div className="space-y-1 w-full">
                  <label className="block text-sm font-medium">Name</label>
                  <div>
                    <Input
                      value={selectedGame.name}
                      onChange={(e) => handleEditField("name", e.target.value)}
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
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <div className="relative">
                    <Textarea
                      value={selectedGame.description}
                      onChange={(e) =>
                        handleEditField("description", e.target.value)
                      }
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

              <div className="flex gap-4">
                <div className="space-y-1 w-full">
                  <label className="block text-sm font-medium">Address</label>
                  <div className="relative">
                    <Input
                      value={selectedGame.address}
                      onChange={(e) =>
                        handleEditField("address", e.target.value)
                      }
                      className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />

                    {errors.address && (
                      <div className="text-xs text-red-500 pt-1 pl-1">
                        <span>{errors.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1 w-full">
                  <label className="block text-sm font-medium">City</label>
                  <div className="relative">
                    <Input
                      value={selectedGame.location?.city || ""}
                      onChange={(e) =>
                        handleEditField(
                          "city",
                          e.target.value,
                          true,
                          "location"
                        )
                      }
                      className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    />

                    {errors.city && (
                      <div className="text-xs text-red-500 pt-1 pl-1">
                        <span>{errors.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Category</label>

                <div className="relative">
                  <RadioGroup
                    className="flex gap-4"
                    value={selectedGame?.category || ""}
                    onValueChange={(value) =>
                      handleEditField("category", value)
                    }
                  >
                    {["indoor", "outdoor", "roof"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className="sr-only"
                        />
                        <label
                          htmlFor={type}
                          className={`cursor-pointer px-10 py-1 rounded-lg border bg-card ${
                            selectedGame?.category === type
                              ? "border-primary"
                              : errors.category
                              ? "border-red-500"
                              : "border-border"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>

                  {errors.category && (
                    <div className="text-xs text-red-500 pt-1 pl-1">
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 w-full">
                  <label className="block text-sm font-medium">Turf Type</label>
                  <div className="relative">
                    <Select
                      value={selectedGame.game_info.type}
                      onValueChange={(value) =>
                        handleEditField("type", value, true, "game_info")
                      }
                    >
                      <SelectTrigger
                        className={`w-full flex items-center justify-between bg-card ${
                          errors.type
                            ? "border-red-500 ring-0"
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
                      <div className=" text-xs text-red-500 pt-1 pl-1">
                        <span>{errors.type}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Max Players
                  </label>
                  <div className="relative">
                    <Input
                      value={selectedGame.game_info?.maxPlayers || ""}
                      onChange={(e) =>
                        handleEditField(
                          "maxPlayers",
                          e.target.value,
                          true,
                          "game_info"
                        )
                      }
                      className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                        errors.maxPlayers ? "border-red-500" : ""
                      }`}
                    />

                    {errors.maxPlayers && (
                      <div className="text-xs text-red-500 pt-1 pl-1">
                        <span>{errors.maxPlayers}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  {selectedGame?.ground_details?.map(
                    (ground: any, index: any) => (
                      <div
                        key={index}
                        className="relative p-4 border border-border  rounded-xl  shadow-xs hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center bg-primary text-white text-sm font-medium rounded-full">
                              {index + 1}
                            </div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              Ground Details
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleAddGroundDetail}
                              className="flex items-center justify-center p-1 text-primary hover:bg-primary/10 rounded-lg border border-dashed border-primary/40 hover:border-primary/60 transition-colors"
                              aria-label="Add ground"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>

                            {selectedGame.ground_details.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveGroundDetail(index)}
                                className="flex items-center justify-center p-1 text-primary hover:bg-primary/10 rounded-lg border border-dashed border-primary/40 hover:border-primary/60 transition-colors"
                                aria-label="Remove ground"
                              >
                                <Minus size={14} strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-medium ">
                              Hourly Price (₹)
                            </label>
                            <Input
                              type="number"
                              value={
                                ground.hourly_price === 0 || ground.hourly_price
                                  ? ground.hourly_price
                                  : ""
                              }
                              onChange={(e) =>
                                handleEditField(
                                  "hourly_price",
                                  parseInt(e.target.value) || 0,
                                  true,
                                  "ground_details",
                                  index
                                )
                              }
                              className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                                errors[`ground_details[${index}].hourly_price`]
                                  ? "ring ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[
                              `ground_details[${index}].hourly_price`
                            ] && (
                              <p className="text-xs text-red-500 pt-1">
                                {
                                  errors[
                                    `ground_details[${index}].hourly_price`
                                  ]
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-medium ">
                              Capacity
                            </label>
                            <Input
                              type="number"
                              value={
                                ground.capacity === 0 || ground.capacity
                                  ? ground.capacity
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                handleGroundFieldChange(
                                  index,
                                  "capacity",
                                  value
                                );
                                if (
                                  !isNaN(Number(value)) &&
                                  Number(value) > 0
                                ) {
                                  clearError(
                                    `ground_details[${index}].capacity`
                                  );
                                }
                              }}
                              className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                                errors[`ground_details[${index}].capacity`]
                                  ? "ring ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[`ground_details[${index}].capacity`] && (
                              <p className="text-xs text-red-500 pt-1">
                                {errors[`ground_details[${index}].capacity`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-medium ">
                              Width (m)
                            </label>
                            <Input
                              type="number"
                              value={
                                ground.width === 0 || ground.width
                                  ? ground.width
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                handleGroundFieldChange(index, "width", value);
                                if (
                                  !isNaN(Number(value)) &&
                                  Number(value) > 0
                                ) {
                                  clearError(`ground_details[${index}].width`);
                                }
                              }}
                              className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none  ${
                                errors[`ground_details[${index}].width`]
                                  ? "ring ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[`ground_details[${index}].width`] && (
                              <p className="text-xs text-red-500 pt-1">
                                {errors[`ground_details[${index}].width`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-medium ">
                              Length (m)
                            </label>
                            <Input
                              type="number"
                              value={
                                ground.height === 0 || ground.height
                                  ? ground.height
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                handleGroundFieldChange(index, "height", value);
                                if (
                                  !isNaN(Number(value)) &&
                                  Number(value) > 0
                                ) {
                                  clearError(`ground_details[${index}].height`);
                                }
                              }}
                              className={`w-full border pr-3 bg-card border-border focus-visible:ring-0 focus:outline-none ${
                                errors[`ground_details[${index}].height`]
                                  ? "ring ring-red-500"
                                  : ""
                              }`}
                            />
                            {errors[`ground_details[${index}].height`] && (
                              <p className="text-xs text-red-500 pt-1">
                                {errors[`ground_details[${index}].height`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={saveVenueChanges}>Edit</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenueDetail;
