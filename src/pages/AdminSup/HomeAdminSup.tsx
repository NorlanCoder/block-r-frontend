import PageMeta from "../../components/common/PageMeta";
import StatsAdminSup from "../../components/AdminSup/StatsAdminSup";
import DepartementChartSupAdmin from "../../components/AdminSup/DepartementChartSupAdmin";
import ImprimeStatSupAdmin from "../../components/AdminSup/ImprimeStatSupAdmin";

export default function HomeAdminSup() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 ">
          <StatsAdminSup />
        </div>

        <div className="col-span-12">
          <ImprimeStatSupAdmin />
        </div>

        <div className="col-span-12">
          <DepartementChartSupAdmin />
        </div>

      </div>
    </>
  );
}
