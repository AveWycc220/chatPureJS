export default class API {
  constructor(url, cookieWorker, router, stateChat) {
    this.cookie = cookieWorker
    this.router = router
    this.state = stateChat
    try {
      this.socket = new WebSocket(url)
      this.socket.onopen = function () {
        this.getMessageList()
      }.bind(this)
      this._listenCommand()
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
        this.router.redirectToLogin()
      } else {
        info.innerHTML = 'User is already created!'
      }
    }.bind(this)
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
        this.cookie.add({name: 'id', value: res.user_key, maxAge: 86400, path:'/'})
        this.cookie.add({name: 'name', value: res.name, maxAge: 86400, path:'/'})
        this.router.redirectToMain()
      } else {
        info.innerHTML = 'Wrong Email or Password'
      }
    }.bind(this)
  }

  send(message) {
    let obj = {
      command: 'message_create',
      message: message,
      time: Date.now(),
      user_key: this.cookie.getCookie('id')
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      let res = JSON.parse(e.data)
      if (res.status === 0) {
        this.cookie.delete('id')
        this.cookie.delete('name')
        this.router.redirectToLogin()
      }
    }.bind(this)
  }

  getMessageList() {
    let obj = {
      command: 'messages_read',
      start: 0,
      end: 100
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      let res = JSON.parse(e.data)
      if (res.status === 1) {
        for (let i = 0; i < res.messages.length; i++) {
          if (this.state.storage) { this.state.storage[i] = res.messages[i] }
        }
      }
    }.bind(this)
  }

  _listenCommand() {
    this.socket.onmessage = function (e) {
      console.log(JSON.parse(e.data))
    }
  }
}