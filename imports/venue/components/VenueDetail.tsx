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

import { useVenueStore } from "@/store/venueStore";
import {
  IndianRupee,
  Loader2,
  Map,
  MapPinned,
  Trash2,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const handleEditField = (
    field: string,
    value: any,
    isNested = false,
    nestedKey = ""
  ) => {
    setSelectedGame((prev: any) => {
      if (!prev) return prev;

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

    const { id, ...rest } = selectedGame;

    editVenue({
      venueId: id,
      data: rest,
    });

    setShowModal(false);
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
      <div className="flex justify-center items-center h-40 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading Venues...
      </div>
    );
  }

  if (!venues?.length) {
    return (
      <div className="pt-10 text-center text-base text-muted-foreground">
        No Venues found.
      </div>
    );
  }

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>
      <div className="flex gap-6 flex-wrap">
        {venues.map((venue) => (
          <Card
            key={venue.id}
            className="w-[370px] gap-3 shadow-xl cursor-pointer"
            onClick={() => handleCardClick(venue)}
          >
            <CardHeader className="grid grid-cols-[1fr_auto] items-center">
              <CardTitle className="text-lg">{venue.name}</CardTitle>

              <button
                onClick={(e) => handleDeleteClick(e, venue.id)}
                className=" hover:text-red-600 transition p-1"
              >
                <Trash2 size={18} />
              </button>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-lg"> {venue.category}</p>
              <p className="flex items-center gap-2">
                <MapPinned size={18} />
                Address: {venue.address}
              </p>
              <p className="flex items-center gap-2">
                <Users size={18} />
                Capacity: {venue.capacity}
              </p>
              <p className="flex items-center gap-2">
                <IndianRupee size={18} />
                Price: {venue.hourly_price}
              </p>
              <p className="flex items-center gap-2">
                <Map size={18} />
                {venue.location.area}, {venue.location.city}
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
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-between items-center">
              Edit Venue
            </DialogTitle>
          </DialogHeader>

          {selectedGame && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  value={selectedGame.name}
                  onChange={(e) => handleEditField("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Input
                  value={selectedGame.description}
                  onChange={(e) =>
                    handleEditField("description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  value={selectedGame.address}
                  onChange={(e) => handleEditField("address", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <Input
                  value={selectedGame.location?.city || ""}
                  onChange={(e) =>
                    handleEditField("city", e.target.value, true, "location")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <Input
                    value={selectedGame.location?.lat || ""}
                    onChange={(e) =>
                      handleEditField("lat", e.target.value, true, "location")
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <Input
                    value={selectedGame.location?.lng || ""}
                    onChange={(e) =>
                      handleEditField("lng", e.target.value, true, "location")
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Game Type
                  </label>
                  <Input
                    value={selectedGame.game_info?.type || ""}
                    onChange={(e) =>
                      handleEditField("type", e.target.value, true, "game_info")
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Players
                  </label>
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grounds
                </label>
                <Input
                  value={selectedGame.grounds || ""}
                  onChange={(e) => handleEditField("grounds", e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
