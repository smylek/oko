export function setCookie(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getCookie(key) {
    return JSON.parse(localStorage.getItem(key))
}