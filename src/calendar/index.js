import {
  addAttribute,
  addClass,
  createElement,
  removeClass,
} from '@dom-methods'

import Select from '../select'
import '../tetsing-css/input.css'

import './calendar.css'

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

class Calendar {
  #now
  #body
  #input
  #options
  #calendar
  #container
  #selectYear
  #selectMonth
  #importantDates
  #calendarContainer
  constructor(containerSelector, options) {
    typeof containerSelector === 'string'
      ? (this.#container = document.querySelector(containerSelector))
      : (this.#container = containerSelector)

    this.#now = new Date()
    this.#options = options

    this.#importantDates = new Set()

    this.#render()
  }

  #render() {
    this.#calendarContainer = createElement('div')
    this.#calendar = createElement('div')
    this.#body = document.createElement('table')
    addClass(this.#calendar, 'calendar')
    addClass(this.#body, 'calendar__table')

    this.#calendar.addEventListener('click', this.#clickHandler)
    this.#addControls()
    this.#setup()
    this.#renderBody()
    this.#renderHeader()

    this.#calendar.append(this.#body)
    this.#container.append(this.#calendar)
  }

  #addControls() {
    const controls = createElement('div')
    addClass(controls, 'calendar-controls')
    this.#addSelects(controls)
    this.#addChangeButtons(controls)
    this.#calendar.append(controls)
  }

  #addChangeButtons(controls) {
    const chengeButtonsContainer = createElement('div')
    addClass(chengeButtonsContainer, 'calendar__change-buttons')

    const changeButton = document.createElement('div')
    const leftButton = document.createElement('div')
    const rightButton = document.createElement('div')

    addClass(changeButton, 'calendar__change-button')
    addClass(leftButton, 'calendar__change-button')
    addClass(rightButton, 'calendar__change-button')

    addAttribute(changeButton, 'data-type', 'mode')
    addAttribute(leftButton, 'data-type', 'left')
    addAttribute(rightButton, 'data-type', 'right')

    changeButton.addEventListener('clicl', this.#clickHandler)
    leftButton.addEventListener('clicl', this.#clickHandler)
    rightButton.addEventListener('clicl', this.#clickHandler)

    changeButton.innerHTML = '<i class="fas fa-cog"></i>'
    leftButton.innerHTML = '<i class="fas fa-chevron-up"></i>'
    rightButton.innerHTML = '<i class="fas fa-chevron-down"></i>'

    chengeButtonsContainer.append(changeButton)
    chengeButtonsContainer.append(leftButton)
    chengeButtonsContainer.append(rightButton)

    controls.append(chengeButtonsContainer)
  }

  #addSelects(controls) {
    const dateControls = createElement('div')
    addClass(dateControls, 'calendar__date-controls')
    const selectContainer = createElement('div')
    addClass(selectContainer, 'calendar__date-picker')
    const yearPicker = createElement('div')
    const inputContainer = createElement('div')
    addClass(yearPicker, 'calendar__year-picker')
    addClass(inputContainer, 'input-container')

    yearPicker.append(inputContainer)

    const months = [
      { id: 0, value: 'Январь' },
      { id: 1, value: 'Февраль' },
      { id: 2, value: 'Март' },
      { id: 3, value: 'Апрель' },
      { id: 4, value: 'Май' },
      { id: 5, value: 'Июнь' },
      { id: 6, value: 'Июль' },
      { id: 7, value: 'Август' },
      { id: 8, value: 'Сентябрь' },
      { id: 9, value: 'Октябрь' },
      { id: 10, value: 'Ноябрь' },
      { id: 11, value: 'Декабрь' },
    ]

    this.#selectMonth = new Select(selectContainer, {
      data: months,
      maxHeight: 150,
      selectedID: this.#now.getMonth(),
      border: true,
    })

    this.#input = createElement('input')
    addAttribute(this.#input, 'type', 'number')
    addClass(this.#input, 'input')
    this.#input.value = this.#now.getFullYear()
    inputContainer.append(this.#input)

    dateControls.append(selectContainer)
    dateControls.append(yearPicker)

    controls.append(dateControls)

    this.#selectMonth.onChange((val) => {
      if (val.id !== this.#now.getMonth()) {
        this.#now.setMonth(val.id)
        this.#rerender()
      }
    })

    this.#input.addEventListener('blur', this.#onInputBlur)
  }

  #onInputBlur = ({ target }) => {
    console.log(target.value)
    if (target.value !== this.#now.getFullYear()) {
      this.#now.setFullYear(target.value)
      this.#rerender()
    }
  }

  destroy() {
    this.#selectMonth.destroy()
    this.#input.removeEventListener('blur', this.#onInputBlur)
    this.#calendar.removeEventListener('click', this.#clickHandler)
    this.#container.innerHTML = ''
  }

  #setup() {
    for (let i = 0; i < 7; i++) {
      const tr = createElement('tr')
      for (let j = 0; j < 7; j++) {
        const cell = createElement(i ? 'td' : 'th')
        addClass(cell, i ? 'calendar__td' : 'calendar__th')
        addAttribute(cell, 'data-type', 'date')
        tr.append(cell)
      }
      this.#body.append(tr)
    }
  }

