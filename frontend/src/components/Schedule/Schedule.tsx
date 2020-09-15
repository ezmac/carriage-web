import React, { FunctionComponent } from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import '../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Schedule : FunctionComponent = () => {
    const now = new Date();
    const nearestHour = new Date();
    nearestHour.setMinutes(0);

    const events = [{
        title: 'Right now',
        start: now,
        end: now
    }];

    return <div>
        <Calendar 
            localizer={localizer}
            events={events}
            toolbar={false}
            defaultView='day'
            startAccessor='start'
            endAccessor='end'
            min={nearestHour}
            drilldownView='agenda'
        />
    </div>
};

export default Schedule;