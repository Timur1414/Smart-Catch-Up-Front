export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const client = (url, data={}) => {
    const options = {
        credentials: "include",
        ...data,
        headers: {
            ...data.headers,
        }
    };
    return fetch(SERVER_URL + url, options);
};
