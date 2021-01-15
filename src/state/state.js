export default class State {
  constructor(renderWorker) {
    this.storage = new Proxy({}, {
      set(target, p, value) {
        const isExist = !!target[p]
        target[p] = value
        if (!renderWorker.nodeMessages) {
          renderWorker.renderMessage(value, '#message-list')
        } else {
          if (isExist) {
            renderWorker.rerenderMessage(value)
          } else {
            renderWorker.renderMessage(value)
          }
        }
        return true
      },
      deleteProperty(target, p) {
        renderWorker.deleteMessage(target[p])
        delete target[p]
        return true
      }
    })
  }
}