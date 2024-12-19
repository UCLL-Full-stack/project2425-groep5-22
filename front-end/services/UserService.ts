import { User, AuthenticationResponse, AuthStatus } from "@/types";

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
};

const getUserByUsername = async (username: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/username/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getUser()?.token
        },
    });
}

const getUser = (): AuthenticationResponse | null => {
    return (() => {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            try {
                return JSON.parse(storedUser) as AuthenticationResponse;
            } catch (error) {
                console.error('Failed to parse loggedInUser:', error);
                return null;
            }
        }
        return null;
    })();
}

const createUser = async (user: User) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
}

const checkAuth = async (): Promise<AuthStatus> => {
    const authenticationResponse: AuthenticationResponse | null = getUser();
    if (!authenticationResponse) return { status: false };

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authenticationResponse.token
        },
    });
    if (!response.ok) return { status: false };
    const user = await response.json();
    return { status: true, user: user };
}

export default {
    loginUser,
    getUserByUsername,
    checkAuth,
    getUser,
    createUser
};