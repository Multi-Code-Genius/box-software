import React, { useEffect, useState } from "react";
import { useDashboardData } from "@/api/dashboard";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mosaic } from "react-loading-indicators";
import { useVenueStore } from "@/store/venueStore";
import { useVenues } from "@/api/vanue";
import CustomerDetailsByID from "@/imports/customer/components/Modal/CustomerDetailsByID";
import { useRouter } from "next/navigation";

type BookingWithCustomer = {
  status: string;
  id: string;
  customer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  is_cancel: boolean;
  customer: {
    id: string;
    name: string;
    mobile: string;
    total_spent?: number;
    booking_count?: number;
  };
};

const DataTable = () => {
  const [customers, setCustomers] = useState<BookingWithCustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const { selectedvenueId } = useVenueStore();
  const { dashboardData } = useDashboardStore();
  const { isLoading: dashboardLoading } = useDashboardData(selectedvenueId);
  const { isLoading } = useVenues();

  useEffect(() => {
    if (
      dashboardData?.ThisMonthBookings &&
      Array.isArray(dashboardData.ThisMonthBookings)
    ) {
      setCustomers(dashboardData.ThisMonthBookings);
    }
  }, [dashboardData]);

  const handleRowClick = (id: string) => {
    setSelectedCustomerId(id);
    setIsDialogOpen(true);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB");

  if (isLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Mosaic color={["#3d4293", "#4e54b5", "#7277c4", "#2e326f"]} />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="overflow-y-auto border border-border rounded-lg flex-1">
        <Table className="w-full relative">
          <TableHeader className="sticky top-0 bg-muted border-b border-border z-10">
            <TableRow>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Mobile</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Start Time</TableHead>
              <TableHead className="text-center">End Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(booking.customer?.id)}
                >
                  <TableCell className="text-center py-4">
                    {booking.customer?.name || "—"}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {booking.customer?.mobile || "—"}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {booking?.status || "—"}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    ₹ {booking.total_amount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {formatDate(booking.date)}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {formatTime(booking.start_time)}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {formatTime(booking.end_time)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6  text-sm">
                  No results .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[768px] max-w-2xl max-h-[900px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomerId && (
            <CustomerDetailsByID id={selectedCustomerId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;
