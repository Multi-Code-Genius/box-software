import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const getAllCustomers = async () => {
  try {
    const response = await api("/api/v2/customer/client", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => getAllCustomers(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
  });
};

const getCustomerByID = async (customerId: string) => {
  try {
    const response = await api(`/api/v2/customer/data/${customerId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const resp = await response;
    return resp;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Data Not Found");
  }
};

export const useGetCustomerByID = (id: string) => {
  return useQuery({
    queryKey: ["customerId", id],
    queryFn: () => getCustomerByID(id),
  });
};
