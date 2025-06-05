"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { useDashboardData } from "@/api/dashboard";
import { useVenues } from "@/api/vanue";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDashboardStore } from "@/store/dashboardStore";

export function SectionCards() {
  const { data } = useDashboardStore();
  const growthRate =
    data?.lastMonthTotal && data?.MonthTotalBookingAmount
      ? ((data.MonthTotalBookingAmount - data.lastMonthTotal) /
          data.lastMonthTotal) *
        100
      : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.MonthTotalBookingAmount}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="flex items-center gap-1  px-1.5"
            >
              {(data?.revenueGroth ?? 0) >= 0 ? (
                <IconTrendingUp size={12} />
              ) : (
                <IconTrendingDown size={12} />
              )}
              <span>{data?.revenueGroth ?? 0}%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.NewCustomers?.length}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="flex items-center gap-1  px-1.5"
            >
              {(data?.customerGrowth ?? 0) >= 0 ? (
                <IconTrendingUp size={12} />
              ) : (
                <IconTrendingDown size={12} />
              )}
              <span>{data?.customerGrowth ?? 0}%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          {/* <CardDescription>Active Accounts</CardDescription> */}
          <CardDescription>This month bookings</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.ThisMonthBookings?.length}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="flex items-center gap-1  px-1.5"
            >
              {(data?.bookingGrowth ?? 0) >= 0 ? (
                <IconTrendingUp size={12} />
              ) : (
                <IconTrendingDown size={12} />
              )}
              <span>{data?.bookingGrowth ?? 0}%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {Math.abs(growthRate).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1 px-1.5">
              {growthRate >= 0 ? (
                <IconTrendingUp size={12} />
              ) : (
                <IconTrendingDown size={12} />
              )}
              <span>
                {growthRate >= 0 ? "+" : "-"}
                {Math.abs(growthRate).toFixed(1)}%
              </span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {growthRate >= 0
              ? "Steady performance increase"
              : "Performance declined"}
            {growthRate >= 0 ? (
              <IconTrendingUp size={16} />
            ) : (
              <IconTrendingDown size={16} />
            )}
          </div>
          <div className="text-muted-foreground">
            {growthRate >= 0
              ? "Meets growth projections"
              : "Needs improvement this month"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
