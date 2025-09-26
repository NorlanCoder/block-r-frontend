import { apiUrl } from ".";

export const getAgents = async (token: string) => {
    const response = await fetch(`${apiUrl}agents`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

export const toggleAgent = async (id: string, token: string) => {
    const response = await fetch(`${apiUrl}agents/${id}/toggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

// REfused demande
export const refuserDemande = async (id: number, data: string, token: string) => {
    const response = await fetch(`${apiUrl}demandes/${id}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({motif_refus: data})
    });
    return response.json();
};

// Accepted demande
export const accepterDemande = async (id: number, token: string) => {
    const response = await fetch(`${apiUrl}demandes/${id}/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};

// Run printed
export const runPrinted = async (id: number, token: string) => {
    const response = await fetch(`${apiUrl}demandes/${id}/print`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    return response.json();
};