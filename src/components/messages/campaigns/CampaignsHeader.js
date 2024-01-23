import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
	AddTransparentIcon,
	ChevronLeftArrowIcon,
} from "../../../assets/icons/Icons";

import Radio from "../../common/Radio";
import DropSelector from "../../formComponents/DropSelector";
import Switch from "../../formComponents/Switch";
import Alertbox from "../../common/Toast";

const CampaignsHeader = ({
	radioOptions,
	changeCampaignsView = null,
	spanOptions, // Today / Week / All
	changeSpanView = null,
	statusOptions, // Active / Inactive / All
	changeStatusView = null,
	editOptions, // list / settings
	changeEditView = null,
	isEditingCampaign,
	campaignsCreated,
	setIsEditingCampaign,
	toggleEditCampaign = null,
	fetchCampaign,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams();
	const [editCampaign, setEditCampaign] = useState(null);

	const switchPauseCampaign = (e) => {
		if (
			editCampaign?.friends_pending === 0 ||
			new Date(editCampaign?.campaign_end_time) < new Date()
		) {
			Alertbox(
				`${
					editCampaign?.friends_pending === 0
						? "This campaign currently has no pending friend(s). To turn on the campaign, please add some friends"
						: "The campaign you are attempting to turn on has exceeded its end date and time. To proceed, you need to modify the campaign accordingly."
				}`,
				"warning",
				3000,
				"bottom-right"
			);
			return false;
		} else {
			toggleEditCampaign(e.target.checked);
		}
	};

	const resetEditCampaign = () => {
		localStorage.removeItem("fr_editCampaign_view");
	};

	const RenderEditView = useCallback(() => {
		return (
			<Radio
				name='list-type'
				options={editOptions}
				onChangeMethod={changeEditView}
				isIcon={true}
				extraClass='campaigns-view-select m-left-a'
			/>
		);
	}, [editOptions]);

	useEffect(() => {
		// If coming from listing, localstorage will have _id and mode
		if (params?.campaignId) {
			console.log("params CHANGED!!!!");
			if (
				localStorage?.getItem("fr_editCampaign_view") &&
				localStorage?.getItem("fr_editCampaign_view") != "undefined"
			) {
				if (
					JSON.parse(localStorage.getItem("fr_editCampaign_view")).mode !==
					editOptions?.find((el) => el.checked).label
				) {
					let updatedViewObject = editOptions?.find(
						(el) =>
							el.label ===
							JSON.parse(localStorage.getItem("fr_editCampaign_view")).mode
					);
					updatedViewObject.checked = true;
					changeEditView(updatedViewObject);
				}
			}

			// fetchCampaign(params?.campaignId)
		} else {
			localStorage.removeItem("fr_editCampaign_view");
		}
	}, [params]);

	useEffect(() => {
		setEditCampaign(isEditingCampaign);
	}, [isEditingCampaign]);

	return (
		<header className='campaigns-header d-flex f-align-center w-100'>
			{/* If on base campaign page */}
			{location?.pathname?.split("/")?.slice(-1)[0] === "campaigns" ? (
				<>
					<Link
						to='/messages/campaigns/create-campaign'
						className='btn btn-light-bg btn-primary btn-create-campaign'
						onClick={() => setIsEditingCampaign(null)}
					>
						<AddTransparentIcon />
						Create campaign
					</Link>

					<Radio
						name='list-type'
						options={radioOptions}
						onChangeMethod={changeCampaignsView}
						isIcon={true}
						extraClass='campaigns-view-select m-left-a'
					/>
					<DropSelector
						selects={spanOptions}
						id='result-span'
						defaultValue={spanOptions?.find((el) => el?.selected)?.value}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={changeSpanView}
					/>
					<DropSelector
						selects={statusOptions}
						id='state-span'
						defaultValue={statusOptions?.find((el) => el?.selected)?.value}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={changeStatusView}
					/>
				</>
			) : (
				<>
					{editCampaign || editCampaign !== null || params?.campaignId ? (
						<>
							{/* EDIT UI */}
							<Link
								to='/messages/campaigns'
								className='btn btn-inline btn-circular btn-go-back'
								onClick={resetEditCampaign}
							>
								<ChevronLeftArrowIcon />
							</Link>
							<h3>
								{editCampaign
									? editCampaign?.campaign_name
									: "Loading your campaign"}
							</h3>

							{editOptions && <RenderEditView />}

							<div className='campaign-status h-100 d-flex f-align-center'>
								<span>Pause this campaign</span>
								{editCampaign && (
									<Switch
										// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
										checked={editCampaign?.status}
										handleChange={switchPauseCampaign}
									/>
								)}
							</div>
						</>
					) : (
						<>
							{/* CREATE UI */}
							<Link
								to='/messages/campaigns'
								className='btn btn-inline btn-circular btn-go-back'
							>
								<ChevronLeftArrowIcon />
							</Link>
							<h3>Create Campaign</h3>
						</>
					)}
				</>
			)}
		</header>
	);
};

export default memo(CampaignsHeader);