  #renderHeader() {
    ;[...this.#body.firstChild.children].forEach((td, ind) => {
      if (this.#options.startFromMonday) {
        td.textContent = days[ind]
      } else {
        td.textContent = ind ? days[ind - 1] : days[6]
      }
      removeClass(td, 'calendar__weekend')
      if (td.textContent === days[5] || td.textContent === days[6]) {
        addClass(td, 'calendar__weekend')
      }
    })
  }

  #renderBody() {
    let dayNumber = this.#getInitDayNum()

    ;[...this.#body.children].forEach((tr, i) => {
      if (!i) return
      ;[...tr.children].forEach((td) => {
        const currentDate = new Date(
          this.#now.getFullYear(),
          this.#now.getMonth(),
          dayNumber
        )
        const holiday = currentDate.toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        addAttribute(td, 'data-date', holiday)

        td.textContent = currentDate.getDate(dayNumber)

        this.#checkDate(td, currentDate)

        dayNumber++
      })
    })
  }

  #rerender() {
    this.#renderHeader()
    this.#renderBody()

    this.#selectMonth.select(this.#now.getMonth())
    this.#input.value = this.#now.getFullYear()
  }

  #checkDate(td, currendDate) {
    const dateStrConfig = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    const curretdDateStr = currendDate.toLocaleString('ru', dateStrConfig)
    const rightNowStr = new Date().toLocaleDateString('ru', {
      ...dateStrConfig,
    })

    const holiday = currendDate.toLocaleString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    removeClass(td, 'calendar__not-actual')
    removeClass(td, 'calendar__weekend')
    removeClass(td, 'calendar__today')
    td.style.borderColor = 'var(--primary-color)'

    if (currendDate.getMonth() !== this.#now.getMonth()) {
      addClass(td, 'calendar__not-actual')
    }

    if (this.#importantDates.has(curretdDateStr)) {
      addClass(td, 'calendar__weekend')
    }

    if (curretdDateStr === rightNowStr) {
      addClass(td, 'calendar__today')
    }

    if (
      new Date(holiday).toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
      }) in this.#options.holidays
    ) {
      td.style.borderColor =
        this.#options.holidays[
          new Date(holiday).toLocaleString('ru', {
            day: 'numeric',
            month: 'long',
          })
        ]
    }
  }

  #clickHandler = ({ target }) => {
    const { type, date } = target.dataset
    switch (type) {
      case 'date':
        if (target.classList.contains('calendar__weekend')) {
          removeClass(target, 'calendar__weekend')
          this.#importantDates.delete(date)
        } else {
          addClass(target, 'calendar__weekend')
          this.#importantDates.add(date)
        }
        break
      case 'mode':
        console.log('mode')
        this.#options.startFromMonday = !this.#options.startFromMonday
        this.#rerender()
        break
      case 'left':
        console.log('left')
        this.#changeMonth(-1)
        break
      case 'right':
        console.log('right')
        this.#changeMonth(1)
        break

      default:
        break
    }
  }

  #changeMonth(direction) {
    this.#now.setMonth(this.#now.getMonth() + direction)

    this.#rerender()
  }

  #getInitDayNum() {
    const firstDay = new Date(this.#now.getFullYear(), this.#now.getMonth(), 1)
    const dayOfWeek = firstDay.getDay()
    const weekDayCount = 7
    return dayOfWeek === 0
      ? -(weekDayCount - (this.#options.startFromMonday ? 2 : 1))
      : -(dayOfWeek - (this.#options.startFromMonday ? 2 : 1))
  }
}

export default Calendar
