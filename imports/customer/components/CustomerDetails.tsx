import React, { useEffect, useState } from "react";
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
import { CustomerData } from "@/types/customer";
import CustomerDetailsByID from "./Modal/CustomerDetailsByID";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Mosaic } from "react-loading-indicators";
import { Input } from "@/components/ui/input";
import { Calendar, IndianRupee, Phone, Search, User } from "lucide-react";

const CustomerDetails = () => {
  const { data, isLoading } = useGetCustomers();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const handleClick = () => {
    router.push("/booking");
  };

  useEffect(() => {
    if (data?.customers && Array.isArray(data.customers)) {
      setCustomers(data.customers);
    }
  }, [data]);

  const handleRowClick = (id: string) => {
    setSelectedCustomerId(id);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Mosaic color={["#3d4293", "#4e54b5", "#7277c4", "#2e326f"]} />
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center px-4">
        <Image
          src="/images/noval.svg"
          alt="No Venues Found"
          width={700}
          height={700}
          className="mb-6"
          priority
        />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          No customers Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Looks like you haven&apos;t create any booking yet. Start by creating
          your first booking to manage customers and info.
        </p>
        <Button
          onClick={handleClick}
          className="px-6 py-3 text-base rounded-md"
        >
          Create Your First Booking
        </Button>
      </div>
    );
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center  h-full">
      <Card className="w-full max-w-7xl p-6 shadow-lg rounded-xl flex flex-col max-h-[800px]  border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Customer List</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-8 w-64 bg-muted/50 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="overflow-y-auto border border-border rounded-lg flex-1 ">
          <Table className="w-full relative">
            <TableHeader className="sticky top-0 bg-muted border-b border-border">
              <TableRow>
                <TableHead className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2.5 rounded-full bg-primary/10 border border-primary/20">
                      <User size={15} className="text-primary" />
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      Customer
                    </span>
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <Phone size={15} className="text-blue-500" />
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      Contact
                    </span>
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <IndianRupee size={15} className="text-emerald-500" />
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      Spending
                    </span>
                  </div>
                </TableHead>
                <TableHead className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Calendar size={15} className="text-amber-500" />
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      Bookings
                    </span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.map((customer: CustomerData) => (
                <TableRow
                  key={customer.id}
                  className="group hover:bg-secondary/20 transition-colors border-b border-border/30 last:border-b-0"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <TableCell className="text-center font-medium py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/20">
                        <User className="h-4 w-4 text-primary" />
                      </div> */}
                      <span className="text-foreground">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span>{customer.mobile}</span>
                  </TableCell>
                  <TableCell className="text-center font-medium py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
                      </div> */}
                      <span className="text-foreground">
                        ₹ {customer.total_spent?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                        <span className="text-amber-500 text-sm font-medium">
                          {customer.booking_count || 0}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

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

export default CustomerDetails;
