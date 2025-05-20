import React from "react";
import { useGetCustomerByID } from "@/api/customer";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const CustomerDetailsByID = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetCustomerByID(id);

  if (isLoading)
    return <div className="text-center">Loading customer details...</div>;
  if (!data?.customer)
    return <div className="text-center">No customer data found.</div>;

  const customer = data.customer;

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div>
          <strong>Name:</strong> {customer.name}
        </div>
        <div>
          <strong>Total Spent:</strong> ₹{customer.totalSpent.toLocaleString()}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mt-4 mb-2">Bookings</h4>
        {customer.bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings available.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Game</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2 text-left">End</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {customer.bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-t">
                    <td className="p-2">{booking.game?.name || "N/A"}</td>
                    <td className="p-2">{formatDate(booking.date)}</td>
                    <td className="p-2">{formatTime(booking.startTime)}</td>
                    <td className="p-2">{formatTime(booking.endTime)}</td>
                    <td className="p-2">₹{booking.totalAmount}</td>
                    <td className="p-2">{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsByID;
