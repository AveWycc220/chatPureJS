import Basement from '../base'

export default class DeleteButtonGlobal extends Basement {
  init() {
    this.className = 'delete'
    this.mainBasement.classList.add(`${this.className}`)
    this.HTML = `<button class="${this.className}"></button>`
  }

  events() {
    document.addEventListener('click', e => {
      if (this._isDelete(e.target)) {
        this.apiWorker.delete(e.path[3].id)
      }
    })
  }

  render() {
    return ''
  }

  _isDelete(target) {
    return target.classList.contains('delete')
  }
}