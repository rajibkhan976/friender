import React from 'react';
import { WarningOutlineIcon } from '../../assets/icons/Icons';

const NotifyAlert = ({ type, title }) => {
    switch (type) {
        case "NOTIFY":
            return (
                <div className="notify-alert">
                    <span className='notify-icon'>
                        <WarningOutlineIcon size={15} color="white" />
                    </span>
                    <span className='notify-text'>{title}</span>
                </div>
            );

        case "DANGER":
            return (
                <div className="danger-alert">
                    <span className='notify-icon'>
                        <WarningOutlineIcon size={15} color="white" />
                    </span>
                    <span className='notify-text'>{title}</span>
                </div>
            );

        case "INFO":
            return (
                <div className="info-alert">
                    <span className='info-icon'>
                        <WarningOutlineIcon size={15} color="white" />
                    </span>
                    <span className='notify-text'>{title}</span>
                </div>
            );

        case "SUCCESS":
            return (
                <div className="success-alert">
                    <span className='notify-icon'>
                        <WarningOutlineIcon size={15} color="white" />
                    </span>
                    <span className='notify-text'>{title}</span>
                </div>
            );

        default:
            return null;
    }
};

export default NotifyAlert;