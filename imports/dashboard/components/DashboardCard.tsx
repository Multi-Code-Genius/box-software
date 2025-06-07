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
import Venues from "./Venues";

const DashboardCard = () => {
  const { dashboardData } = useDashboardStore();

  return (
    <>
      <Venues />
      <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Booked Slots */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-5">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex justify-center items-center">
                <Zap size={20} />
              </div>
              Total booked slot in this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              {dashboardData?.thisMonthBookingsCount ?? 0}
            </h1>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-5">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex justify-center items-center">
                <Zap size={20} />
              </div>
              Total Amount in this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              <IndianRupee className="inline mb-1" />
              {dashboardData?.thisMonthTotalAmount ?? 0}
            </h1>
          </CardContent>
        </Card>

        {/* Total Players */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-5">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex justify-center items-center">
                <Zap size={20} />
              </div>
              Total players in this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold">
              {dashboardData?.newUsersCount ?? 0}
            </h1>
          </CardContent>
          <CardFooter className="font-semibold flex gap-3 items-center">
            New users
            <div className="h-5 w-5 bg-gray-200 rounded-full flex justify-center items-center text-xs">
              {dashboardData?.newUsersCount ?? 0}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default DashboardCard;
