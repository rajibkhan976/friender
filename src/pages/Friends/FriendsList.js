import { useDispatch, useSelector } from "react-redux";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { syncMainFriendList } from "../../actions/FriendsAction";
import Modal from "../../components/common/Modal";
import Listing2 from "../../components/common/SSListing/Listing2";
import { FriendlistColDefs } from "../../components/common/SSListing/ListColumnDefs/ContactlistColDefs";
import config from "../../configuration/config";
const fb_user_id= localStorage.getItem("fr_default_fb");

const FriendsList = () => {
	//::::Friend List geting data from Redux::::
	const dispatch = useDispatch();
	const [filterFrndList, setFilterFrndList] = useState([]);
	const [listFilteredCount, setListFilteredCount] = useState(null);
	const [isReset, setIsReset] = useState(null);
	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const friendsList = useSelector(
		(state) => state.facebook_data.current_friend_list
	);

	useEffect(() => {
		const filteredData = friendsList.filter(
			(item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
		);
		setFilterFrndList(filteredData);
		friendsList && dispatch(countCurrentListsize(filteredData.length));
		dispatch(syncMainFriendList());
	}, [dispatch, friendsList]);
	
	// Any list specific Methods 
	const tableMethods = {};
	//query params
	const defaultParams = {
		friend_status: "Activate",
		deleted_status: 0,
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response)=>{
			return {
				res:response,
				data: response?.data[0]?.friend_details,
				count: response?.data[0]?.friend_count
			}
	}

	return (
		<div className='main-content-inner d-flex d-flex-column listing-main'>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
							{/* {console.log("in modal:::", keyWords, keyWords.matchedKeyword)} */}
							{keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword
								? keyWords?.matchedKeyword.map((el, i) => (
										<span
											className={`tags positive-tags`}
											key={`key-${i}`}
										>
											{el}
										</span>
								  ))
								: "No specific keyword used"}
						</>
					}
					open={modalOpen}
					setOpen={setModalOpen}
					ModalFun={null}
					btnText={" "}
					modalButtons={false}
					additionalClass='modal-keywords'
				/>
			)}
			{/* {filterFrndList?.length > 0   && ( */}
				<Listing2 
					listColDef = {FriendlistColDefs} 
					baseUrl = {config.fetchFriendListUrlv2}
					tableMethods = {tableMethods} 
					defaultParams = {defaultParams}
					dataExtractor = {dataExtractor}
				/>
			{/* )} */}
			{/* {filterFrndList?.length > 0 && listFilteredCount === 0 && (
				<NoDataFound
					customText='Whoops!'
					additionalText={
						<>
							We couldn’t find the data
							<br /> that you filtered for.
						</>
					}
					interactionText='Clear filter'
					isInteraction={() => {
						setIsReset(!isReset);
					}}
				/>
			)} */}
		</div>
	);
};

export default FriendsList;
