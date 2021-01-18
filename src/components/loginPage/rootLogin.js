import Root from '../root'

export default class RootLogin extends Root {
  init() {

  }

  events() {

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