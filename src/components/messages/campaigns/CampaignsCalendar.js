import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
} from "actions/CampaignsActions";
import { useLocation } from "react-router-dom";
import { utils } from "../../../helpers/utils";
import moment from "moment";
import CampaignScheduler from "./CampaignScheduler";
import CalenderModal from "../../common/CampaignModal";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CampaignsCalendar = () => {
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray);
	const dispatch = useDispatch();
	const location = useLocation();
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [calendarModalType, setCalenderModalType] = useState("CREATE_CAMPAIGN");
	const [open, setOpen] = useState(false);
	const [showTooltip, setShowTooltip] = useState({ index: [], x: 0, y: 0 });

	const [showGlobalCampaignPopup, setShowGlobalCampaignPopup] = useState(false);
	const [scheduleTime, setScheduleTime] = useState({
		date: [new Date()],
		start: "",
		end: "",
	});

	const weekdaysArr = [
		{
			day: moment().startOf("W").format("dddd"),
			date: moment().startOf("W"),
		},
	];
	let iterator = 1;
	const buildOnWeekdaysArr = () => {
		weekdaysArr.push({
			day: moment().startOf("W").add("d", iterator).format("dddd"),
			date: moment().startOf("W").add("d", iterator),
		});
		iterator++;
		if (iterator < 7) {
			buildOnWeekdaysArr();
		}
	};
	buildOnWeekdaysArr();

	useEffect(() => {
		if (campaignsArray.length < 1) {
			dispatch(updateCampaignSchedule([]));
		} else if (Array.isArray(campaignsArray)) {
			const campaignArr = [];
			const groupedCampaignByDateNTime = [];
			campaignsArray.forEach((campaign) => {
				if (campaign.schedule && Array.isArray(campaign?.schedule)) {
					campaign?.schedule.forEach((campaignSchedule) => {
						const date = moment(
							weekdaysArr.find((item) => item.day === campaignSchedule.day).date
						).format("MMMM DD, YYYY");
						campaignArr.push({
							id: campaign?.campaign_id || campaign?._id,
							color: campaign.campaign_label_color,
							title: campaign?.campaign_name,
							start: new Date(`${date} ${campaignSchedule?.from_time}`),
							end: new Date(`${date} ${campaignSchedule?.to_time}`),
						});
					});
				}
			});

			if (campaignArr.length > 0) {
				for (let i = 0; i < campaignArr.length; i++) {
					const campaignTitleArr = [];
					if (
						campaignArr[i].title &&
						campaignArr[i].start &&
						campaignArr[i].end
					) {
						for (let c = 0; c < campaignArr.length; c++) {
							if (
								moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[c].start).format("DD-MM-YYYY h:mm A") &&
								moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[c].end).format("DD-MM-YYYY h:mm A")
							) {
								campaignTitleArr.push(
									<div
										className='global-campaign-title'
										key={i + c}
										style={{
											backgroundColor: `${utils.hex2rgb(
												campaignArr[c].color,
												"bg"
											)}`,
											borderLeft: `4px solid ${utils.hex2rgb(
												campaignArr[c].color,
												"border"
											)}`,
											color: `${utils.hex2rgb(campaignArr[c].color, "text")}`,
										}}
										onMouseDown={(e) => e.stopPropagation()}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[c]);
												setShowTooltip({ index: [], x: 0, y: 0 });
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[c])
												);
												setScheduleTime({
													date: [new Date(campaignArr[c].start)],
													start: moment(campaignArr[c].start).format("h:mm A"),
													end: moment(campaignArr[c].end).format("h:mm A"),
												});
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
										onMouseOver={(e) => {
											if (e.target.scrollWidth > e.target.clientWidth) {
												setCalenderModalType("");
												setOpen(false);
												setShowTooltip({
													index: [i + c],
													x: e.pageX,
													y: e.pageY,
												});
											}
										}}
										onMouseLeave={(e) =>
											e.target.scrollWidth > e.target.clientWidth &&
											setShowTooltip({ index: [], x: 0, y: 0 })
										}
									>
										{campaignArr[c].title}
										<span className='global-campaign-time-slot'>{`${moment(
											campaignArr[c].start
										).format("hh:mma")} - ${moment(campaignArr[c].end).format(
											"hh:mma"
										)}`}</span>
										{showTooltip && showTooltip?.index?.includes(i + c) && (
											<CampaignSchedulerPopup>
												<div
													className='global-campaign-tooltip'
													style={{
														top: `${showTooltip?.y - 80}px`,
														left: `${showTooltip?.x}px`,
													}}
												>
													{campaignArr[c].title}
												</div>
											</CampaignSchedulerPopup>
										)}
									</div>
								);
							}
						}
					}
					if (
						campaignTitleArr.length > 0 &&
						campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY hh:mm:ssa") !==
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)
					) {
						groupedCampaignByDateNTime.push({
							title: campaignTitleArr,
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
							isEditMode: false,
						});
					} else if (
						campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)
					) {
						groupedCampaignByDateNTime.push({
							title:
								[
									<div
										className='global-campaign-title'
										key={i}
										style={{
											backgroundColor: `${utils.hex2rgb(
												campaignArr[i].color,
												"bg"
											)}`,
											borderLeft: `4px solid ${utils.hex2rgb(
												campaignArr[i].color,
												"border"
											)}`,
											color: `${utils.hex2rgb(campaignArr[i].color, "text")}`,
										}}
										onMouseDown={(e) => e.stopPropagation()}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[i]);
												setShowTooltip({ index: [], x: 0, y: 0 });
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[i])
												);
												setScheduleTime({
													date: [new Date(campaignArr[i].start)],
													start: moment(campaignArr[i].start).format("h:mm A"),
													end: moment(campaignArr[i].end).format("h:mm A"),
												});
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
										onMouseOver={(e) => {
											if (e.target.scrollWidth > e.target.clientWidth) {
												setCalenderModalType("");
												setOpen(false);
												setShowTooltip({ index: [i], x: e.pageX, y: e.pageY });
											}
										}}
										onMouseLeave={(e) =>
											e.target.scrollWidth > e.target.clientWidth &&
											setShowTooltip({ index: [], x: 0, y: 0 })
										}
									>
										{campaignArr[i]?.title}
										{showTooltip && showTooltip?.index?.includes(i) && (
											<CampaignSchedulerPopup>
												<div
													className='global-campaign-tooltip'
													style={{
														top: `${showTooltip?.y - 80}px`,
														left: `${showTooltip?.x}px`,
													}}
												>
													{campaignArr[i].title}
												</div>
											</CampaignSchedulerPopup>
										)}
									</div>,
								] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
							isEditMode: false,
						});
					} else if (
						campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)
					) {
						groupedCampaignByDateNTime.push({
							title:
								[
									<div
										className='global-campaign-title'
										key={i}
										style={{
											backgroundColor: `${utils.hex2rgb(
												campaignArr[i].color,
												"bg"
											)}`,
											borderLeft: `4px solid ${utils.hex2rgb(
												campaignArr[i].color,
												"border"
											)}`,
											color: `${utils.hex2rgb(campaignArr[i].color, "text")}`,
										}}
										onMouseDown={(e) => e.stopPropagation()}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[i]);
												setShowTooltip({ index: [], x: 0, y: 0 });
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[i])
												);
												setScheduleTime({
													date: [new Date(campaignArr[i].start)],
													start: moment(campaignArr[i].start).format("h:mm A"),
													end: moment(campaignArr[i].end).format("h:mm A"),
												});
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
										onMouseOver={(e) => {
											if (e.target.scrollWidth > e.target.clientWidth) {
												setCalenderModalType("");
												setOpen(false);
												setShowTooltip({ index: [i], x: e.pageX, y: e.pageY });
											}
										}}
										onMouseLeave={(e) =>
											e.target.scrollWidth > e.target.clientWidth &&
											setShowTooltip({ index: [], x: 0, y: 0 })
										}
									>
										{campaignArr[i]?.title}
										{showTooltip && showTooltip?.index?.includes(i) && (
											<CampaignSchedulerPopup>
												<div
													className='global-campaign-tooltip'
													style={{
														top: `${showTooltip?.y - 80}px`,
														left: `${showTooltip?.x}px`,
													}}
												>
													{campaignArr[i].title}
												</div>
											</CampaignSchedulerPopup>
										)}
									</div>,
								] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
							isEditMode: false,
						});
					} else if (
						campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)
					) {
						groupedCampaignByDateNTime.push({
							title:
								[
									<div
										className='global-campaign-title'
										key={i}
										style={{
											backgroundColor: `${utils.hex2rgb(
												campaignArr[i].color,
												"bg"
											)}`,
											borderLeft: `4px solid ${utils.hex2rgb(
												campaignArr[i].color,
												"border"
											)}`,
											color: `${utils.hex2rgb(campaignArr[i].color, "text")}`,
										}}
										onMouseDown={(e) => e.stopPropagation()}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[i]);
												setShowTooltip({ index: [], x: 0, y: 0 });
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[i])
												);
												setScheduleTime({
													date: [new Date(campaignArr[i].start)],
													start: moment(campaignArr[i].start).format("h:mm A"),
													end: moment(campaignArr[i].end).format("h:mm A"),
												});
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
										onMouseOver={(e) => {
											if (e.target.scrollWidth > e.target.clientWidth) {
												setCalenderModalType("");
												setOpen(false);
												setShowTooltip({ index: [i], x: e.pageX, y: e.pageY });
											}
										}}
										onMouseLeave={(e) =>
											e.target.scrollWidth > e.target.clientWidth &&
											setShowTooltip({ index: [], x: 0, y: 0 })
										}
									>
										{campaignArr[i]?.title}
										{showTooltip && showTooltip?.index?.includes(i) && (
											<CampaignSchedulerPopup>
												<div
													className='global-campaign-tooltip'
													style={{
														top: `${showTooltip?.y - 80}px`,
														left: `${showTooltip?.x}px`,
													}}
												>
													{campaignArr[i].title}
												</div>
											</CampaignSchedulerPopup>
										)}
									</div>,
								] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
							isEditMode: false,
						});
					} else {
						groupedCampaignByDateNTime.push({
							title:
								[
									<div
										className='global-campaign-title'
										key={i}
										style={{
											backgroundColor: `${utils.hex2rgb(
												campaignArr[i].color,
												"bg"
											)}`,
											borderLeft: `4px solid ${utils.hex2rgb(
												campaignArr[i].color,
												"border"
											)}`,
											color: `${utils.hex2rgb(campaignArr[i].color, "text")}`,
										}}
										onMouseDown={(e) => e.stopPropagation()}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[i]);
												setShowTooltip({ index: [], x: 0, y: 0 });
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[i])
												);
												setScheduleTime({
													date: [new Date(campaignArr[i].start)],
													start: moment(campaignArr[i].start).format("h:mm A"),
													end: moment(campaignArr[i].end).format("h:mm A"),
												});
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
										onMouseOver={(e) => {
											if (e.target.scrollWidth > e.target.clientWidth) {
												setCalenderModalType("");
												setOpen(false);
												setShowTooltip({ index: [i], x: e.pageX, y: e.pageY });
											}
										}}
										onMouseLeave={(e) =>
											e.target.scrollWidth > e.target.clientWidth &&
											setShowTooltip({ index: [], x: 0, y: 0 })
										}
									>
										{campaignArr[i]?.title}
										{showTooltip && showTooltip?.index?.includes(i) && (
											<CampaignSchedulerPopup>
												<div
													className='global-campaign-tooltip'
													style={{
														top: `${showTooltip?.y - 80}px`,
														left: `${showTooltip?.x}px`,
													}}
												>
													{campaignArr[i].title}
												</div>
											</CampaignSchedulerPopup>
										)}
									</div>,
								] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
							isEditMode: false,
						});
					}
				}
			}
			dispatch(updateCampaignSchedule(groupedCampaignByDateNTime));
		}
	}, [campaignsArray, showTooltip]);

	useEffect(() => {
		return () => {
			dispatch(updateSelectedCampaignSchedule(null));
			dispatch(updateCampaignSchedule([]));
			setShowTooltip({ index: [], x: 0, y: 0 });
			setScheduleTime(() => {
				return {
					date: [new Date()],
					start: "",
					end: "",
				};
			});
			setOpen(false);
			setShowGlobalCampaignPopup(false);
		};
	}, []);

	return (
		<div className='create-campaign-scheduler-container global-campaign-calendar-view'>
			<div className='create-campaign-scheduler'>
				{open && (
					<CalenderModal
						type={calendarModalType}
						open={open}
						scheduleTime={scheduleTime}
						selectedSchedule={selectedSchedule}
						setOpen={setOpen}
						setCalenderModalType={(type) => setCalenderModalType(type)}
						setScheduleTime={setScheduleTime}
					/>
				)}
				<CampaignScheduler
					handleSetShowModal={(status) => setOpen(status)}
					handleSetSelectedSchedule={setSelectedSchedule}
					selectedSchedule={selectedSchedule}
					setCalenderModalType={(type) => setCalenderModalType(type)}
					setScheduleTime={setScheduleTime}
					setShowGlobalCampaignPopup={setShowGlobalCampaignPopup}
					showGlobalCampaignPopup={showGlobalCampaignPopup}
				/>
			</div>
		</div>
	);
};

export default CampaignsCalendar;
