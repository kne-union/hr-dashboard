import Cookies from 'js-cookie';

const DOMAIN = (() => {
  const list = window.location.hostname.split('.');
  if (list.length > 1) {
    return '.' + list.slice(1).join('.');
  }
  return window.location.hostname;
})();

const prefix = 'TOKEN_' + DOMAIN.replace(/\./g, '_').toUpperCase();

export const getCookies = key => {
  return Cookies.get(prefix + '_' + key.toUpperCase());
};

export const setCookies = (key, value) => {
  return Cookies.set(prefix + '_' + key.toUpperCase(), value, { domain: DOMAIN });
};

export default { setCookies, getCookies };
