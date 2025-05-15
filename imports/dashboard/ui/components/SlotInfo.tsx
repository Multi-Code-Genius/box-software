"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const SlotInfo = () => {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");

  const slots = [
    {
      time: "6:00AM - 6:30AM",
      duration: "30 mins slot",
      price: "$200",
      availability: "available",
      icon: <div className="bg-green-500 h-2 w-2 rounded-full" />,
    },
    {
      time: "6:30PM, - 7:00PM",
      duration: "30 mins slot",
      price: "$180",
      availability: "available",
      icon: <div className="bg-green-500 h-2 w-2 rounded-full" />,
    },
    {
      time: "7:00AM - 7:30AM",
      duration: "30 mins slot",
      price: "$220",
      availability: "booked",
      icon: <div className="bg-red-500 h-2 w-2 rounded-full" />,
    },
    {
      time: "8:00AM - 8:30AM",
      duration: "30 mins slot",
      price: "$250",
      availability: "available",
      icon: <div className="bg-green-500 h-2 w-2 rounded-full" />,
    },
    {
      time: "9:00PM - 9:30PM",
      duration: "30 mins slot",
      price: "$230",
      availability: "booked",
      icon: <div className="bg-red-500 h-2 w-2 rounded-full" />,
    },
    {
      time: "10:00AM - 10:30AM",
      duration: "30 mins slot",
      price: "$210",
      availability: "available",
      icon: <div className="bg-green-500 h-2 w-2 rounded-full" />,
    },
  ];

  const getHour = (timeStr: string) => {
    const hour = parseInt(timeStr.split(":")[0]);
    const isAM = timeStr.includes("AM");
    return isAM ? hour : hour + 12;
  };

  const applyTimeFilter = (slot: (typeof slots)[0]) => {
    const startHour = getHour(slot.time);
    switch (selectedTimeFilter) {
      case "Morning":
        return startHour >= 5 && startHour < 12;
      case "Evening":
        return startHour >= 17 && startHour < 20;
      case "Night":
        return startHour >= 20 || startHour < 5;
      default:
        return true; // All
    }
  };

  const filteredSlots = slots
    .filter((slot) =>
      showAvailableOnly ? slot.availability === "available" : true
    )
    .filter(applyTimeFilter);

  return (
    <div className="border  rounded-xl">
      <div className="flex justify-between border-b py-3 px-5 items-center">
        <p className="text-base font-bold">Today's Slot Info</p>
        <div>
          {["All", "Morning", "Evening", "Night"].map((label, idx) => (
            <button
              key={label}
              onClick={() => setSelectedTimeFilter(label)}
              className={`border py-1 px-4 cursor-pointer ${
                idx === 0 ? "rounded-l-md" : ""
              } ${idx === 3 ? "rounded-r-md" : ""} ${
                selectedTimeFilter === label ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between pb-3">
          <div className="font-bold flex gap-2 items-center">
            Total all Slots
            <div className="w-5 h-5 bg-gray-200 rounded-full flex justify-center items-center text-xs">
              {filteredSlots.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <p>Show only Available slots</p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredSlots.map((slot, index) => (
            <Card key={index} className="gap-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="capitalize flex items-center border rounded-lg py-1 px-4 gap-2">
                    {slot.icon}
                    {slot.availability}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{slot.time}</p>
                <p>{slot.duration}</p>
                <p className="text-2xl font-bold">{slot.price}</p>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={slot.availability === "booked"}
                  className="mx-auto px-8"
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotInfo;
