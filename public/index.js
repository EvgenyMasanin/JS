import Calendar from '../src/calendar'

import './styles'

const holidays = {
  '9 мая': 'orange',
  '1 мая': 'red',
  '8 марта': '#ff869a',
  '23 февраля': 'orange',
  '25 июля': 'blue',
  '1 сентября': 'yellow',
}

const config = {
  startFromMonday: true,
  holidays,
}

window.calendar = new Calendar('.container', config)
