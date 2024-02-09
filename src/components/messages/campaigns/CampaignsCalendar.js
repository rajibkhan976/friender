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

const CampaignsCalendar = () => {
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray);
	const dispatch = useDispatch();
	const location = useLocation();
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [calendarModalType, setCalenderModalType] = useState("CREATE_CAMPAIGN");
	const [open, setOpen] = useState(false);

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
										key={c}
										style={{
											backgroundColor: `${utils.hex2rgb(campaignArr[c].color)}`,
											borderLeft: `4px solid ${campaignArr[c].color}`,
										}}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[c]);
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[c])
												);
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
									>
										{campaignArr[c].title}
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
							title: [<div
								className='global-campaign-title'
								key={i}
								style={{
									backgroundColor: `${utils.hex2rgb(campaignArr[i].color)}`,
									borderLeft: `4px solid ${campaignArr[i].color}`,
								}}
								onClick={() => {
									if (location?.pathname === "/messages/campaigns") {
										// console.log("CMAPAIGN ID", campaignArr[i]);
										dispatch(
											updateSelectedCampaignSchedule(campaignArr[i])
										);
										setShowGlobalCampaignPopup(false);
										setCalenderModalType("VIEW_DETAILS");
										setOpen(true);
									}
								}}
							>
								{campaignArr[i]?.title}
							</div>] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
						});
					} else if (campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)) {
							groupedCampaignByDateNTime.push({
								title: [<div
									className='global-campaign-title'
									key={i}
									style={{
										backgroundColor: `${utils.hex2rgb(campaignArr[i].color)}`,
										borderLeft: `4px solid ${campaignArr[i].color}`,
									}}
									onClick={() => {
										if (location?.pathname === "/messages/campaigns") {
											// console.log("CMAPAIGN ID", campaignArr[i]);
											dispatch(
												updateSelectedCampaignSchedule(campaignArr[i])
											);
											setShowGlobalCampaignPopup(false);
											setCalenderModalType("VIEW_DETAILS");
											setOpen(true);
										}
									}}
								>
									{campaignArr[i]?.title}
								</div>] || [],
								start: new Date(campaignArr[i].start),
								end: new Date(campaignArr[i].end),
								isSaved: true,
							});
					} else if (campaignArr[i].start &&
						campaignArr[i].end &&
						groupedCampaignByDateNTime.every(
							(item) =>
								moment(item.start).format("DD-MM-YYYY h:mm A") !==
									moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") &&
								moment(item.end).format("DD-MM-YYYY h:mm A") ===
									moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A")
						)) {
							groupedCampaignByDateNTime.push({
								title:
									[
										<div
											className='global-campaign-title'
											key={i}
											style={{
												backgroundColor: `${utils.hex2rgb(
													campaignArr[i].color
												)}`,
												borderLeft: `4px solid ${campaignArr[i].color}`,
											}}
											onClick={() => {
												if (location?.pathname === "/messages/campaigns") {
													// console.log("CMAPAIGN ID", campaignArr[i]);
													dispatch(
														updateSelectedCampaignSchedule(campaignArr[i])
													);
													setShowGlobalCampaignPopup(false);
													setCalenderModalType("VIEW_DETAILS");
													setOpen(true);
												}
											}}
										>
											{campaignArr[i]?.title}
										</div>,
									] || [],
								start: new Date(campaignArr[i].start),
								end: new Date(campaignArr[i].end),
								isSaved: true,
							});
					} else {
						groupedCampaignByDateNTime.push({
							title:
								[
									<div
										className='global-campaign-title'
										key={i}
										style={{
											backgroundColor: `${utils.hex2rgb(campaignArr[i].color)}`,
											borderLeft: `4px solid ${campaignArr[i].color}`,
										}}
										onClick={() => {
											if (location?.pathname === "/messages/campaigns") {
												// console.log("CMAPAIGN ID", campaignArr[i]);
												dispatch(
													updateSelectedCampaignSchedule(campaignArr[i])
												);
												setShowGlobalCampaignPopup(false);
												setCalenderModalType("VIEW_DETAILS");
												setOpen(true);
											}
										}}
									>
										{campaignArr[i]?.title}
									</div>,
								] || [],
							start: new Date(campaignArr[i].start),
							end: new Date(campaignArr[i].end),
							isSaved: true,
						});
					}
				}
				dispatch(updateCampaignSchedule(groupedCampaignByDateNTime));
			}
		}
	}, [campaignsArray]);

	useEffect(() => {
		return () => {
			dispatch(updateCampaignSchedule([]));
			setScheduleTime(() => {
				return {
					date: [new Date()],
					start: "",
					end: "",
				};
			});
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
					campaignsList={campaignsArray}
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
