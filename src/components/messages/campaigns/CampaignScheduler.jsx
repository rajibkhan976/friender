import { useEffect, useMemo, useRef, useState } from "react";
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
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const [showMoreEvent, setShowMoreEvent] = useState([]);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const showMoreBtnRef = useRef(null);

	// const CustomEventContainerWrapper = (props) => {
	// 	const handleClick = (e) => {
	// 		if (location?.pathname === "/messages/campaigns") {
	// 			setPopupCoordPos({
	// 				x: e.clientX,
	// 				y: e.clientY,
	// 			});
	// 			setShowGlobalCampaignPopup(true);
	// 		}
	// 	};
	// 	return <div onClick={handleClick}>{props.children}</div>;
	// };

	const CustomEventWrapper = (props) => {
		// console.log(props);
		const dispatch = useDispatch();
		const location = useLocation();
		const campaignSchedule = useSelector(
			(state) => state.campaign.campaignSchedule
		);

		const handleClick = (e, showMoreEventsArr) => {
			e.stopPropagation();
			handleSetSelectedSchedule(props?.event);
			if (
				// location?.pathname === "/messages/campaigns" &&
				location?.pathname === "/campaigns" &&
				props?.event?.isSaved
			) {
				setCalenderModalType && setCalenderModalType("");
				setCalenderModalType && handleSetShowModal(false);
				setShowMoreEvent(showMoreEventsArr);
				setPopupCoordPos({
					x:
						e.clientX + 289 > window?.innerWidth
							? window?.innerWidth - (289 + 30)
							: e.clientX,
					y:
						e.clientY + 277 > window?.innerHeight
							? window?.innerHeight - (277 + 81 + 12 + 55)
							: e.clientY,
				});
				setShowGlobalCampaignPopup(true);
			}
		};

		return (
			<>
				{props?.event?.isSaved &&
				props?.event?.title &&
				!props?.event?.isEditMode ? (
					<div
						className='custom-global-campaign-wrapper'
						style={{
							width: `${props?.style?.width}%`,
							height: `${props?.style?.height}%`,
							top: `${props?.style?.top}%`,
							left: `${props?.style?.xOffset}%`,
							position: "absolute",
							zIndex: "1002",
						}}
					>
						{props?.event &&
							Array.isArray(props?.event?.title) &&
							props?.event?.title
								// .slice(
								// 	props?.event?.title.length - 1,
								// 	props?.event?.title.length
								// )
								.map((item) => item)}
						{/* {props?.event &&
							Array.isArray(props?.event?.title) &&
							props?.event?.title.length > 1 && (
								<div
									ref={showMoreBtnRef}
									className='show-more-btn'
									onClick={(e) => {
										e.stopPropagation();
										dispatch(
											updateCampaignSchedule([
												...campaignSchedule.filter((item) => item.isSaved),
											])
										);
										handleClick(
											e,
											props?.event?.title.slice(
												0,
												props?.event?.title.length - 1
											)
										);
									}}
									onMouseDown={(e) => e.stopPropagation()}
								>
									{"+ " +
										props?.event?.title.slice(0, props?.event?.title.length - 1)
											.length}
								</div>
							)} */}
					</div>
				) : props?.event?.isSaved && props?.event?.isEditMode ? (
					<div
						className='rbc-event campaign-saved'
						style={{
							width: `${props?.style?.width}%`,
							height: `${props?.style?.height}%`,
							top: `${props?.style?.top}%`,
							left: `${props?.style?.xOffset}%`,
							position: "absolute",
							zIndex: "1002",
						}}
						onMouseDown={(e) => {
							e.stopPropagation();
							handleSetShowModal(false);
							setShowGlobalCampaignPopup(false);
							setScheduleTime({
								date: [new Date(props?.event?.start)],
								start: moment(props?.event?.start).format("h:mm A"),
								end: moment(props?.event?.end).format("h:mm A"),
							});
							handleSetSelectedSchedule(props?.event);
							dispatch(
								updateCampaignSchedule([
									...campaignSchedule.filter((item) => item.isSaved),
								])
							);
							handleSetPopupPos &&
								handleSetPopupPos({
									X:
										e.clientX + 268 > window?.innerWidth
											? window?.innerWidth - (268 + 30)
											: e.clientX,
									Y:
										e.clientY + 198 > window?.innerHeight
											? window?.innerHeight - (198 + 81 + 12 + 55)
											: e.clientY,
								});
							handleSetShowPopup(true);
						}}
					>{`${moment(props?.event?.start).format("h:mm A")} - ${moment(
						props?.event?.end
					).format("h:mm A")}`}</div>
				) : (
					<div
						className='rbc-event'
						style={{
							width: `${props?.style?.width}%`,
							height: `${props?.style?.height}%`,
							top: `${props?.style?.top}%`,
							left: `${props?.style?.xOffset}%`,
							position: "absolute",
							zIndex: "1002",
						}}
						onClick={() => {}}
						onMouseDown={(e) => e.stopPropagation()}
					>{`${moment(props?.event?.start).format("h:mm A")} - ${moment(
						props?.event?.end
					).format("h:mm A")}`}</div>
				)}
			</>
		);
	};

	// const CustomEvent = (props) => {
	// 	return (
	// 		<>
	// 			{props.title && location?.pathname === "/messages/campaigns" ? (
	// 				<>
	// 					{Array.isArray(props.title) ? props.title.length : 1}{" "}
	// 					{`campaign${
	// 						Array.isArray(props.title) && props.title.length > 1 ? "s" : ""
	// 					}`}
	// 				</>
	// 			) : null}
	// 		</>
	// 	);
	// };

	const components = useMemo(
		() => ({
			// eventContainerWrapper: CustomEventContainerWrapper,
			eventWrapper: CustomEventWrapper,
			week: {
				header: CustomWeekViewHeader,
				toolbar: () => null, // Override the toolbar to render nothing,
				// event: CustomEvent,
			},
		}),
		[]
	);

	// const eventPropGetter = useCallback((event, start, end, isSelected) => {

	// 	return {
	// 		...(event?.isSaved && {
	// 			className: "campaign-saved",
	// 			style: {
	// 				backgroundColor: `${utils.hex2rgb(event.color)}`,
	// 				borderLeft: `4px solid ${event.color}`,
	// 				fontSize: "12px",
	// 				fontWeight: "500",
	// 				lineHeight: "17px",
	// 				color: "rgba(240, 239, 255, 1)",
	// 			},
	// 		}),
	// 	};
	// }, []);

	// const handleSelectEvent = (event) => {
	// 	console.log("selected event", event);
	// 	handleSetShowModal(false);
	// 	setShowGlobalCampaignPopup(false);
	// 	dispatch(
	// 		updateCampaignSchedule([
	// 			...campaignSchedule.filter((item) => item.isSaved),
	// 		])
	// 	);
	// 	setScheduleTime({
	// 		date: [new Date(event?.start)],
	// 		start: moment(event?.start).format("h:mm A"),
	// 		end: moment(event?.end).format("h:mm A"),
	// 	});
	// 	handleSetSelectedSchedule(event);
	// 	handleSetPopupPos && handleSetPopupPos({ X: 0, Y: 0 });
	// 	handleSetShowPopup(true);
	// };

	const handleSelectSlot = (slotInfo) => {
		// console.log("handle slot", slotInfo);
		const { end, start } = slotInfo;
		const selectedSchedule = {};

		setShowGlobalCampaignPopup(false);
		dispatch(updateSelectedCampaignSchedule(null));
		handleSetSelectedSchedule(null);

		Object.assign(selectedSchedule, {
			isSaved: false,
			isEditMode: true,
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
			  handleSetPopupPos({
					X:
						slotInfo?.box?.x + 268 > window?.innerWidth
							? window?.innerWidth - (268 + 30)
							: slotInfo?.box?.x,
					Y:
						slotInfo?.box?.y + 198 > window?.innerHeight
							? window?.innerHeight - (198 + 81 + 12 + 55)
							: slotInfo?.box?.y,
			  })
			: handleSetPopupPos &&
			  handleSetPopupPos({
					X: slotInfo?.bounds?.left,
					Y: slotInfo?.bounds?.top,
			  });

		const updatedCampaignSchedule = [
			...campaignSchedule.filter((item) => item.isSaved),
			selectedSchedule,
		];
		dispatch(updateCampaignSchedule(updatedCampaignSchedule));
		handleSetShowPopup(true);
		setCalenderModalType && setCalenderModalType("CREATE_CAMPAIGN");
		setCalenderModalType && handleSetShowModal(true);
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

	const handleCloseGlobalCampaignPopup = () => {
		setShowGlobalCampaignPopup(false);
	};

	useEffect(() => {
		if (showMoreBtnRef && showMoreBtnRef?.current) {
			document.addEventListener("click", handleCloseGlobalCampaignPopup);
		}

		return () =>
			document.removeEventListener("click", handleCloseGlobalCampaignPopup);
	}, [showGlobalCampaignPopup]);

	// console.log("CAMPAIGN SCHEDULE -- ", campaignSchedule);

	return (
		<>
			{showGlobalCampaignPopup && (
				<CampaignSchedulerPopup>
					<GlobalCampaignList
						handleSetShowGlobalCampaignPopup={(status) =>
							setShowGlobalCampaignPopup(status)
						}
						listItems={showMoreEvent}
						popupCoordPos={popupCoordPos}
					/>
				</CampaignSchedulerPopup>
			)}
			<Calendar
				localizer={localizer}
				events={campaignSchedule}
				// eventPropGetter={eventPropGetter}
				defaultView='week'
				views={["week"]}
				step={120} // The step in minutes for the time slots
				timeslots={1} // Display 24 time slots for each day
				defaultDate={new Date()}
				min={new Date(0, 0, 0, 0, 0)} // Start time for the day (12:00 AM)
				max={new Date(0, 0, 0, 23, 59)} // End time for the day (11:59 PM)
				components={components}
				formats={formats}
				// onSelectEvent={handleSelectEvent}
				onSelectSlot={handleSelectSlot}
				selectable
				tooltipAccessor={null}
			/>
		</>
	);
};

export default CampaignScheduler;
