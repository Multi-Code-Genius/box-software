"use client";

import { Zap } from "lucide-react";
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
      icon: <Zap />,
      title: "Total booked slot in this month",
      value: bookingsCount,
    },
    {
      icon: <Zap />,
      title: "Total revenue in this month",
      value: totalRevenue,
    },
    {
      icon: <Zap />,
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
                <div className="h-10 w-10 bg-slate-300 rounded-full flex justify-center items-center">
                  {card.icon}
                </div>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold">{card.value}</h1>
            </CardContent>
            <CardFooter className="font-medium">
              {card.title === "Total players in this month" ? (
                <p className="font-semibold">New users: {newPlayers ?? 0}</p>
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
