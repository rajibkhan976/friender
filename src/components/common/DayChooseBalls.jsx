import React from 'react';
import moment from 'moment';


const DayChooseBalls = ({ customStylesClass = '' }) => {
    const today = moment().format("dddd");
    const weekdaysArr = moment.weekdays();

    return (
        <div className='scheduler-popup-header-content'>
            {weekdaysArr?.map((day, index) => (
                <div
                    key={index}
                    className={`popup-header-content-item ${customStylesClass ? customStylesClass : ''} ${today.substring(0, 2) === day.substring(0, 2)
                        ? "today-circle"
                        : ""
                        }`}
                >
                    {day.substring(0, 2)}
                </div>
            ))}
        </div>
    );
};

export default DayChooseBalls;