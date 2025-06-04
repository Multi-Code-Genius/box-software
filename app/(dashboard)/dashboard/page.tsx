import { ChartAreaInteractive } from "@/imports/dashboard/components/chart-area-interactive";
import { DataTable } from "@/imports/dashboard/components/data-table";
import { SectionCards } from "@/imports/dashboard/components/section-cards";
import { data } from "@/constant/data";
import Venues from "@/imports/dashboard/components/Venues";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Venues />

          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
