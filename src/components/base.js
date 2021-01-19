export default class Basement {
  state = {}

  constructor({apiWorker = undefined, node = undefined, typeOfElement = undefined, insert=undefined,
                insertElement=undefined, cookieWorker = undefined, childComponents = undefined,
                prependElements=undefined}) {
    this.cookieWorker = cookieWorker
    this.apiWorker = apiWorker
    this.mainBasement = document.createElement(`${typeOfElement}`)
    this.node = document.querySelector(`${node}`)
    this.childComponents = childComponents
    this.prependELements = prependElements

    this.init()

    const propThis = this
    this.state = new Proxy(this.state, {
      set(target, property, value) {
        target[property] = value
        propThis.push()
        return true
      },
    })

    this.push()
    this.events()
    if (insert && node) {
      if (insert === 'beforebegin' || insert === 'afterbegin' || insert === 'beforeend' || insert === 'afterend') {
        const elem = document.querySelector(`${insertElement}`)
        elem.insertAdjacentElement(`${insert}`, this.mainBasement)
      } else {
        console.error('Wrong Insert Type')
      }
    } else if (this.node instanceof HTMLElement) {
        this.node.append(this.mainBasement)
    }
  }

  init() {

  }

  push() {
    const elem = this.render()
    if (typeof elem === "string") {
      this.mainBasement.innerHTML = elem
    }
    if (elem instanceof Element) {
      if (this.prependELements) {
        this.mainBasement.prepend(elem)
      } else {
        this.mainBasement.append(elem)
      }
    }
  }

  delete() {

  }

  events() {

  }

  render() {
    return 'Component'
  }
}