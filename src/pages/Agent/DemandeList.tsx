import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/new/DataTable";
import { useEffect, useState } from "react";
import { getDemandes } from "../../api/agent";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import toast from "react-hot-toast";

interface MilitantType {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  photo: string;
  status: string;
  user_id: number;
  date_inscription: string;
  circonscription_id: number;
  departement_id: number;
  commune_id: number;
  reference_carte: string;
  status_paiement: string;
  removed: string;
  motif_refus: string;
  status_impression: string;
  status_verification: string;
}

const columns: ColumnDef<MilitantType>[] = [
  {
    header: 'Nom',
    accessorKey: 'nom',
  },
  {
    header: 'Email',
    accessorKey: 'prenom',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Telephone',
    accessorKey: 'telephone',
  },
  {
    header: 'Photo',
    accessorKey: 'photo',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
];

const DemandeList = () => {

  const [militants, setMilitants] = useState<MilitantType[]|[]>([])
  const auth = useSelector((state: RootState)=> state.authReducer)

  const handleListMilitant = async() => {
    const response = await getDemandes(auth.user.id, auth.token)
    if(response.success) {
      setMilitants(response.data)
    } else {
      toast.error('Erreur lors du chargement des demandes')
    }
  }

  useEffect(()=>{
    handleListMilitant()
  },[])

  return (
    <>
      <PageMeta
        title="Bloc Républicain | Liste des demandes"
        description="Cette page affiche la liste des demandes des agents."
      />
      <PageBreadcrumb pageTitle="Liste des demandes" />
      <div className="rounded-2xl  w-full flex flex-row justify-between items-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Liste des demandes
        </h3>
        <Button variant="primary">
          <PlusIcon />
          Ajouter une demande
        </Button>
      </div>

      {/* Tableau des demandes Data Table */}
      <DataTable data={militants ?? []} columns={columns} />
    </>
  )
}

export default DemandeList