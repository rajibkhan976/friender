const GlobalCampaignList = (props) => {
	const { handleSetShowGlobalCampaignPopup, listItems, popupCoordPos } = props;

	return (
		<div
			className='global-campaign-list-content'
			style={{
				top: `${popupCoordPos.y}px`,
				left: `${popupCoordPos.x}px`,
			}}
		>
			{listItems && Array.isArray(listItems) && listItems.map((item) => item)}
		</div>
	);
};

export default GlobalCampaignList;
