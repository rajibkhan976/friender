import { useCallback, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CampaignContext } from "../../../pages/messages/index";
import {
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
} from "../../../actions/CampaignsActions";
import { utils } from "../../../helpers/utils";
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

const CustomEventWrapper = ({ event }) => {
	console.log(event);
	return <>{event.title}</>;
};

const CampaignScheduler = (props) => {
	const {
		campaignsList = [],
		handleSetPopupPos,
		handleSetShowPopup,
		setCalenderModalType,
	} = props;
	const dispatch = useDispatch();
	const { campaignViewMode } = useContext(CampaignContext);
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);

	useEffect(() => {
		if (Array.isArray(campaignsList)) {
			console.log(campaignsList);
			const campaignArr = [];
			campaignsList.forEach((campaign) => {
				Array.isArray(campaign?.schedule) &&
					campaign?.schedule.forEach((campaignSchedule) => {
						campaignArr.push({
							id: campaign.campaign_id,
							color: campaign.campaign_label_color,
							title: campaign?.campaign_name,
							start: new Date(campaignSchedule?.from_time),
							end: new Date(campaignSchedule?.to_time),
						});
					});
				const updatedCampaignSchedule = [...campaignArr];
				dispatch(updateCampaignSchedule(updatedCampaignSchedule));
			});
		}
	}, []);

	const groupedCampaignList = useMemo(() => {
		const groupedCampaignByDateNTime = [];
		Array.isArray(campaignSchedule) &&
			campaignSchedule.forEach((campaign) => {
				const campaignTitleArr = [];
				campaignSchedule.forEach((schedule, index) => {
					if (
						Date.parse(campaign.start) === Date.parse(schedule.start) &&
						Date.parse(campaign.end) === Date.parse(schedule.end)
					) {
						campaignTitleArr.push(
							<div
								key={index}
								style={{
									width: "100%",
									backgroundColor: `${utils.hex2rgb(
										schedule.color
									)} !important`,
									borderLeft: `4px solid ${schedule.color}`,
									fontSize: "12px",
									fontWeight: "500",
									lineHeight: "17px",
									color: "rgba(240, 239, 255, 1)",
								}}
							>
								{schedule.title}
							</div>
						);
					}
				});
				if (campaignTitleArr.length > 0) {
					groupedCampaignByDateNTime.push({
						id: campaign.campaign_id,
						title: campaignTitleArr,
						start: new Date(campaign.start),
						end: new Date(campaign.end),
					});
				} else {
					groupedCampaignByDateNTime.push({
						id: campaign.campaign_id,
						title: campaign.title,
						start: new Date(campaign.start),
						end: new Date(campaign.end),
					});
				}
			});
		return groupedCampaignByDateNTime;
	}, [campaignSchedule]);

	console.log(groupedCampaignList);

	const components = useMemo(
		() => ({
			week: {
				header: CustomWeekViewHeader,
				toolbar: () => null, // Override the toolbar to render nothing,
			},
		}),
		[]
	);

	const eventPropGetter = useCallback((event, start, end, isSelected) => {
		// console.log(utils.hex2rgb(event.color));
		return {
			...(event.color && {
				className: "global-campaign",
				style: {
					backgroundColor: `${utils.hex2rgb(event.color)}`,
					borderLeft: `4px solid ${event.color}`,
					fontSize: "12px",
					fontWeight: "500",
					lineHeight: "17px",
					color: "rgba(240, 239, 255, 1)",
				},
			}),
		};
	}, []);

	const handleSelectEvent = (event, e) => {
		console.log("selected envet", event);
		setCalenderModalType && setCalenderModalType("VIEW_DETAILS");
		dispatch(updateSelectedCampaignSchedule(event));
		campaignViewMode === "campaignCalendar" && handleSetShowPopup(true);
	};

	const handleSelectSlot = (slotInfo) => {
		console.log("handle slot", slotInfo);
		const { start, end } = slotInfo;
		const selectedSchedules = [];
		selectedSchedules.push({
			start: start,
			end: end,
		});
		slotInfo?.box
			? handleSetPopupPos &&
			  handleSetPopupPos({ X: slotInfo?.box?.x, Y: slotInfo?.box?.y })
			: handleSetPopupPos &&
			  handleSetPopupPos({
					X: slotInfo?.bounds?.left,
					Y: slotInfo?.bounds?.top,
			  });
		setCalenderModalType && setCalenderModalType("CREATE_CAMPAIGN");
		handleSetShowPopup(true);
		// console.log(selectedSchedules)
		const updatedCampaignSchedule = [...campaignSchedule, ...selectedSchedules];
		dispatch(updateCampaignSchedule(updatedCampaignSchedule));
		dispatch(updateSelectedCampaignSchedule(null));
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
		/>
	);
};

export default CampaignScheduler;
