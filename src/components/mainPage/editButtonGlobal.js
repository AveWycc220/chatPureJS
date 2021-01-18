import Basement from '../base'

export default class EditButtonGlobal extends Basement {
  init() {
    this.className = 'edit'
    this.mainBasement.classList.add(`${this.className}`)
    this.HTML = `<button class="${this.className}"></button>`
    this.isEditing= false
    this.idEditing = undefined
  }

  events() {
    document.addEventListener('click', e => {
      if (this._isEdit(e.target)) {
        const messageDiv = e.path[3]
        const messageText = messageDiv.querySelector('.message-text')
        if (!this.isEditing) {
          e.target.classList.add('active')
          messageText.setAttribute('contenteditable', 'true')
          this.idEditing = messageDiv.id
          this.isEditing = true
        } else if (messageDiv.id === this.idEditing) {
          e.target.classList.remove('active')
          this.apiWorker.edit(messageDiv.id, messageText.innerHTML)
          messageText.removeAttribute('contenteditable')
          this.isEditing = false
        }
      }
    })
  }

  render() {
    return ''
  }

  _isEdit(target) {
    return target.classList.contains('edit')
  }
}