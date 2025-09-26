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
import { getDemandesCorrigee } from "../../api/supAdmin";
import { FaCheckDouble, FaEye, FaPrint, FaSpinner } from "react-icons/fa";
import CardPreview from "../../components/Agent/CardPreview";
import { accepterDemande, refuserDemande, runPrinted } from "../../api/admin";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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

const ListCorrected = () => {

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [militants, setMilitants] = useState<MilitantType[]|[]>([])
  const [reason, setReason] = useState("")
  const auth = useSelector((state: RootState)=> state.authReducer)
  const [selectedMilitant, setSelectedMilitant] = useState<MilitantType | null>(null);
  const { isOpen: isPreviewOpen, openModal: openPreview, closeModal: closePreview } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();

  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({contentRef: cardRef});

  const markAsPrinted = async(claimId: number) => {
    setButtonLoading(true)
    const response = await runPrinted(claimId, auth.token)
    if(response.militant) {
      handleListMilitant()
      closeConfirm()
      setButtonLoading(false)
      toast.success("Impression lancée")
    } else {
      toast.error('Erreur lors du chargement des demandes')
      setButtonLoading(false)
    }
  }

  const runPrint = async() => {
    await markAsPrinted(selectedMilitant?.id as number)
    handlePrint()
  }

  const handlePreview = (militant: MilitantType) => {
    setSelectedMilitant(militant);
    openPreview();
  };

  const handleReject = (militant: MilitantType) => {
    setSelectedMilitant(militant);
    openConfirm();
  };
  
  const handleListMilitant = async() => {
    setLoading(true)
    const response = await getDemandesCorrigee(auth.token)
    if(response.success) {
      setMilitants(response.militants)
      setLoading(false)
    } else {
      toast.error('Erreur lors du chargement des demandes')
      setLoading(false)
    }
  }

  const markTorefused = async(claimId: number) => {
        setButtonLoading(true)
        const response = await refuserDemande(claimId, reason, auth.token)
        if(response.militant) {
        handleListMilitant()
        setReason("")
        closeConfirm()
        setButtonLoading(false)
        } else {
        toast.error('Erreur lors du chargement des demandes')
        setButtonLoading(false)
        }
    }

    const markToCorrected = async(claimId: number) => {
        setButtonLoading(true)
        const response = await accepterDemande(claimId, auth.token)
        if(response.militant) {
            handleListMilitant()
            setReason("")
            closeConfirm()
            setButtonLoading(false)
            toast.success("Correction acceptée")
        } else {
            toast.error('Erreur lors du chargement des demandes')
            setButtonLoading(false)
        }
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
        const militant = row.original;
        if (value === "not_printed") {
            return (
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="solid" color="error">Non imprimé</Badge>
                    {militant.status_paiement === "paid" && militant.status_verification === "correct" &&
                        <Button size="sm" variant="outline" onClick={() => handlePreview(militant)}>
                            <FaPrint className="w-4 h-4" />
                            <p>Imprimer</p>
                        </Button>
                    }
                </div>
            )
        }
        return (
            <div className="flex items-center justify-center gap-2">
            <Badge variant="solid" color="success">Imprimé</Badge>
            </div>
        )
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
            </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-2">
            <Badge variant="solid" color="success">Payé</Badge>
            </div>
        )
        },
    },
    {
        header: "Status de validité",
        accessorKey: "status_verification",
        cell: ({ row }) => {
        const value = row.getValue<string>("status_verification");
        const militant = row.original;
        switch (value) {
            case "refuse":
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="solid" color="error">Refusé</Badge>
                </div>
            );
            case "corrige":
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="solid" color="info">Corrigé</Badge>
                    <Button size="sm" variant="primary" onClick={() => markToCorrected(militant.id)}>
                        <FaCheckDouble className="w-3 h-3 text-success" />
                    </Button>
                </div>
            )
            case "correct":
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="solid" color="success">Correct</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleReject(militant)}>
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                </div>
            )
            case "en_cours":
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="solid" color="warning">En cours</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleReject(militant)}>
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                </div>
            )
            default:
            return <Badge variant="solid" color="dark">Inconnu</Badge>;
        }
        }
        
    },
    {
        header: "Actions",
        accessorKey: "nom",
        cell: ({ row }) => {
            const militant = row.original;
            return (
                <div className="flex items-center">
                    <Button size="sm" variant="outline" onClick={() => handlePreview(militant)}>
                        <FaEye className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    }
];

  useEffect(()=>{
    handleListMilitant()
  },[])

  return (
    <>
      <PageMeta
        title="Bloc Républicain | Liste des demandes corrigées"
        description="Cette page affiche la liste des demandes corrigées."
      />
      <PageBreadcrumb pageTitle="Liste des demandes" />
      <div className="rounded-2xl  w-full flex flex-row justify-between items-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Liste des demandes corrigées
        </h3>
        {/* <Button variant="primary" onClick={openModal}>
          <PlusIcon />
          Ajouter une demande
        </Button> */}
      </div>

      {/* Tableau des demandes Data Table */}
      <DataTable data={militants ?? []} columns={columns} loading={loading}/>
      <Modal isOpen={isPreviewOpen} onClose={closePreview} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <p>
                    Prévisualisation de la carte membre:{" "}
                    {selectedMilitant && <span className="font-semibold">{selectedMilitant.nom} {selectedMilitant.prenom}</span>}
                </p>
                {selectedMilitant && <div ref={cardRef}>
                    <CardPreview militant={selectedMilitant} />
                </div> }

                {
                    selectedMilitant && selectedMilitant.status_impression === "not_printed" && selectedMilitant.status_paiement === "paid" && selectedMilitant.status_verification === "correct" &&
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={runPrint}>
                            {buttonLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : "Imprimer"}
                        </Button>
                    </div>
                }
                
            </div>
        </Modal>

        <Modal isOpen={isConfirmOpen} onClose={closeConfirm} className="max-w-[700px] m-4">
        {selectedMilitant && (
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="flex flex-col gap-4">
                    <p>
                        Voulez-vous vraiment rejeter la demande de{" "}
                        <span className="font-semibold">{selectedMilitant.nom} {selectedMilitant.prenom}</span> ?
                    </p>
                    <label htmlFor="">Raison du rejet</label>
                    <textarea
                        name="reason"
                        id="reason"
                        rows={4}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ajouter une note de confirmation..."
                        className="w-full border rounded-md p-2 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={closeConfirm}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={() => markTorefused(selectedMilitant.id)}>
                            {buttonLoading ? '...' : 'Confirmer'}
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </Modal>

    </>
  )
}

export default ListCorrected