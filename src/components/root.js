import Basement from './base'

export default class Root extends Basement {
  init() {
    this.mainBasement.classList.add('root')
    this.mainBasement.style.display = 'none'
  }

  events() {
    document.addEventListener('DOMContentLoaded', () => {
      this.mainBasement.style.display = 'block'
    })
  }

  render() {
    return ''
  }
}