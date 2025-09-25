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