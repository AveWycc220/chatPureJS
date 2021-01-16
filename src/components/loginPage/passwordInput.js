import Basement from '../base'

export default class PasswordInput extends Basement {
  init() {
    this.mainBasement.type = 'password'
    this.mainBasement.classList.add('key')
    this.mainBasement.id = 'password-input'
    this.mainBasement.name = 'password'
    this.mainBasement.placeholder = 'Password'
    this.mainBasement.setAttribute('maxlength', '50')
    this.stat.length = 0
  }

  events() {
    document.addEventListener('input', e => {
      this.stat.length = this.mainBasement.value.length
    })
  }

  render() {
    if (this.stat.length === 0) { this.mainBasement.style.border = '2px solid red' }
    else { this.mainBasement.style = null }
  }
}