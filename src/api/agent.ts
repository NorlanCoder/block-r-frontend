import { apiUrl } from ".";

// Liste des demandes
export const getDemandes = async (id: string, token: string) => {
    const response = await fetch(`${apiUrl}agent/militants/agent/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

// Enregistrer une demande
export const addDemande = async (data: any, token: string) => {

    const formData = new FormData;
    formData.append('data',data)
    const response = await fetch(`${apiUrl}agent/militants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    return response.json()
}