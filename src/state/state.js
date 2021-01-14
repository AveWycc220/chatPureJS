export default class State {
  storage = []
  node = document.createElement('#message-list');

  constructor(renderWorker) {
    this.render = renderWorker
    this.storage = new Proxy(this.storage, {
      set(target, property, value) {
        target[property] = value;
        this.push();
        return true;
      }
    })
    this.push();
    this.node.append()
  }

  init() {

  }

  push() {
    let elem = this.render()
    if (typeof elem === "string") {
      this.mainBasement.innerHTML = elem;
    }
    if (elem instanceof Element) {
      this.mainBasement.append(elem);
    }
  }

  events() {

  }

  render() {
    return 'Компонент создан';
  }
}