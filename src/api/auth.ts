import { apiUrl } from ".";

export const login = async (email: string, password: string) => {
    const response = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return response.json();
};

export const registerUser = async (fname: string, lname: string, email: string, telephone: string, password: string) => {
    const response = await fetch(`${apiUrl}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prenom: fname,nom: lname, email, telephone, password })
    });

    return response.json();
};

export const logoutUser = async (token: string) => {
    const response = await fetch(`${apiUrl}logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    return response.json();
};