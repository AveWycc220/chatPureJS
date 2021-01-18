import Basement from '../base'

export default class MessageInput extends Basement {
  init(){
    this.mainBasement.classList.add('message')
    this.mainBasement.classList.add('textarea')
    this.mainBasement.setAttribute('contenteditable', 'true')
  }

  events(){

  }

  render(){
    return ''
  }
}