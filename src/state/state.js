export default class State {
  constructor(renderWorker) {
    this.storage = new Proxy([], {
      set(target, p, value) {
        target[p] = value
        if (!renderWorker.nodeMessages) {
          renderWorker.renderMessage(value, '#message-list')
        } else {
          renderWorker.renderMessage(value)
        }
        return true
      }
    })
  }
}