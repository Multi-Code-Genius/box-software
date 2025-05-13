"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { FaClock } from "react-icons/fa";
import { CircleCheck, X } from "lucide-react";
import { createBooking, getGameById } from "../../api/api";
import { Button } from "@/components/ui/button";
import moment from "moment";

type BookingFormProps = {
  setShowModal: (show: boolean) => void;
};

const BookingForm = ({ setShowModal }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
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

    const gameId = localStorage.getItem("gameId");

    try {
      const selectedDate = formData.date!;

      const formatTime = (time: Date | null): string => {
        return time ? moment(time).format("hh:mm A") : "";
      };

      const data = {
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
        nets: 2,
        gameId,
        totalAmount: Number(formData.amount),
        date: moment(selectedDate).format("YYYY-MM-DD"),
        number: formData.phone,
        name: formData.name,
      };

      await createBooking(data);
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
          <h3>Booking Info</h3>
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

          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker
              placeholder="Select date"
              className="w-full rounded-md "
              format="dd-MM-yyyy"
              cleanable
              appearance="default"
              style={{ width: "100%" }}
              value={formData.date}
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
              className="w-full"
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
              className="w-full"
              value={formData.endTime}
              onChange={(value) => handleChange("endTime", value)}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs">{errors.endTime}</p>
            )}
          </div>

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
