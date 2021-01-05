import Cookie from "../cookies/cookie"
import Router from "../router/router";

const cookieWorker = new Cookie()
const router = new Router()

class API {
  constructor(url) {
    try {
      this.socket = new WebSocket(url)
      this.status = 0
    } catch(e) {
      console.log(`Server-Error ${e}`)
    }
  }

  signIn(form, info) {
    let obj = {
      command: 'user_create',
      name: form[2].value,
      email: form[0].value,
      password: form[1].value
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      let res = JSON.parse(e.data)
      if (res.status === 1) {
        router.redirectToLogin()
      } else {
        info.innerHTML = 'User is already created!'
      }
    }
  }

  logIn(form, info) {
    let obj = {
      command: 'user_login',
      email: form[0].value,
      password: form[1].value
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      let res = JSON.parse(e.data)
      if (res.status === 1) {
        cookieWorker.add({name: 'id', value: res.user_key, maxAge: 86400, path:'/'})
        cookieWorker.add({name: 'name', value: res.name, maxAge: 86400, path:'/'})
        router.redirectToMain()
      } else {
        info.innerHTML = 'Wrong Email or Password'
      }
    }
  }
}

export default API