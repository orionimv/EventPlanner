export function buildICS(event) {
    const dt = (d) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
    const uid = `${Date.now()}@event-planner`
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Event Planner//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dt(new Date())}`,
        `DTSTART:${dt(event.start)}`,
        `DTEND:${dt(event.end || event.start)}`,
        `SUMMARY:${escapeText(event.title)}`,
        `DESCRIPTION:${escapeText(event.description || '')}`,
        `LOCATION:${escapeText(event.location || '')}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n')
    return ics
}

function escapeText(t) {
    return String(t).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function downloadICS(event) {
    const blob = new Blob([buildICS(event)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(event.title || 'event').replace(/\W+/g,'_')}.ics`
    a.click()
    URL.revokeObjectURL(url)
}

export function googleCalendarUrl(event) {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title || '',
        dates: toGoogleDate(event.start, event.end || event.start),
        details: event.description || '',
        location: event.location || ''
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function toGoogleDate(start, end) {
    const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
    return `${fmt(start)}/${fmt(end)}`
}
