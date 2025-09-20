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