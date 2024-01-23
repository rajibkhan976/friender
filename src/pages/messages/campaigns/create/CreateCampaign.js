import React, { memo, useContext, useEffect } from "react";
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import CreateCampaignWrapper from "components/messages/campaigns/CreateCampaignWrapper";
import { CampaignContext } from "pages/messages/index";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { createCampaign } from "actions/CampaignsActions";
import Alertbox from "components/common/Toast";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { setCampaignViewMode } = useContext(CampaignContext);
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const current_fb_id = localStorage.getItem("fr_default_fb");

	// CREATE/ADD CAMPAIGN FUNCTION..
	const campaignAddRequestToAPI = async (payload, setLoadingBtn) => {
		try {
			const response = await dispatch(createCampaign(payload)).unwrap();

			if (response?.data) {
				Alertbox(`${response?.message}`, "success", 1000, "bottom-right");
				setLoadingBtn(false);
				navigate("/messages/campaigns");
			} else {
				if (response?.error?.code === "resource_conflict") {
					Alertbox(
						"The campaign name is already in use, please try a different name.",
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				} else if (response?.error?.code === "bad_request") {
					Alertbox(
						`${response?.error?.message}`,
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				} else {
					Alertbox(
						"Failed to create the campaign. Please check your input and try again.",
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				}
			}
		} catch (error) {
			// Handle other unexpected errors
			console.log("Error Catch:", error);
			Alertbox(
				"An unexpected error occurred. Please try again later.",
				"error",
				1000,
				"bottom-right"
			);
			setLoadingBtn(false);
		}
	};

	// TRANSFORM CAMPAIGN SCHEDULES PROPERTY INTO THE OBJECT FOR API PAYLOAD..
	const transformCampaignSchedulesPayload = (schedules = []) => {
		const transformSchedules =
			schedules?.length &&
			schedules.map((schedule) => {
				const fromTime = moment(schedule.start).format("YYYY-MM-DD HH:mm:ss");
				const toTime = moment(schedule.end).format("YYYY-MM-DD HH:mm:ss");
				const day = moment(schedule.start).format("dddd");

				return {
					day,
					from_time: fromTime,
					end_time: toTime,
				};
			});

		return transformSchedules;
	};

	// HANDLE SAVED DATA FROM CHILD..
	const handleSavedData = (data, setLoadingBtn = () => null) => {
		const transformCampaignSchedules =
			transformCampaignSchedulesPayload(campaignSchedule);
		const payload = {
			...data,
			fbUserId: current_fb_id,
			schedule: transformCampaignSchedules,
		};
		campaignAddRequestToAPI(payload, setLoadingBtn);
	};

	useEffect(() => {
		setCampaignViewMode("createCampaign");
	}, []);

	return (
		<CampaignCreateEditLayout
			type='CREATE'
			handleClickSaveForm={handleSavedData}
		>
			<CreateCampaignWrapper />
		</CampaignCreateEditLayout>
	);
};

export default memo(CreateCampaign);
