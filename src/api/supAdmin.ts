import { apiUrl } from ".";

export const getAdmins = async (token: string) => {
    const response = await fetch(`${apiUrl}super-admin/admins`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

export const toggleAdmin = async (id: string, token: string) => {
    const response = await fetch(`${apiUrl}super-admin/admins/${id}/toggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

// Get all demandes
export const getDemandes = async (token: string) => {
    const response = await fetch(`${apiUrl}militants`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande refusées
export const getDemandesRefusees = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/rejecter`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande corrigé
export const getDemandesCorrigee = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/corriger`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande payer
export const getDemandesPayer = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/payer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande non payer
export const getDemandesNonPayer = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/impayer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande imprimer
export const getDemandesImprimer = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/imprimer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Get all demande en attente
export const getDemandesNonImprimer = async (token: string) => {
    const response = await fetch(`${apiUrl}militants/non-imprimer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}
