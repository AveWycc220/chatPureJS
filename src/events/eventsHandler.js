export default class EventsHandler{
  constructor({renderWorker = undefined, apiWorker = undefined, form = undefined, loginButton = undefined, signinButton =  undefined,
                divInfo = undefined, buttonSend = undefined, messageInput = undefined}) {
    this.render = renderWorker
    this.api = apiWorker
    this.info = divInfo
    this.signinEvent(form, signinButton)
    this.loginEvent(form, loginButton)
    this.sendEvent(messageInput, buttonSend)
    this.loadingEvent()
  }

  signinEvent(form, btn) {
    if (btn && form) {
      btn.addEventListener('click', () => {
        this.render.showInput(form[2])
        if (form[0].value && form[1].value && form[2].value) {
          this.api.signIn(form, this.info)
          this.render.restyleForm(form, true)
        } else {
          this.render.restyleForm(form, true)
        }
      })
    }
  }

  loginEvent(form, btn) {
    if (btn && form) {
      btn.addEventListener('click', () => {
        this._login(form)
      })
      document.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          this._login(form)
        }
      })
    }
  }

  sendEvent(messageInput, btn) {
    if (messageInput && btn) {
      btn.addEventListener('click', () => {
        this._callSendAPI(messageInput.textContent)
        messageInput.textContent = ''
      })
      document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.shiftKey !== true) {
          this._callSendAPI(messageInput.textContent)
          messageInput.textContent = ''
          e.preventDefault()
        }
      })
    }
  }

  loadingEvent() {
    document.addEventListener('DOMContentLoaded', () => {
      const userNameField = document.querySelector('#name')
      if (userNameField) {
        this.render.renderName(userNameField)
      }
      const root = document.querySelector('.root')
      this.render.showDiv(root)
    })
  }

  _callSendAPI(message) {
    if (message) { this.api.send(message) }
  }

  _login(form) {
    if (form[0].value && form[1].value) {
      this.api.logIn(form, this.info)
      this.render.restyleForm(form)
    } else {
      this.render.restyleForm(form)
    }
  }
}