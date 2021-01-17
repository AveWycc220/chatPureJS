export default class Basement {
  stat = {}

  constructor({renderWorker = undefined, apiWorker = undefined, node = undefined,
                typeOfElement = undefined, insert=undefined, insertElement=undefined,
                  cookieWorker = undefined}) {
    this.renderWorker = renderWorker
    this.cookieWorker = cookieWorker
    this.apiWorker = apiWorker
    this.mainBasement = document.createElement(`${typeOfElement}`)
    this.node = document.querySelector(`${node}`)

    this.init()

    const propThis = this
    this.stat = new Proxy(this.stat, {
      set(target, property, value) {
        target[property] = value
        propThis.push()
        return true
      }
    })

    this.push()
    this.events()
    if (insert) {
      const elem = document.querySelector(`${insertElement}`)
      elem.insertAdjacentElement(`${insert}`, this.mainBasement)
    } else {
      this.node.append(this.mainBasement)
    }
  }

  init() {

  }

  push() {
    let elem = this.render()
    if (typeof elem === "string") {
      this.mainBasement.innerHTML = elem
    }
    if (elem instanceof Element) {
      this.mainBasement.append(elem)
    }
  }

  events() {

  }

  render() {
    return 'Компонент создан'
  }
}