import React, { useState } from 'react';
import moment from 'moment';

const DayChooseBalls = ({ customStylesClass = '' }) => {
    const today = moment().format("dddd");
    const weekdaysArr = moment.weekdays();
    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDay = (day) => {
        const newSelectedDays = [...selectedDays];
        const index = newSelectedDays.indexOf(day);
        if (index === -1) {
            // Day is not selected, add it to the selection
            newSelectedDays.push(day);
        } else {
            // Day is selected, remove it from the selection
            newSelectedDays.splice(index, 1);
        }
        setSelectedDays(newSelectedDays);
    };

    console.log("SELECTED DAYS - ", selectedDays);

    return (
        <div className='scheduler-popup-header-content'>
            {weekdaysArr?.map((day, index) => (
                <div
                    key={index}
                    className={`popup-header-content-item ${customStylesClass ? customStylesClass : ''} ${today.substring(0, 2) === day.substring(0, 2) ? "today-circle" : ""
                        } ${selectedDays.includes(day) ? "selected" : ""}`}
                    onClick={() => toggleDay(day)}
                >
                    {day.substring(0, 2)}
                </div>
            ))}
        </div>
    );
};

export default DayChooseBalls;
