import React from "react";
import { useGetCustomers } from "@/api/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CustomerData } from "@/types/customer";

const CustomerDetails = () => {
  const { data, isLoading, isError } = useGetCustomers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading customers...
      </div>
    );
  }

  if (!data?.customers?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No customers found.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-full max-w-7xl h-[700px] p-6 shadow-md rounded-xl flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
        <div className="overflow-y-auto border rounded-md flex-1">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-center">Total Spent</TableHead>
                <TableHead className="text-center">Bookings Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.customers.map((customer: CustomerData, index: number) => (
                <TableRow
                  key={customer.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-center">{customer.name}</TableCell>
                  <TableCell className="text-center">
                    {customer.mobile}
                  </TableCell>
                  <TableCell className="text-center">
                    ₹{customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.bookings?.length || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default CustomerDetails;
