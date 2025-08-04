export const getApiUrl = (path) => {
    const backendUrl = window.BACKEND_URL || '';
    return `${backendUrl}${path}`;
};

export const fetchApi = async (path, options = {}) => {
    const url = getApiUrl(path);
    options["credentials"]="include"
    return fetch(url, options);
};