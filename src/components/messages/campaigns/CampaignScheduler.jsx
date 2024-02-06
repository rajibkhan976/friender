import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
} from "../../../actions/CampaignsActions";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";
import GlobalCampaignList from "./GlobalCampaignList";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/_campaign-scheduler.scss";

moment.locale("en-us", {
	week: {
		dow: 1,
		doy: 1,
	},
});
const localizer = momentLocalizer(moment);

const CustomWeekViewHeader = ({ date }) => {
	const dayName = moment(date).format("ddd");
	return <>{dayName}</>;
};

const CampaignScheduler = (props) => {
	const {
		campaignsList = [],
		selectedSchedule = null,
		handleSetPopupPos = () => null,
		handleSetSelectedSchedule = () => null,
		handleSetShowPopup = () => null,
		handleSetShowModal = () => null,
		setCalenderModalType = () => null,
		setScheduleTime = () => null,
		setShowGlobalCampaignPopup = () => null,
		showGlobalCampaignPopup = false,
	} = props;
	const dispatch = useDispatch();
	const location = useLocation();
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });

	console.log("Campaigns List -- ", campaignsList);

	const CustomEventContainerWrapper = (props) => {
		const handleClick = (e) => {
			if (location?.pathname === "/messages/campaigns") {
				setPopupCoordPos({
					x: e.clientX,
					y: e.clientY,
				});
				setShowGlobalCampaignPopup(true);
			}
		};
		return <div onClick={handleClick}>{props.children}</div>;
	};

	const CustomEventWrapper = (props) => {
		// console.log(props);
		return <>{props.children}</>;
	};

	const CustomEvent = (props) => {
		return (
			<>
				{props.title && location?.pathname === "/messages/campaigns" ? (
					<>
						{Array.isArray(props.title) ? props.title.length : 1}{" "}
						{`campaign${
							Array.isArray(props.title) && props.title.length > 1 ? "s" : ""
						}`}
					</>
				) : null}
			</>
		);
	};

	const components = useMemo(
		() => ({
			eventContainerWrapper: CustomEventContainerWrapper,
			eventWrapper: CustomEventWrapper,
			week: {
				header: CustomWeekViewHeader,
				toolbar: () => null, // Override the toolbar to render nothing,
				event: CustomEvent,
			},
		}),
		[]
	);

	const eventPropGetter = useCallback((event, start, end, isSelected) => {
		// console.log(utils.hex2rgb(event.color));
		return {
			...((event?.title || event?.isSaved) && {
				className: "campaign-saved",
				// style: {
				// 	backgroundColor: `${utils.hex2rgb(event.color)}`,
				// 	borderLeft: `4px solid ${event.color}`,
				// 	fontSize: "12px",
				// 	fontWeight: "500",
				// 	lineHeight: "17px",
				// 	color: "rgba(240, 239, 255, 1)",
				// },
			}),
		};
	}, []);

	const handleSelectEvent = (event) => {
		// console.log("selected envet", event);
		setShowGlobalCampaignPopup(false);
		setCalenderModalType && setCalenderModalType("VIEW_DETAILS");
		dispatch(
			updateCampaignSchedule([
				...campaignSchedule.filter((item) => item.isSaved),
			])
		);
		setScheduleTime({
			date: [new Date(event?.start)],
			start: moment(event?.start).format("h:mm A"),
			end: moment(event?.end).format("h:mm A"),
		});
		handleSetSelectedSchedule(event);
		// dispatch(
		// 	updateSelectedCampaignSchedule(
		// 		campaignsList.find((item) => item?.campaign_id === event?.id)
		// 	)
		// );
		// dispatch(updateSelectedCampaignSchedule(event));
		handleSetPopupPos && handleSetPopupPos({ X: 0, Y: 0 });
		handleSetShowPopup(true);
	};

	const handleSelectSlot = (slotInfo) => {
		// console.log("handle slot", slotInfo);
		const { start, end } = slotInfo;
		const selectedSchedule = {};

		setShowGlobalCampaignPopup(false);
		setCalenderModalType && setCalenderModalType("CREATE_CAMPAIGN");
		dispatch(updateSelectedCampaignSchedule(null));
		handleSetSelectedSchedule(null);

		Object.assign(selectedSchedule, {
			isSaved: false,
			start: start,
			end: end,
		});
		setScheduleTime({
			date: [new Date(start)],
			start: moment(start).format("h:mm A"),
			end: moment(end).format("h:mm A"),
		});
		slotInfo?.box
			? handleSetPopupPos &&
			  handleSetPopupPos({ X: slotInfo?.box?.x, Y: slotInfo?.box?.y })
			: handleSetPopupPos &&
			  handleSetPopupPos({
					X: slotInfo?.bounds?.left,
					Y: slotInfo?.bounds?.top,
			  });
		// console.log(selectedSchedules)
		const updatedCampaignSchedule = [
			...campaignSchedule.filter((item) => item.isSaved),
			selectedSchedule,
		];
		dispatch(updateCampaignSchedule(updatedCampaignSchedule));
		handleSetShowPopup(true);
		handleSetShowModal(true);
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

	console.log("CAMPAIGN SCHEDULE -- ", campaignSchedule);

	return (
		<>
			{showGlobalCampaignPopup && (
				<CampaignSchedulerPopup>
					<GlobalCampaignList
						handleSetShowGlobalCampaignPopup={(status) =>
							setShowGlobalCampaignPopup(status)
						}
						listItems={selectedSchedule}
						popupCoordPos={popupCoordPos}
					/>
				</CampaignSchedulerPopup>
			)}
			<Calendar
				localizer={localizer}
				events={campaignSchedule}
				eventPropGetter={eventPropGetter}
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
				tooltipAccessor={null}
			/>
		</>
	);
};

export default CampaignScheduler;
