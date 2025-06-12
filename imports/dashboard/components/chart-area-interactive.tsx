"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardData } from "@/types/auth";
import { useDashboardStore } from "@/store/dashboardStore";
import moment from "moment";
import { useDashboardData } from "@/api/dashboard";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";
import { Loader, Loader2 } from "lucide-react";

export const description = "An interactive area chart";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [chartData, setChartData] = React.useState<DashboardData[]>([]);
  const { selectedvenueId } = useVenueStore();
  const { isLoading } = useVenues();
  const { isLoading: dashboardLoading } = useDashboardData(selectedvenueId);
  const { dashboardData } = useDashboardStore();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (!dashboardData) return;

    let selectedData: any[] = [];

    if (timeRange === "7d" && dashboardData.lastSevenDaysBookings) {
      selectedData = dashboardData.lastSevenDaysBookings;
    } else if (timeRange === "30d" && dashboardData.lastThirtyDaysBookings) {
      selectedData = dashboardData.lastThirtyDaysBookings;
    } else if (timeRange === "90d" && dashboardData.lastThreeMonthBookings) {
      selectedData = dashboardData.lastThreeMonthBookings;
    }

    const today = moment();

    const filteredData = selectedData.filter((item) =>
      moment(item.date).isSameOrBefore(today, "day")
    );

    setChartData(filteredData ?? []);
  }, [dashboardData, timeRange]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const bookings = new Map<string, number>();

    chartData.forEach((item) => {
      const dateKey = new Date(item.date).toISOString().split("T")[0];
      bookings.set(dateKey, (bookings.get(dateKey) || 0) + 1);
    });

    const result = Array.from(bookings.entries())
      .map(([date, count]) => ({ date, bookings: count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    return result;
  }, [chartData, timeRange]);

  // console.log(dashboardData, "dashboardData");

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading || dashboardLoading ? (
          <div className="flex  items-center justify-center text-sm">
            <Loader2 className="animate-spin" />
          </div>
        ) : filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="bookings"
                type="natural"
                fill="var(--color-primary)"
                stroke="var(--color-primary)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex justify-center text-sm">No results.</div>
        )}
      </CardContent>
    </Card>
  );
}
