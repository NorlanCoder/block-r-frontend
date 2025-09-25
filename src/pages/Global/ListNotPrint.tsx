import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PencilIcon, PlusIcon } from "../../icons";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/new/DataTable";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import toast from "react-hot-toast";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Badge from "../../components/ui/badge/Badge";
import { getDemandesNonImprimer } from "../../api/supAdmin";

interface MilitantType {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  photo: File|null|string;
  sexe: string;
  status: string;
  user_id: number;
  date_inscription: string;
  circonscription_id: number;
  departement_id: number;
  commune_id: number;
  profession: string;
  adresse: string;
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
    header: 'Prénoms',
    accessorKey: 'prenom',
  },
  {
    header: 'Telephone',
    accessorKey: 'telephone',
  },
   {
    header: "Status d'impression",
    accessorKey: "status_impression",
    cell: ({ row }) => {
      const value = row.getValue<string>("status_impression");

      if (value === "not_printed") {
        return <Badge variant="solid" color="error">Non imprimé</Badge>;
      }
      return <Badge variant="solid" color="success">Imprimé</Badge>;
    },
  },
  {
    header: "Status de paiement",
    accessorKey: "status_paiement",
    cell: ({ row }) => {
      const value = row.getValue<string>("status_paiement");

      if (value === "unpaid") {
        return (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="solid" color="error">Impayé</Badge>
            <Button size="sm" variant="outline" onClick={() => alert("Lancer paiement")}>
              {/* <CreditCard className="w-4 h-4" /> */}
              <p>Lancer paiement</p>
            </Button>
          </div>
        );
      }

      return <Badge variant="solid" color="success">Payé</Badge>;
    },
  },
  {
    header: "Status de validité",
    accessorKey: "status_verification",
    cell: ({ row }) => {
      const value = row.getValue<string>("status_verification");

      switch (value) {
        case "refuse":
          return (
            <div className="flex items-center gap-2">
              <Badge variant="solid" color="error">Refusé</Badge>
              <Button size="sm" variant="outline" onClick={() => alert("Corriger")}>
                <PencilIcon className="w-4 h-4" />
              </Button>
            </div>
          );
        case "corrige":
          return <Badge variant="solid" color="info">Corrigé</Badge>;
        case "correct":
          return <Badge variant="solid" color="success">Correct</Badge>;
        case "en_cours":
          return <Badge variant="solid" color="warning">En cours</Badge>;
        default:
          return <Badge variant="solid" color="dark">Inconnu</Badge>;
      }
    },
  },
];

const countries = [
  { code: "BJ", label: "+229" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
  { code: "TG", label: "+228" },
];

const ListNotPrint = () => {

  const [loading, setLoading] = useState(false);
  const [militants, setMilitants] = useState<MilitantType[]|[]>([])
  const auth = useSelector((state: RootState)=> state.authReducer)
  
  const handleListMilitant = async() => {
    setLoading(true)
    const response = await getDemandesNonImprimer(auth.token)
    if(response.success) {
      setMilitants(response.militants)
      setLoading(false)
    } else {
      toast.error('Erreur lors du chargement des demandes')
      setLoading(false)
    }
  }

  useEffect(()=>{
    handleListMilitant()
  },[])

  return (
    <>
      <PageMeta
        title="Bloc Républicain | Liste des demandes non imprimées"
        description="Cette page affiche la liste des demandes non imprimées."
      />
      <PageBreadcrumb pageTitle="Liste des demandes" />
      <div className="rounded-2xl  w-full flex flex-row justify-between items-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Liste des demandes non imprimées
        </h3>
        {/* <Button variant="primary" onClick={openModal}>
          <PlusIcon />
          Ajouter une demande
        </Button> */}
      </div>

      {/* Tableau des demandes Data Table */}
      <DataTable data={militants ?? []} columns={columns} loading={loading}/>

    </>
  )
}

export default ListNotPrint