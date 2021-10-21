import {
  addAttribute,
  addClass,
  createElement,
  removeClass,
} from '../dom-methods'
import './styles'

class Select {
  #body
  #value
  #items
  #target
  #select
  #options
  #openBtn
  #container
  #listeners
  #bodyContainer

  constructor(containerSelector, options) {
    typeof containerSelector === 'string'
      ? (this.#container = document.querySelector(containerSelector))
      : (this.#container = containerSelector)

    this.#options = options

    if (!options.data) options.data = []

    this.#listeners = []

    this.#render()
  }

  #render() {
    this.#select = createElement('div')
    this.#value = createElement('div')
    this.#target = createElement('div')
    this.#openBtn = createElement('div')

    addClass(this.#value, 'select__value')
    addClass(this.#target, 'select__target')
    addClass(this.#select, 'select')
    addClass(this.#openBtn, 'select__open-btn')

    addAttribute(this.#target, 'data-type', 'target')

    this.#value.textContent = this.#options.placeholder
    this.#openBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'

    this.#createItems()

    this.#createDropDown()

    this.#select.addEventListener('click', this.#handlClick)

    this.#select.append(this.#value)
    this.#select.append(this.#target)
    this.#select.append(this.#openBtn)

    this.#container.append(this.#select)

    if (this.#options.selectedID !== undefined)
      setTimeout(() => this.select(this.#options.selectedID), 0)
  }

  #createItems() {
    this.#items = this.#options.data.map((elem) => {
      const item = createElement('li')

      addClass(item, 'select__item')
      addAttribute(item, 'data-id', elem.id)
      addAttribute(item, 'data-type', 'item')

      item.textContent = elem.value
      return item
    })
  }

  #createDropDown() {
    this.#bodyContainer = document.createElement('div')

    this.#body = document.createElement('ul')

    this.#bodyContainer.append(this.#body)

    if (this.#options.maxHeight) {
      this.#body.style.maxHeight = this.#options.maxHeight + 'px'
    }
    if (this.#options.border) {
      addClass(this.#body, 'select__border')
    }

    addClass(this.#bodyContainer, [
      'select__body-container',
      'select__body-container-hide',
    ])
    addClass(this.#body, 'select__body')

    this.#items.forEach((item) => {
      this.#body.append(item)
    })

    this.#select.append(this.#bodyContainer)
  }

  #handlClick = (e) => {
    switch (e.target.dataset.type) {
      case 'target':
        this.#toggle()
        break
      case 'item':
        this.select(e.target.dataset.id)
        this.#toggle()
        break
      default:
        break
    }
  }

  #toggle() {
    this.#select.classList.contains('select__active')
      ? this.closeList()
      : this.openList()
  }

  #handleBackdrop = (e) => {
    if (!['item', 'target'].includes(e.target.dataset.type)) {
      this.closeList()
    }
  }

  #scrolToSelected(item) {
    this.#body.scrollTo(
      0,
      item.offsetTop - this.#body.offsetHeight / 2 + item.offsetHeight / 2
    )
  }

  openList = () => {
    this.#select.classList.add('select__active')
    this.#bodyContainer.classList.remove('select__body-container-hide')

    document.addEventListener('click', this.#handleBackdrop)
  }

  closeList = () => {
    this.#select.classList.remove('select__active')
    this.#bodyContainer.classList.add('select__body-container-hide')

    document.removeEventListener('click', this.#handleBackdrop)
  }

  select = (id = 0) => {
    if (this.#options.data.length) {
      const item = this.#select.querySelector(`[data-id="${id}"]`)

      this.#scrolToSelected(item)

      const prevItem = this.#select.querySelector(
        `[data-id="${this.#options.selectedID}"]`
      )

      if (prevItem) removeClass(prevItem, 'select__selected')
      addClass(item, 'select__selected')

      this.#options.selectedID = id
      this.#value.textContent = this.selected.value
      this.#listeners.forEach((fn) => {
        fn(this.selected)
      })
    }
  }

  onChange(callback) {
    this.#listeners.push(callback)
  }

  destroy() {
    this.#select.removeEventListener('click', this.#handlClick)
    this.#container.innerHTML = ''
  }

  get isOpen() {
    return this.#select.classList.contains('select__active')
  }

  get selected() {
    return this.#options.data.find((_, i) => i === +this.#options.selectedID)
  }
}

export default Select
