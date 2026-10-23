export function secondesAvantMinuit() {
  const p = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hourCycle: 'h23',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date())

  const v = (type) => Number(p.find((x) => x.type === type).value)
  const ecoule = v('hour') * 3600 + v('minute') * 60 + v('second')

  return (86400 - ecoule) % 86400
}