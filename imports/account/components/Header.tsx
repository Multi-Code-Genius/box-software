import { fetchDashboardPDF } from "@/api/dashboard";
import { useUserStore } from "@/store/userStore";
import { FileDown } from "lucide-react";

const Header = () => {
  const { user } = useUserStore();

  const downloadDashboardPDF = async () => {
    const venueId = localStorage.getItem("venueId");

    if (!venueId) {
      alert("Game ID not found.");
      return;
    }

    try {
      const blob = await fetchDashboardPDF(venueId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `dashboard-report-${venueId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="flex items-center  rtl:justify-end w-full">
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
      </button>
      <a href="#" className="flex ms-2 md:me-24">
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
          TurfKeeper
        </span>
      </a>
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col px-8 ">
          <div className="font-medium text-xl flex gap-2">
            Welcome, <p className="font-bold">{user?.name || "User"}</p>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="mx-3">
          <button onClick={() => downloadDashboardPDF()}>
            {" "}
            <FileDown />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
