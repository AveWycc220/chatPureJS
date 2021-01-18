export default class API {
  constructor(url, cookieWorker, router, eventHandler) {
    this.cookie = cookieWorker
    this.router = router
    this.eventHandler = eventHandler
    this.messageList = []
    try {
      this.socket = new WebSocket(url)
      this.socket.onerror = function () {
        this._error()
      }.bind(this)
      this.socket.onclose = function () {
        this._error()
      }.bind(this)
      if (!this.router.isLoginPage()) {
        this.socket.onopen = function () {
         this.getMessageList()
        }.bind(this)
        this._listenCommand()
      }
    } catch(e) {
      this._error(e)
    }
  }

  signIn(form) {
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
        this.messageList = res.messages.reverse()
        const messageListEvent = this.eventHandler.getCreateMessageListEvent()
        document.dispatchEvent(messageListEvent)
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
        this._deleteMessage(res)
        const deleteEvent = this.eventHandler.getDeleteMessageEvent()
        document.dispatchEvent(deleteEvent)
      } else if (res.command === 'message_create' && res.status === 1) {
        this._addMessage(res)
        const sendEvent = this.eventHandler.getSendMessageEvent()
        document.dispatchEvent(sendEvent)
      } else if (res.command === 'message_edit' && res.status === 1) {
        this._editMessage(res)
        const editEvent = this.eventHandler.getEditMessageEvent()
        document.dispatchEvent(editEvent)
      }
    })
  }

  _deleteMessage(message) {
    this.messageList.some((item, i) => {
      if (+item.id === +message.id) {
        delete this.messageList[i]
        this.messageList = this.messageList.filter((elem) => Boolean(elem))
        return true
      }
    })
  }

  _addMessage(message) {
    this.messageList.push(message)
  }

  _editMessage(message) {
    this.messageList.some((item, i) => {
      if (+this.messageList[i].id === +message.id) {
        this.messageList[i].message = message.message
        return true
      }
    })
  }

  _error(e=undefined) {
    console.log(`Server-Error. Press F5 to Retry. ${e ? e : ''}`)
    document.body.innerHTML = `Server-Error. Press F5 to Retry. ${e ? e : ''}`
  }
}