import React, { useState } from 'react'
import FullCalendar, {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'

interface DemoAppState {
  weekendsVisible: boolean
  currentEvents: EventApi[]
}

export default function DemoApp() {
  const [state, setState] = useState<DemoAppState>({
    weekendsVisible: true,
    currentEvents: [],
  })

  const handleWeekendsToggle = () => {
    setState({
      ...state,
      weekendsVisible: !state.weekendsVisible,
    })
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
    }
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  const handleEvents = (events: EventApi[]) => {
    setState({
      ...state,
      currentEvents: events,
    })
  }
  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
        <FullCalendar
          locale='es'
          firstDay={1}
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: '',
            center: '',
            right: 'prev title next',
          }}
          titleFormat={{ year: undefined, month: 'long' }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={state.weekendsVisible}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          eventDisplay='list-item'
        />
      </div>
    </div>
  )
}

function renderEventContent(eventInfo: EventContentArg) {
  console.log(eventInfo)
  return <span className='text-primary'>02 citas disponibles</span>
}
