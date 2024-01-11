import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/_campaign-scheduler.scss";

const localizer = momentLocalizer(moment);

const WeekViewHeader = ({ date }) => {
	const dayName = moment(date).format("ddd");
	return <>{dayName}</>;
};

const CampaignScheduler = (props) => {
	const { handleSetPopupPos, handleSetShowPopup } = props;
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [events, setEvents] = useState([
		{
			id: 1,
			title: "Meeting",
			start: new Date(2023, 10, 16, 10, 0),
			end: new Date(2023, 10, 16, 12, 0),
		},
	]);

	const components = {
		week: {
			header: WeekViewHeader,
			toolbar: () => null, // Override the toolbar to render nothing
		},
	};

	const handleSelectEvent = (event, e) => {
		console.log("selected envet", event);
		setSelectedEvent(event);
	};

	const handleSelectSlot = (slotInfo) => {
		console.log("handle slot", slotInfo);
		const { start, end } = slotInfo;
		// Update the selected event with the new start and end times
		// if (selectedEvent) {
		const updatedEvents = events.map((event) =>
			event.id === 1 ? { ...event, start, end } : event
		);
		slotInfo?.box
			? handleSetPopupPos({ X: slotInfo?.box?.x, Y: slotInfo?.box?.y })
			: handleSetPopupPos({
					X: slotInfo?.bounds?.left,
					Y: slotInfo?.bounds?.top,
			  });
		handleSetShowPopup(true);
		// Update the events array with the new start and end times
		// This is where you would typically make an API call to update the server
		setEvents(updatedEvents);
		console.log("Updated Events:", updatedEvents);
		setSelectedEvent(null);
		// }
	};

	const formats = {
		timeGutterFormat: (date, culture, localizer) =>
			localizer
				.format(date, "h:mm A", culture)
				.concat(
					" - ",
					localizer.format(moment(date).add(2, "h"), "h:mm A", culture)
				), // Format for time slots in the gutter
		dayFormat: (date, culture, localizer) =>
			localizer.format(date, "dddd", culture), // Format for the day header
	};

	return (
		<Calendar
			localizer={localizer}
			events={events}
			defaultView='week'
			views={["week"]}
			step={120} // The step in minutes for the time slots
			timeslots={1} // Display 24 time slots for each day
			defaultDate={new Date()}
			min={new Date(0, 0, 0, 0, 0)} // Start time for the day (12:00 AM)
			max={new Date(0, 0, 0, 23, 59)} // End time for the day (11:59 PM)
			components={components}
			formats={formats}
			onSelectEvent={handleSelectEvent}
			onSelectSlot={handleSelectSlot}
			selectable
		/>
	);
};

export default CampaignScheduler;
