import React from "react";
import { useGetCustomerByID } from "@/api/customer";
import { useVenueStore } from "@/store/venueStore";
import {
  User,
  Info,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  FileText,
  XCircle,
  CalendarDays,
  Ban,
  X,
  CircleX,
  Phone,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const statusStyles = {
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
};

const CustomerDetailsByID = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetCustomerByID(id);
  const { venues } = useVenueStore();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );

  if (!data?.customer)
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 max-w-md mx-auto mt-8 border border-border">
        <div className="text-center">
          <Info className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">Customer not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No customer data available for this ID.
          </p>
        </div>
      </div>
    );

  const customer = data.customer;
  const totalBookings = customer.bookings?.length || 0;
  const cancelledBookingCount =
    customer.bookings?.filter((booking: any) => booking.is_cancel === true)
      ?.length || 0;
  console.log(customer);
  return (
    <div className="space-y-6 max-h-[900px] ">
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col ">
            <div className="flex flex-col gap-4">
              <div className="flex  gap-4">
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 shadow-sm border border-border">
                    <span className="block h-4 w-4 rounded-full bg-green-400"></span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      {customer.name}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{customer.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full min-w-0 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/50">
                        <IndianRupee className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Spent
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {customer.total_spent.toLocaleString()}
                    </p>
                  </div>

                  {/* Bookings */}
                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Bookings
                      </p>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {totalBookings}
                    </p>
                  </div>

                  {/* Last Booking */}
                  <div className="hidden sm:block bg-muted/50 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-cyan-100 dark:bg-cyan-900/50">
                        <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Booking
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-foreground">
                      {totalBookings > 0
                        ? formatDate(customer.bookings[0].date)
                        : "N/A"}
                    </p>
                  </div>

                  <div className="hidden sm:block bg-muted/50 p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/50">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Cancellations
                      </p>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        cancelledBookingCount > 0
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {cancelledBookingCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking History
            </h3>
            <div className="flex items-center gap-2">
              {totalBookings > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <CalendarDays className="h-3 w-3" />
                  {totalBookings} {totalBookings === 1 ? "Booking" : "Bookings"}
                </span>
              )}

              {cancelledBookingCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                  {cancelledBookingCount}{" "}
                  {cancelledBookingCount === 1 ? "Cancelled" : "Cancelled"}
                </span>
              )}
            </div>
          </div>
        </div>

        {!customer.bookings || customer.bookings.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This customer hasn't made any bookings.
            </p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[400px] rounded-md border border-border">
            <Table className="min-w-full relative">
              <TableHeader className="sticky top-0 z-20 bg-muted border-b border-border">
                <TableRow>
                  <TableHead className="px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Venue
                  </TableHead>
                  <TableHead className="px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date & Time
                  </TableHead>
                  <TableHead className="px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cancel bookings
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.bookings.map((booking: any) => {
                  const venue = venues.find((v) => v.id === booking.venue_id);
                  const name = venue?.name || "N/A";
                  const status =
                    statusStyles[
                      booking.status.toLowerCase() as keyof typeof statusStyles
                    ] || "bg-muted text-muted-foreground";

                  const cancelStatus = booking.is_cancel
                    ? "bg-destructive/10 text-destructive"
                    : "text-muted-foreground";

                  return (
                    <TableRow
                      key={booking.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin size={15} className="text-primary" />
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium">{name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium leading-6">
                          {formatDate(booking.date)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 leading-6">
                          <Clock className="h-3 w-3" />
                          {formatTime(booking.start_time)} -{" "}
                          {formatTime(booking.end_time)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {booking.total_amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1).toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${cancelStatus}`}
                        >
                          {booking.is_cancel ? (
                            <div className="flex items-center gap-1">
                              Cancelled
                            </div>
                          ) : (
                            "-"
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsByID;
