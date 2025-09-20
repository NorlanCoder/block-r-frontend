import { apiUrl } from ".";

// Get all communes
export const getCommunes = async () => {
    const response = await fetch(`${apiUrl}communes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

// Get all circonscriptions
export const getCirconscriptions = async () => {
    const response = await fetch(`${apiUrl}circonscriptions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

// Get all departements
export const getDepartements = async () => {
    const response = await fetch(`${apiUrl}departements`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};