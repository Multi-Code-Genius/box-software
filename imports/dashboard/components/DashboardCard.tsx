"use client";

import { IndianRupee, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboardStore";
import Games from "./Games";

const DashboardCard = () => {
  const { data } = useDashboardStore();

  const bookingsCount = data?.thisMonthBookingsCount ?? 0;
  const totalRevenue = data?.thisMonthTotalAmount ?? 0;
  const newPlayers = data?.newUsersCount ?? 0;

  const cardsData = [
    {
      icon: <Zap size={20} />,
      title: "Total booked slot in this month",
      value: bookingsCount,
    },
    {
      icon: <Zap size={20} />,
      title: "Total revenue in this month",
      value: (
        <>
          <IndianRupee className="inline mb-1" />
          {totalRevenue}
        </>
      ),
    },
    {
      icon: <Zap size={20} />,
      title: "Total players in this month",
      value: newPlayers,
    },
  ];

  return (
    <>
      <Games />
      <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {cardsData.map((card, index) => (
          <Card key={index} className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-5">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex justify-center items-center">
                  {card.icon}
                </div>

                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold"> {card.value}</h1>
            </CardContent>
            <CardFooter className="font-medium">
              {card.title === "Total players in this month" ? (
                <div className="font-semibold flex gap-3 items-center ">
                  New users{" "}
                  <div className="h-5 w-5 bg-gray-200 rounded-full flex justify-center items-center text-xs">
                    {newPlayers ?? 0}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardCard;
