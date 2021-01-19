import Basement from '../base'

export default class EmailInput extends Basement {
  init() {
    this.mainBasement.type = 'text'
    this.mainBasement.classList.add('key')
    this.mainBasement.id = 'email-input'
    this.mainBasement.name = 'email'
    this.mainBasement.placeholder = 'Email'
    this.mainBasement.setAttribute('maxlength', '50')
    this.mainBasement.autocomplete = 'on'
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