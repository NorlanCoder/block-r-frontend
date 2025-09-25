import DataTable from '../../components/new/DataTable'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import PageMeta from '../../components/common/PageMeta'
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Badge from '../../components/ui/badge/Badge';
import { LockIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import { getAdmins, toggleAdmin } from '../../api/supAdmin';

export type AdminType = {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    telephone: string;
    photo: string;
    status: string;
    is_active: boolean;
};
const AdminList = () => {
    const [users, setUsers] = useState<AdminType[]|[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingButton, setLoadingButton] = useState(false)
    const auth = useSelector((state: RootState) => state.authReducer);

    const handleLoadUser = async() => {
        setLoading(true)
        const response = await getAdmins(auth.token)
        if(response.total) {
            setUsers(response.data)
            setLoading(false)
        } else {
            toast.error('Erreur lors du chargement des demandes')
            setLoading(false)
        }
    }

    const handleBlockUser = async(id: string) => {
        setLoadingButton(true)
        const response = await toggleAdmin(id, auth.token)
        if(response.agent) {
            handleLoadUser()
            setLoadingButton(false)
        } else {
            toast.error('Erreur lors du chargement des demandes')
            setLoadingButton(false)
        }
    }

    const columns: ColumnDef<AdminType>[] = [
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
            header: "Status",
            accessorKey: "is_active",
            cell: ({ row }) => {
            const value = row.getValue<boolean>("is_active");
            if (value) {
                return (
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="solid" color="success">Actif</Badge>
                </div>
                )
            }
            return (
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="solid" color="error">Inactif</Badge>
                </div>
            )
            },
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: ({ row }) => {
            const value = row.getValue<string>("id");
            const status = row.getValue<boolean>("is_active");
            return (
                <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBlockUser(value)}>
                    <Badge variant="solid" color={`${status ? "error" : "success"}`}>
                       {loadingButton ? '...' : <LockIcon className="w-4 h-4" />}
                    </Badge>
                </Button>
                </div>
            )
            }
        }
    ];

    useEffect(() => {
        handleLoadUser()
    }, [])

    return (
        <>
      <PageMeta
        title="Bloc Républicain | Liste des administrateurs"
        description="Cette page affiche la liste des administrateurs."
      />
      <PageBreadcrumb pageTitle="Liste des administrateurs" />
      <div className="rounded-2xl  w-full flex flex-row justify-between items-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Liste des administrateurs
        </h3>
      </div>

      {/* Tableau des demandes Data Table */}
      <DataTable data={users ?? []} columns={columns} loading={loading} />

    </>
    )
}

export default AdminList