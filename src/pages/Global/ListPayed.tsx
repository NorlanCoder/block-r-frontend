import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PencilIcon, PlusIcon } from "../../icons";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/new/DataTable";
import { useEffect, useRef, useState } from "react";
import { addDemande, getDemandes } from "../../api/agent";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import toast from "react-hot-toast";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import Badge from "../../components/ui/badge/Badge";

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

const defaultMilitant = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    photo: null as File | null,
    sexe: '',
    status: '',
    user_id: 0,
    date_inscription: '',
    circonscription_id: 0,
    departement_id: 0,
    commune_id: 0,
    profession: '',
    adresse: '',
    reference_carte: '',
    status_paiement: '',
    removed: '',
    motif_refus: '',
    status_impression: '',
    status_verification: '',
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

const ListPayed = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ouvrir la caméra
  const openCameraStream = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true, // <-- pas de facingMode sur PC
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Erreur caméra :", err);
      toast.error("Impossible d'accéder à la caméra");
    }
  };

  // Capturer une photo
  const takePhoto = () => {
    if (!videoRef.current) return;
    if (videoRef.current.videoWidth === 0) {
      toast.error("Caméra pas encore prête !");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setMilitant((prev)=> ({...prev, photo: dataUrl}))
      setImagePreview(dataUrl);
      stopCamera();
      setShowCamera(false);
    }
  };

  // Fermer caméra (nettoyage)
  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const [militants, setMilitants] = useState<MilitantType[]|[]>([])
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [onEdit, setOnEdit] = useState(false)
  const auth = useSelector((state: RootState)=> state.authReducer)
  const departements = useSelector((state: RootState)=> state.appReducer.departements)
  const circonscriptions = useSelector((state: RootState)=> state.appReducer.circonscriptions)
  const communes = useSelector((state: RootState)=> state.appReducer.communes)

  const [militant, setMilitant] = useState<MilitantType>(defaultMilitant)

  const validateForm = () => {
  const newErrors: {[key: string]: string} = {};
    if (!militant.nom) newErrors.nom = "Le nom est obligatoire";
    if (!militant.prenom) newErrors.prenom = "Le prénom est obligatoire";
    if (!militant.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(militant.email)) {
      newErrors.email = "Email invalide";
    }
    if (!militant.telephone) newErrors.telephone = "Le téléphone est obligatoire";
    if (!militant.adresse) newErrors.adresse = "L'adresse est obligatoire";
    if (!militant.profession) newErrors.profession = "La profession est obligatoire";
    if (!militant.sexe) newErrors.sexe = "Le sexe est obligatoire";
    if (!militant.departement_id) newErrors.departement_id = "Le département est obligatoire";
    if (!militant.circonscription_id) newErrors.circonscription_id = "La circonscription est obligatoire";
    if (!militant.commune_id) newErrors.commune_id = "La circonscription est obligatoire";
    if (!militant.photo) newErrors.photo = "La photo est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { isOpen, openModal, closeModal } = useModal();

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setMilitant((prev)=> ({...prev, photo: file}))
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSexeChange = (value: string) => {
    setMilitant(prev => ({ ...prev, sexe: value }));
  };

  const handleDepartementChange = (value: string) => {
    setMilitant(prev => ({ ...prev, departement_id: Number(value) }));
  }

  const handleCirconscriptionChange = (value: string) => {
    setMilitant(prev => ({ ...prev, circonscription_id: Number(value) }));
  }

  const handleCommuneChange = (value: string) => {
    setMilitant(prev => ({ ...prev, commune_id: Number(value) }));
  }
  
  const handleListMilitant = async() => {
    setLoading(true)
    const response = await getDemandes(auth.user.id, auth.token)
    if(response.success) {
      setMilitants(response.data)
      setLoading(false)
    } else {
      toast.error('Erreur lors du chargement des demandes')
      setLoading(false)
    }
  }

  const handleContact = (value: string) => {
    setMilitant(prev => ({ ...prev, telephone: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMilitant(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Merci de corriger les erreurs.");
      return;
    }

    try {
      // Ici tu peux appeler ton API
      console.log("Données envoyées :", militant);
      const response = await addDemande(militant, auth.token)

      if (!response.success) {
        if(response.errors) {
          Object.keys(response.errors).forEach((key) => {
            setErrors(prev => ({...prev, [key]: response.errors[key]}))
          })
        }
        return;
      } else {
        setErrors({})
        setMilitant(defaultMilitant)
        setImagePreview(null);
        closeModal();
        setStream(null);
        setShowCamera(false);
        handleListMilitant()
      }

      toast.success("Demande enregistrée avec succès !");
      // closeModal();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  useEffect(()=>{
    handleListMilitant()
  },[])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => {
          console.error("Erreur lecture vidéo :", err);
        });
      };
    }
  }, [stream]);
  

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
        <Button variant="primary" onClick={openModal}>
          <PlusIcon />
          Ajouter une demande
        </Button>
      </div>

      {/* Tableau des demandes Data Table */}
      <DataTable data={militants ?? []} columns={columns} loading={loading}/>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Ajouter une demande
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Ajouter une nouvelle demande de militant
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Nom
                      </label>
                      <Input
                        type="text"
                        name="nom"
                        placeholder="Nom"
                        value={militant.nom}
                        onChange={handleChange}
                      />
                      {errors.nom && <p className="text-red-500 text-xs">{errors.nom}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Prénoms
                      </label>
                      <Input
                        type="text"
                        name="prenom"
                        placeholder="Prénoms"
                        value={militant.prenom}
                        onChange={handleChange}
                      />
                      {errors.prenom && <p className="text-red-500 text-xs">{errors.prenom}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        E-mail
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={militant.email}
                        onChange={handleChange}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Contact
                      </label>
                      <PhoneInput
                        selectPosition="start"
                        countries={countries}
                        onChange={handleContact}
                      />
                      {errors.telephone && <p className="text-red-500 text-xs">{errors.telephone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Sexe
                      </label>
                      <Select
                        options={[{value: "Homme", label: "Homme"}, {value: "Femme", label: "Femme"}]}
                        placeholder="Choisissez un genre"
                        onChange={handleSexeChange}
                        className="dark:bg-dark-900"
                      />
                      {errors.sexe && <p className="text-red-500 text-xs">{errors.sexe}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Profession
                      </label>
                      <Input type="text" name="profession" value={militant.profession} onChange={handleChange} placeholder="Profession" />
                      {errors.profession && <p className="text-red-500 text-xs">{errors.profession}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Adresse
                      </label>
                      <Input type="text" name="adresse" value={militant.adresse} onChange={handleChange} placeholder="Adresse" />
                      {errors.adresse && <p className="text-red-500 text-xs">{errors.adresse}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Département
                      </label>
                      <Select
                        options={departements.map((d) => ({value: d.code_dep, label: d.lib_dep}))}
                        placeholder="Sélectionner un departement"
                        onChange={handleDepartementChange}
                        className="dark:bg-dark-900"
                      />
                      {errors.departement_id && <p className="text-red-500 text-xs">{errors.departement_id}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Circonscription
                      </label>
                      <Select
                        options={
                          militant.departement_id
                          ? circonscriptions
                                .filter((c) => c.code_dep == String(militant.departement_id))
                                .map((c) => ({ value: c.code_circ, label: c.lib_circ }))
                            : []
                        }
                        placeholder="Sélectionner une commune"
                        onChange={handleCirconscriptionChange}
                        className="dark:bg-dark-900"
                      />
                      {errors.circonscription_id && <p className="text-red-500 text-xs">{errors.circonscription_id}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Communes
                      </label>
                      <Select
                        options={militant.circonscription_id ? communes.filter((c) => c.code_circ == String(militant.circonscription_id)).map((c) => ({value: c.code_com, label: c.lib_com})) : []}
                        placeholder="Sélectionner une commune"
                        onChange={handleCommuneChange}
                        className="dark:bg-dark-900"
                      />
                      {errors.commune_id && <p className="text-red-500 text-xs">{errors.commune_id}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">
                        Image
                      </label>
                       {!showCamera ? (
                          <div className="gap-2 flex">
                            <Button size="sm" className="bg-yellow-500" onClick={handleFileClick}>
                              Choisir un fichier
                            </Button>
                            <Button size="sm" className="bg-brand-500" onClick={openCameraStream}>
                              Prendre une photo
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-40 h-40 rounded border object-cover bg-black"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" onClick={takePhoto} className="bg-green-600">
                                📸 Capturer
                              </Button>
                              <Button size="sm" onClick={() => { stopCamera(); setShowCamera(false); }} variant="outline">
                                ❌ Annuler
                              </Button>
                            </div>
                          </div>
                        )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      {/* Input pour ouvrir la caméra en mode selfie */}
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="user" // 📸 Front camera
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      {errors.photo && <p className="text-red-500 text-xs">{errors.photo}</p>}
                    </div>
                    <div>
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                          <div className="flex justify-center">
                            <img
                              src={imagePreview}
                              alt="Prévisualisation"
                              className="w-40 h-40 object-cover rounded border"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default ListPayed