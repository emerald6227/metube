export const setSessionCookie = (name, value) => {
    const tempCookie = `${name}=${value}`;
    document.cookie = tempCookie;
}

export const setPermanentCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const tempCookie = `${name}=${value}; expires=${date.toGMTString()}`;
    document.cookie = tempCookie;
}

export const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    const value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return value ? value[2] : null;
}

export const deleteCookie = (name) => {
    const date = new Date();
    date.setDate(date.getDate() - 100);
    const targetCookie = `${name}=;Expires=${date.toUTCString()}`;
    document.cookie = targetCookie;
}