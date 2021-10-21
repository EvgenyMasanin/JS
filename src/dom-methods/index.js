export function createElement(elementName) {
  return document.createElement(elementName)
}

export function addClass(elem, classes) {
  if (Array.isArray(classes)) {
    elem.classList = classes.join(' ')
  } else {
    elem.classList.add(classes)
  }
}

export function removeClass(elem, className) {
  elem.classList.remove(className)
}

export function addAttribute(elem, attribute, value) {
  elem.setAttribute(attribute, value)
}
