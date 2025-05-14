"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomProvider, DatePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { FaClock } from "react-icons/fa";
import { CircleCheck, X } from "lucide-react";
import { createBooking, getGameById } from "../../api/api";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useTheme } from "next-themes";
import { BookingFormData, BookingRequest } from "@/types/auth";

type BookingFormProps = {
  setShowModal: (show: boolean) => void;
};

const BookingForm = ({ setShowModal }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    amount: "",
    date: null as Date | null,
    startTime: null as Date | null,
    endTime: null as Date | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | Date | null) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.amount.trim()) newErrors.amount = "Amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const gameId = localStorage.getItem("gameId");

      const bookingRequest: BookingRequest = {
        name: formData.name,
        number: formData.phone, // Maps to 'phone' in form but 'number' in API
        amount: Number(formData.amount),
        date: formData.date ? moment(formData.date).format("YYYY-MM-DD") : "",
        startTime: formData.startTime
          ? moment(formData.startTime).format("hh:mm A")
          : "",
        endTime: formData.endTime
          ? moment(formData.endTime).format("hh:mm A")
          : "",
        nets: 2,
        gameId,
        totalAmount: Number(formData.amount),
      };

      await createBooking(bookingRequest);
      setShowModal(false);
    } catch (error) {
      console.error("Booking creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGameById();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] z-40" />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full z-50">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-5 cursor-pointer"
        >
          <X />
        </button>

        <form
          className="w-full px-14 py-14 rounded-lg flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <Label className="text-xl ">Booking Info</Label>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter the Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="number"
              placeholder="Enter the Number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Total Amount</Label>
            <Input
              type="number"
              placeholder="Enter the Amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount}</p>
            )}
          </div>

          <CustomProvider
            theme={theme as "light" | "dark" | "high-contrast" | undefined}
          >
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                placeholder="Select date"
                className="w-full rounded-md   "
                format="dd-MM-yyyy"
                style={{ width: "100%" }}
                value={formData.date}
                appearance="default"
                oneTap
                onChange={(value) => handleChange("date", value)}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <DatePicker
                caretAs={FaClock}
                format="hh:mm a"
                showMeridian
                className="w-full rounded-md   "
                value={formData.startTime}
                onChange={(value) => handleChange("startTime", value)}
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <DatePicker
                caretAs={FaClock}
                format="hh:mm a"
                showMeridian
                className="w-full rounded-md   "
                value={formData.endTime}
                onChange={(value) => handleChange("endTime", value)}
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs ">{errors.endTime}</p>
              )}
            </div>
          </CustomProvider>

          <div className="flex w-full justify-between mt-4">
            <Button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex gap-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full border-t-2 border-b-2 border-white w-4 h-4" />
                  Booking...
                </>
              ) : (
                <>
                  <CircleCheck size={18} />
                  Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BookingForm;
