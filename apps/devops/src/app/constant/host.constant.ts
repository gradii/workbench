export const SERVER_1 = 'http://10.81.21.34:36521';


export const SERVER_URL_MAP = [
  {
    match  : (url) => /^\/api\/proxy-s1/g.exec(url),
    replace: (url) => `${SERVER_1}/${url.replace(/^\/api\/proxy-s1\/?/g, 'api/')}`
  }
];
