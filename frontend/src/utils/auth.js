const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

export const isLoggedIn = () => {
    return !!getAccessToken();
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export const authFetch = async (url, options = {}) => {
    let token = getAccessToken();

    const headers = {
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // Access token expired
    if (response.status === 401) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            logout();
            return response;
        }

        try {
            const refreshResponse = await fetch(
                `${BASE_URL}/api/token/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh: refreshToken,
                    }),
                }
            );

            const refreshData = await refreshResponse.json();

            if (refreshResponse.ok && refreshData.access) {
                localStorage.setItem(
                    "access_token",
                    refreshData.access
                );

                headers.Authorization =
                    `Bearer ${refreshData.access}`;

                response = await fetch(url, {
                    ...options,
                    headers,
                });
            } else {
                logout();
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            logout();
        }
    }

    return response;
};