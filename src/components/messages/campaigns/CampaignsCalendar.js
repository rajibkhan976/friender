import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	updateCampaignSchedule,
	updateSelectedCampaignSchedule,
} from "actions/CampaignsActions";
import { countCurrentListsize } from "actions/FriendListAction";
import { useLocation } from "react-router-dom";
import { utils } from "../../../helpers/utils";
import moment from "moment";
import CampaignScheduler from "./CampaignScheduler";
import CalenderModal from "../../common/CampaignModal";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CampaignsCalendar = () => {
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray);
	const campaignsFilter = useSelector((state) => state.campaign.campaignFilter);
	const campaignDuration = useSelector(
		(state) => state.campaign.campaignDuration
	);
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
		let campaignsArrayPlaceholder = [];
		if (campaignsArray && Array.isArray(campaignsArray)) {
			
			campaignsArrayPlaceholder = [...campaignsArray];
			const week = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			switch (campaignsFilter) {
				case "active":
					campaignsArrayPlaceholder = [
						...campaignsArrayPlaceholder?.filter((el) => el?.status),
					];
					break;

				case "inactive":
					campaignsArrayPlaceholder = [
						...campaignsArrayPlaceholder?.filter((el) => !el?.status),
					];
					break;

				default:
					campaignsArrayPlaceholder = [...campaignsArrayPlaceholder];
					break;
			}

			switch (campaignDuration) {
				case "today":
					campaignsArrayPlaceholder = [
						...campaignsArrayPlaceholder?.map(
							(el) =>
								el?.schedule?.filter(
									(ex) => ex?.day === week[new Date().getDay()]
								)?.length && {
									...el,
									schedule: [
										...el?.schedule?.filter(
											(ex) => ex?.day === week[new Date().getDay()]
										),
									],
								}
						),
					];
					break;

				default:
					campaignsArrayPlaceholder = [...campaignsArrayPlaceholder];
					break;
			}
			// console.log(campaignsArrayPlaceholder);
			dispatch(countCurrentListsize(campaignsArrayPlaceholder?.length));
		}

		if (
			Array.isArray(campaignsArrayPlaceholder) &&
			campaignsArrayPlaceholder.length < 1
		) {
			dispatch(updateCampaignSchedule([]));
		} else if (
			Array.isArray(campaignsArrayPlaceholder) &&
			campaignsArrayPlaceholder.length > 0
		) {
			const campaignArr = [];
			const groupedCampaignByDateNTime = [];

			campaignsArrayPlaceholder.forEach((campaign) => {
				if (campaign.schedule && Array.isArray(campaign?.schedule)) {
					campaign?.schedule.forEach((campaignSchedule) => {
						const date = moment(
							weekdaysArr.find((item) => item.day === campaignSchedule.day).date
						).format("MMMM DD, YYYY");

						campaignArr.push({
							id: campaign?.campaign_id,
							color: campaign.campaign_label_color,
							title: campaign?.campaign_name,
							start: new Date(`${date} ${campaignSchedule?.from_time}`),
							end: new Date(`${date} ${campaignSchedule?.to_time}`),
							status: campaign?.status,
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
						const matchedSchedule = campaignArr[i];

						campaignTitleArr.push(
							<div
								className='global-campaign-title'
								key={i}
								style={{
									backgroundColor: `${
										campaignArr[i].status
											? utils.hex2rgb(matchedSchedule.color, "bg")
											: "rgba(93, 97, 102, 0.2)"
									}`,
									borderLeft: `4px solid ${
										campaignArr[i].status
											? utils.hex2rgb(matchedSchedule.color, "border")
											: "rgba(93, 97, 102, 1)"
									}`,
									color: `${
										campaignArr[i].status
											? utils.hex2rgb(matchedSchedule.color, "text")
											: "rgba(93, 97, 102, 1)"
									}`,
								}}
								onMouseDown={(e) => e.stopPropagation()}
								onClick={() => {
									if (location?.pathname === "/campaigns") {
										// console.log("CMAPAIGN ID", campaignArr[i]);
										setShowTooltip({ index: [], x: 0, y: 0 });
										dispatch(updateSelectedCampaignSchedule(matchedSchedule));
										setScheduleTime({
											date: [new Date(matchedSchedule.start)],
											start: moment(matchedSchedule.start).format("h:mm A"),
											end: moment(matchedSchedule.end).format("h:mm A"),
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
											index: [i],
											x: e.pageX,
											y: e.pageY,
										});
									}
								}}
								onMouseLeave={() => setShowTooltip({ index: [], x: 0, y: 0 })}
							>
								<span className='global-campaign-title-slot'>
									{matchedSchedule.title}
								</span>
								{showTooltip && showTooltip?.index?.includes(i) && (
									<CampaignSchedulerPopup>
										<div
											className='global-campaign-tooltip'
											style={{
												top: `${showTooltip?.y - 40}px`,
												left: `${showTooltip?.x}px`,
											}}
										>
											{matchedSchedule.title}
										</div>
									</CampaignSchedulerPopup>
								)}
							</div>
						);

						// let deepCopyOfCampaignArr = [...campaignArr];
						// for (let c = 0; c < deepCopyOfCampaignArr.length; c++) {
						// 	if (
						// 		moment(campaignArr[i].start).format("DD-MM-YYYY h:mm A") ===
						// 			moment(deepCopyOfCampaignArr[c].start).format(
						// 				"DD-MM-YYYY h:mm A"
						// 			) &&
						// 		moment(campaignArr[i].end).format("DD-MM-YYYY h:mm A") ===
						// 			moment(deepCopyOfCampaignArr[c].end).format(
						// 				"DD-MM-YYYY h:mm A"
						// 			)
						// 	) {
						// 		const matchedSchedule = deepCopyOfCampaignArr[c];

						// 		campaignTitleArr.push(
						// 			<div
						// 				className='global-campaign-title'
						// 				key={i + c}
						// 				style={{
						// 					backgroundColor: `${utils.hex2rgb(
						// 						matchedSchedule.color,
						// 						"bg"
						// 					)}`,
						// 					borderLeft: `4px solid ${utils.hex2rgb(
						// 						matchedSchedule.color,
						// 						"border"
						// 					)}`,
						// 					color: `${utils.hex2rgb(matchedSchedule.color, "text")}`,
						// 				}}
						// 				onMouseDown={(e) => e.stopPropagation()}
						// 				onClick={() => {
						// 					if (location?.pathname === "/messages/campaigns") {
						// 						// console.log("CMAPAIGN ID", campaignArr[i]);
						// 						setShowTooltip({ index: [], x: 0, y: 0 });
						// 						dispatch(
						// 							updateSelectedCampaignSchedule(matchedSchedule)
						// 						);
						// 						setScheduleTime({
						// 							date: [new Date(matchedSchedule.start)],
						// 							start: moment(matchedSchedule.start).format("h:mm A"),
						// 							end: moment(matchedSchedule.end).format("h:mm A"),
						// 						});
						// 						setShowGlobalCampaignPopup(false);
						// 						setCalenderModalType("VIEW_DETAILS");
						// 						setOpen(true);
						// 					}
						// 				}}
						// 				onMouseOver={(e) => {
						// 					if (e.target.scrollWidth > e.target.clientWidth) {
						// 						setCalenderModalType("");
						// 						setOpen(false);
						// 						setShowTooltip({
						// 							index: [i + c],
						// 							x: e.pageX,
						// 							y: e.pageY,
						// 						});
						// 					}
						// 				}}
						// 				onMouseLeave={() =>
						// 					setShowTooltip({ index: [], x: 0, y: 0 })
						// 				}
						// 			>
						// 				<span className='global-campaign-title-slot'>
						// 					{matchedSchedule.title}
						// 				</span>
						// 				<span className='global-campaign-time-slot'>{`${moment(
						// 					matchedSchedule.start
						// 				).format("hh:mma")} - ${moment(matchedSchedule.end).format(
						// 					"hh:mma"
						// 				)}`}</span>
						// 				{showTooltip && showTooltip?.index?.includes(i + c) && (
						// 					<CampaignSchedulerPopup>
						// 						<div
						// 							className='global-campaign-tooltip'
						// 							style={{
						// 								top: `${showTooltip?.y - 40}px`,
						// 								left: `${showTooltip?.x}px`,
						// 							}}
						// 						>
						// 							{matchedSchedule.title}
						// 						</div>
						// 					</CampaignSchedulerPopup>
						// 				)}
						// 			</div>
						// 		);
						// 		deepCopyOfCampaignArr.splice(c, 1);
						// 	}
						// }
					}

					if (
						campaignTitleArr.length > 0 &&
						campaignArr[i].start &&
						campaignArr[i].end
					) {
						groupedCampaignByDateNTime.push({
							title: campaignTitleArr,
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
	}, [campaignsArray, showTooltip, campaignsFilter, campaignDuration]);

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
