import { createPortal } from "react-dom";

const CampaignSchedulerPopup = (props) => {
	const { handleSetShowPopup, topPos = 0, leftPos = 0 } = props;
	return createPortal(
		<div
			className='campaign-scheduler-popup-container'
			style={{
				top: `${topPos}px`,
				left: `${leftPos}px`,
			}}
		>
			<div className='campaign-scheduler-popup-header'>Choose days</div>
			<div className='campaign-scheduler-popup-body'>Select time from</div>
			<div className='campaign-scheduler-popup-footer'>
				<button
					type='button'
					className='scheduler-popup-cancel-btn'
					onClick={() => handleSetShowPopup(false)}
				>
					Cancel
				</button>
				<button
					type='button'
					className='scheduler-popup-save-btn'
				>
					Save
				</button>
			</div>
		</div>,
		document.getElementById("root")
	);
};

export default CampaignSchedulerPopup;
