export default class Router {
  constructor(cookieWorker) {
    this.cookie = cookieWorker
  }

  redirect() {
    if (process.env.MODE === 'DEV') {
      if (this.cookie.getCookie('id') === -1 && window.location.href !== `http://${process.env.DOMAIN}:${process.env.PORT}/login`) {
        window.location.replace(`http://${process.env.DOMAIN}:${process.env.PORT}/login`)
      }
    } else if (process.env.MODE === 'PROD') {
      if (this.cookie.getCookie('id') === -1 && window.location.href !== `${process.env.PROTOCOL}://${process.env.DOMAIN}/login/`) {
        window.location.replace(`${process.env.PROTOCOL}://${process.env.DOMAIN}/login/`)
      }
    }
  }

  redirectToMain() {
    window.location.href = `../`
  }

  redirectToLogin() {
    window.location.href = `../login`
  }
}
