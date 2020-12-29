import Cookie from '../cookies/cookie';

const cookieWorker = new Cookie()

class Router {
  redirect() {
    if (process.env.MODE === 'DEV') {
      if (cookieWorker.getCookie('id') === -1 && window.location.href !== `http://${process.env.DOMAIN}:${process.env.PORT}/login`) {
        window.location.replace(`http://${process.env.DOMAIN}:${process.env.PORT}/login`)
      }
    } else if (process.env.MODE === 'PROD') {
      if (cookieWorker.getCookie('id') === -1 && window.location.href !== `${process.env.PROTOCOL}://${process.env.DOMAIN}/login`) {
        window.location.replace(`${process.env.PROTOCOL}://${process.env.DOMAIN}/login`)
      }
    }
  }
}

export default Router