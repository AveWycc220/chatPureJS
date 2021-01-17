import Basement from '../base'

export default class RootLogin extends Basement {
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
    return `
    <div class="log-in">
      <div class="form">
          <div class="keys-input">
              <div>
                  <form id="keys">
                  </form>
              </div>
          </div>
          <div class="button-div">
          </div>
      </div>
    </div>
    `
  }
}