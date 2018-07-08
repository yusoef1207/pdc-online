export function getCookies(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export function setCookies(name, value) {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

export function removeCookie(name) {
    const d = new Date(0);
    const expires = 'expires=' + d.toUTCString();
	document.cookie = name + '=;' + expires + ';path=/';
	document.cookie = name + '=;' + expires + ';path=/';
}
