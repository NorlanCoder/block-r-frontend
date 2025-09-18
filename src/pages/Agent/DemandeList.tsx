import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import UserAddressCard from "../../components/UserProfile/UserAddressCard";
import PageMeta from "../../components/common/PageMeta";

const DemandeList = () => {
  return (
    <>
      <PageMeta
        title="Bloc Républicain | Liste des demandes"
        description="Cette page affiche la liste des demandes des agents."
      />
      <PageBreadcrumb pageTitle="Liste des demandes" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Liste des demandes
        </h3>
      </div>
    </>
  )
}

export default DemandeList