export default class Cookie{
  values={};

  constructor() {
    this.updateValues();
  }

  add(value) {
    if (value.hasOwnProperty('name') && value.hasOwnProperty('value')) {
      this.values = {};
      let cookie = `${value.name}=${value.value};`;
      if (value.hasOwnProperty('maxAge')) cookie += `max-age=${value.maxAge};`;
      if (value.hasOwnProperty('domain')) cookie += `domain=${value.domain};`;
      if (value.hasOwnProperty('path')) cookie += `path=${value.path};`;
      if (value.hasOwnProperty('samesite')) cookie += `samesite=${value.samesite};`;
      if (value.hasOwnProperty('secure')) if (value.secure) cookie += `secure;`;
      if (value.hasOwnProperty('expires')) cookie += `expires=${value.expires};`;
      document.cookie = cookie;
      this.updateValues();
    }
  }

  updateValues() {
    if (document.cookie !== '') {
      this.values = {}
      let decodedCookie = decodeURIComponent(document.cookie);
      let cookieList = decodedCookie.split(';');
      for (let i=0; i < cookieList.length; i++) {
        let [key, value]=cookieList[i].split("=");
        this.values[key.trim()] = value.trim();
      }
    }
  }

  delete(name) {
    if (this.values.hasOwnProperty(`${name}`)) {
      console.log('delete')
      document.cookie = `${name}=${this.values[`${name}`]};expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      this.updateValues();
    }
  }

  getCookie(name) {
    this.updateValues();
    if (this.values.hasOwnProperty(`${name}`)) return this.values[`${name}`];
    else return -1;
  }
}
