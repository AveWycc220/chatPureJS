export default class API {
  constructor(url, cookieWorker, router, stateChat, renderWorker, eventHandler) {
    this.cookie = cookieWorker
    this.router = router
    this.state = stateChat
    this.render = renderWorker
    this.eventHandler = eventHandler
    try {
      this.socket = new WebSocket(url)
      this.socket.onerror = function () {
        this.render.showError()
      }.bind(this)
      this.socket.onclose = function () {
        this.render.showError()
      }.bind(this)
      if (!this.router.isLoginPage()) {
        this.socket.onopen = function () {
          this.getMessageList()
        }.bind(this)
        this._listenCommand()
      }
    } catch(e) {
      this.render.showError(e)
    }
  }

  signIn(form, info) {
    const obj = {
      command: 'user_create',
      name: form[2].value,
      email: form[0].value,
      password: form[1].value
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 1) {
        this.router.redirectToLogin()
      } else {
        const userExistEvent = this.eventHandler.getUserAlreadyExistEvent()
        document.dispatchEvent(userExistEvent)
      }
    }.bind(this)
  }

  logIn(form) {
    const obj = {
      command: 'user_login',
      email: form[0].value,
      password: form[1].value
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 1) {
        this.cookie.add({name: 'id', value: res.user_key, maxAge: 86400, path:'/'})
        this.cookie.add({name: 'name', value: res.name, maxAge: 86400, path:'/'})
        this.router.redirectToMain()
      } else {
        const wrongDataEvent = this.eventHandler.getWrongDataEvent()
        document.dispatchEvent(wrongDataEvent)
      }
    }.bind(this)
  }

  send(message) {
    const obj = {
      command: 'message_create',
      message: message,
      time: Date.now(),
      user_key: this.cookie.getCookie('id')
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 0) {
        this.cookie.delete('id')
        this.cookie.delete('name')
        this.router.redirectToLogin()
      }
    }.bind(this)
  }

  getMessageList() {
    const obj = {
      command: 'messages_read',
      start: 0,
      end: 100
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 1) {
        res.messages.reverse()
        for (let i = 0; i < res.messages.length; i++) {
          if (this.state.storage) { this.state.storage[res.messages[i].id] = res.messages[i] }
        }
      }
    }.bind(this)
  }

  logout() {
    const obj = {
      command: 'user_exit',
      user_key: this.cookie.getCookie('id')
    }
    this.socket.send(JSON.stringify(obj))
    this.cookie.delete('id')
    this.cookie.delete('name')
    this.router.redirectToLogin()
  }

  delete(id) {
    const obj = {
      command: 'message_del',
      id: id,
      user_key: this.cookie.getCookie('id')
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 0) {
        console.log(`Wrong ID`)
      }
    }.bind(this)
  }

  edit(id, messageText) {
    const obj = {
      command: 'message_edit',
      id: id,
      message: messageText,
      user_key: this.cookie.getCookie('id')
    }
    this.socket.send(JSON.stringify(obj))
    this.socket.onmessage = function(e) {
      const res = JSON.parse(e.data)
      if (res.status === 0) {
        console.log(`Wrong ID`)
      }
    }.bind(this)
  }

  _listenCommand() {
    this.socket.addEventListener('message', e => {
      const res = JSON.parse(e.data)
      if (process.env.MODE === 'DEV') {
        console.log('Listener : ')
        console.log(res)
        console.log(res.command)
      }
      if (res.command === 'message_del' && res.status === 1) {
        if (this.state.storage) { delete this.state.storage[res.id] }
      } else if (res.command === 'message_create' && res.status === 1) {
        if (this.state.storage) { this.state.storage[res.id] = res }
      } else if (res.command === 'message_edit' && res.status === 1) {
        if (this.state.storage) { this.state.storage[res.id] = res }
      }
    })
  }
}