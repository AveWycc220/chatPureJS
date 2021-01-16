export default class EventsHandler{
  constructor({renderWorker = undefined, routerWorker = undefined, apiWorker = undefined,
                buttonSend = undefined, messageInput = undefined, logoutButton = undefined}) {
    this.render = renderWorker
    this.router = routerWorker
    this.api = apiWorker
    this.sendEvent(messageInput, buttonSend)
    this.loadingEvent()
    this.logoutEvent(logoutButton)
    this.controlMessageEvent()
  }

  getWrongDataEvent() {
    return new Event('wrongData')
  }

  getUserAlreadyExistEvent() {
    return new Event('userExist')
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

  logoutEvent(logoutButton) {
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        this.api.logout()
      })
    }
  }

  controlMessageEvent() {
    if (!this.router.isLoginPage()) {
      let isEditing = false
      document.addEventListener('click', e => {
        if (this._isEdit(e.target)) {
          isEditing = this._editMessage(e, isEditing)
        } else if (this._isDelete(e.target)) {
          this.api.delete(e.path[3].id)
        }
      })
    }
  }

  _editMessage(e, isEditing) {
    const message = e.path[3].querySelector('.message-text')
    if (!isEditing) {
      e.target.classList.add('active')
      message.setAttribute('contenteditable', 'true')
      return true
    } else {
      e.target.classList.remove('active')
      this.api.edit(e.path[3].id, message.innerHTML)
      message.removeAttribute('contenteditable')
      return false
    }
  }

  _isDelete(target) {
    return target.classList.contains('delete')
  }

  _isEdit(target) {
    return target.classList.contains('edit')
  }

  _callSendAPI(message) {
    if (message) { this.api.send(message) }
  }
}