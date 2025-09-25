

import PageMeta from "../../components/common/PageMeta";
import StatsAdmin from "../../components/Admin/StatsAdmin";
import DepartementChartAdmin from "../../components/Admin/DepartementChartAdmin";
import ImprimeStatAdmin from "../../components/Admin/ImprimeStatAdmin";

export default function HomeAdmin() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 ">
          <StatsAdmin />
        </div>

        <div className="col-span-12">
          <DepartementChartAdmin />
        </div>

        <div className="col-span-12">
          <ImprimeStatAdmin />
        </div>

      </div>
    </>
  );
}
