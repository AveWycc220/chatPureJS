import Basement from '../base'

export default class UserInput extends Basement {
  init() {
    this.mainBasement.type = 'text'
    this.mainBasement.classList.add('key')
    this.mainBasement.id = 'user-input'
    this.mainBasement.name = 'username'
    this.mainBasement.placeholder = 'UserName'
    this.mainBasement.setAttribute('maxlength', '100')
    this.mainBasement.style.display = 'none'
    this.state.length = 0
  }

  events() {
    document.addEventListener('input', e => {
      this.state.length = this.mainBasement.value.length
    })
  }

  render() {
    if (this.state.length === 0) { this.mainBasement.style.border = '2px solid red' }
    else { this.mainBasement.style = null }
  }
}