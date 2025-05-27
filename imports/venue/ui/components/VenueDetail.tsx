"use client";
import { getAllGames, useGames } from "@/api/booking";
import { useDeleteVenue, useEditVenue } from "@/api/vanue";
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
import { useBookingStore } from "@/store/bookingStore";
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
  const { games, setGames } = useBookingStore();
  const { data } = useGames();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<any>(null);
  const DeleteDialog = dynamic(() => import("./DeleteDialog"), { ssr: false });
  const { mutate: editVenue } = useEditVenue();

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
    if (data?.games) {
      setGames(data.games);
    }
  }, [data, setGames]);

  const handleCardClick = (game: any) => {
    setSelectedGame(game);
    setSelectedGameId(game.id);
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
      gameId: id,
      data: rest,
    });

    setShowModal(false);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    gameId: string
  ) => {
    e.stopPropagation();
    setSelectedGameId(gameId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedGameId(null);
  };

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl pb-5">Venues Details</h2>
      <div className="flex gap-6 flex-wrap">
        {games.length === 0 ? (
          <div className="flex items-center justify-center w-full h-48 text-gray-500 text-lg">
            No venues found.
          </div>
        ) : (
          games.map((game) => (
            <div key={game.id}>
              <Card
                className="w-[370px] gap-3 shadow-xl cursor-pointer"
                onClick={() => handleCardClick(game)}
              >
                <CardHeader className="gap-0">
                  <CardTitle className="text-lg flex justify-between">
                    {game.name}

                    <button
                      className=" ms-auto cursor-pointer"
                      onClick={(e) => handleDeleteClick(e, game.id)}
                      aria-label={`Delete ${game.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {game.category}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="flex items-center gap-2">
                    <MapPinned size={18} /> Address: {game.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={18} /> Capacity: {game.capacity}
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee size={18} /> Price: {game.hourlyPrice}
                  </p>
                  <p className="flex items-center gap-2">
                    <Map size={18} /> {game.location.area}, {game.location.city}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        )}

        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          selectedGameId={selectedGameId}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Game
                  </label>
                  <Input
                    value={selectedGame.category}
                    onChange={(e) =>
                      handleEditField("category", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Turf Type
                  </label>

                  <div className="flex gap-4">
                    {["indoor", "outdoor", "roof"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          handleEditField("turfType", type, true, "gameInfo")
                        }
                        className={`px-3 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                          selectedGame.gameInfo.turfType === type
                            ? "bg-black text-white"
                            : "bg-white text-gray-800 hover:bg-black hover:text-white"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Surface
                  </label>
                  <Input
                    value={selectedGame.gameInfo?.surface}
                    onChange={(e) =>
                      handleEditField(
                        "surface",
                        e.target.value,
                        true,
                        "gameInfo"
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Net
                  </label>
                  <Input
                    type="number"
                    value={selectedGame.net || ""}
                    onChange={(e) => handleEditField("net", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <Input
                    type="number"
                    value={selectedGame.capacity}
                    onChange={(e) =>
                      handleEditField("capacity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input
                    type="number"
                    value={selectedGame.hourlyPrice}
                    onChange={(e) =>
                      handleEditField("hourlyPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <Input
                    value={selectedGame.location?.area}
                    onChange={(e) =>
                      handleEditField("area", e.target.value, true, "location")
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Input
                    value={selectedGame.location?.city}
                    onChange={(e) =>
                      handleEditField("city", e.target.value, true, "location")
                    }
                  />
                </div>
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
