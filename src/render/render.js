class DOMRender {
  showInput(input) {
    input.style.display = 'block'
    input.style.border = '2px solid red'
  }

  showDiv(div) {
    div.style.display = 'block'
  }

  restyleForm(form, signin=false) {
    if (!form[0].value) {
      form[0].style.border = '2px solid red'
    } else {
      form[0].style.border = '2px solid black'
    }
    if (!form[1].value) {
      form[1].style.border = '2px solid red'
    } else {
      form[1].style.border = '2px solid black'
    }
    if (signin) {
      if (!form[2].value) {
        form[2].style.border = '2px solid red'
      } else {
        form[2].style.border = '2px solid black'
      }
    }
  }
}

export default DOMRender