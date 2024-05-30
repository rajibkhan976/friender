import React, {
	useState,
	useRef,
	useMemo,
	useCallback,
	memo,
	useEffect,
	lazy,
	Suspense,
} from "react";
// import ReactDOM from 'react-dom/client';
// import { useBeforeUnload } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import Checkbox from "../formComponents/Checkbox";
import ListingLoader from "./loaders/ListingLoader";
import NoDataFound from "./NoDataFound";
//import Modal from "../common/Modal";
import {
	updateFilter,
	updateSelectedFriends,
	removeSelectedFriends,
	countCurrentListsize
} from "../../actions/FriendListAction";
import { useDispatch, useSelector } from "react-redux";
//import { RowNode } from "ag-grid-community";
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-community/styles/ag-grid.css";
import "../../assets/scss/component/common/_listing.scss";
import DropSelector from "../formComponents/DropSelector";
import Alertbox from "./Toast";
import DeleteImgIcon from "../../assets/images/deleteModal.png"
import { deleteCampaign } from "../../actions/CampaignsActions";
import Modal from "./Modal";
import { useOutletContext, useParams } from "react-router-dom";
// import e from "cors";

const Pagination = lazy(() => import("./Pagination"));

const Listing = (props) => {
	const dispatch = useDispatch();
	//  const selectRef = useRef(null);
	const gridRef = useRef(null);
	const params = useParams();
	const selectedFrnd = useSelector(
		(state) => state.friendlist.selected_friends
	);
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray)
	const listCount = useSelector((state) => state.friendlist.curr_list_count)
	let selectedPageSet = new Set();
	const textFilter = useSelector((state) => state.friendlist.searched_filter);
	const campaignDuration = useSelector((state) => state.campaign.campaignDuration)
	const campaignFilter = useSelector((state) => state.campaign.campaignFilter)
	const [rowData, setRowData] = useState();
	const [maxSelect, setMaxSelect] = useState(0);
	const [filteredSelects, setFilteredSelects] = useState(0);
	const [tableStyle, setTableStyle] = useState({
		height: "100%",
		width: "100%",
	});
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [columnDefs, setColumnDefs] = useState(null);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [showPaginate, setShowPaginate] = useState(false);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [deleteCampaignConfirm, setDeleteCampaignConfirm] = useState(false)
	const [currentPage, setCurrentPage] = useState(0);
	// const isFirstColumn = (params) => {
	//   var displayedColumns = params.columnApi.getAllDisplayedColumns();
	//   var thisIsFirstColumn = displayedColumns[0] === params.column;
	//   return thisIsFirstColumn;
	// };
	const currentWhiteList = useSelector(
		(state) => state.facebook_data.current_whitelist
	);
	const currentBlackList = useSelector(
		(state) => state.facebook_data.current_blacklist
	);

	// const [tempBlackList, setTempBlackList] = useState([]);
	// const [tempWhiteList,setTempWhiteList]=useState([]);

	// useEffect(() => {
	//   console.log("currentblockkk",currentBlackList)
	//   setTempBlackList(currentBlackList);
	// }, [currentBlackList]);
	// useEffect(() => {
	//   console.log("whitelist",currentWhiteList)
	//   setTempWhiteList(currentWhiteList)
	// },[currentWhiteList]);

	// useEffect(() => {
	//   console.log("tempblacklist::::::::::::::::",tempWhiteList);
	//const [selectedAllChecked, setSelectedAllChecked] = useState(false);

	// const onHeaderCheckboxSelectionChanged = (event) => {
	//   // Your custom logic here
	//   // Access selected rows and other grid information from the event object
	//   console.log('Header checkbox changed!', event);

	//   // If you want to prevent the default selection behavior, set 'selectAllChecked' to false
	//   // and handle the selection logic in this function
	//   setSelectedAllChecked(false);
	// };
	// },[tempWhiteList])
	useEffect(() => {
		dispatch(updateFilter(""));
		if (props.reset) {
			gridRef.current.api.setFilterModel(null);
			props.setReset(null);
		}
	}, [props.reset]);

	const pageNumbers = [
		{
			value: "15",
			label: "15 view",
		},
		{
			value: "30",
			label: "30 view",
		},
		{
			value: "45",
			label: "45 view",
		},
		{
			value: "90",
			label: "90 view",
		},
		{
			value: "180",
			label: "180 view",
		},
		{
			value: maxSelect,
			label: "All",
		},
	];

	const headerCheckboxHandle = (event) => {
		if(!gridRef?.current?.api)return;
		// let paginationSize = gridRef.current.api.paginationGetPageSize();
		let currentPageNum = gridRef.current.api.paginationGetCurrentPage();
		// let totalRowsCount = gridRef.current.api.getDisplayedRowCount();

		if (selectedPageSet.has(currentPageNum)) {
			selectedPageSet.delete(currentPageNum);
		} else {
			selectedPageSet.add(currentPageNum);
		}
		//after two click the code is not working on every page
		if (!event.target.checked && gridRef?.current?.api) {
			onChangeCheck(false);
			setTimeout(() => {
				resetPaginationSelection(gridRef.current);
			}, 100);
		}

		// console.log("ther super ssettt>>>>>",event.target.checked);
		// console.log("selectedPageSet>>>>>",selectedPageSet);
	};

	const addHeaderCheckboxClickListener = () => {
		let headerCheckBoxAll = document.querySelectorAll(".ag-checkbox-input");
		let eventInterval = setInterval(() => {
			if (headerCheckBoxAll?.length > 0) {
				clearInterval(eventInterval);
				// console.log("checkboxxxxxxxxxxxxxxxx",headerCheckBoxAll[0])
				headerCheckBoxAll[0].addEventListener("click", headerCheckboxHandle);
			} else {
				headerCheckBoxAll = document.querySelectorAll(".ag-checkbox-input");
			}
		}, 300);
	};
	useEffect(() => {
		setMaxSelect(props.friendsData.length);
		let ageCol = document.querySelectorAll(".ag-header-cell-text");
		let headerCheckBoxAll = document.querySelectorAll(".ag-checkbox-input");
		addHeaderCheckboxClickListener();
		let colInterval = setInterval(() => {
			if (ageCol?.length <= 0 && headerCheckBoxAll?.length <= 0) {
				//console.log("header_gtgt");
				ageCol = document.querySelectorAll(".ag-header-cell-text");
				// headerCheckBoxAll=document.querySelectorAll('.ag-checkbox-input')
			} else {
				clearInterval(colInterval);
				// if(headerCheckBoxAll?.length>0){
				//   console.log("headerCheckBoxAll",headerCheckBoxAll[0]);
				//   headerCheckBoxAll[0].addEventListener("click",(event)=>{headerCheckboxHandle(event)});
				// }
				// if (ageCol?.length > 0) {

				//   for (let col of ageCol) {

				//     if (col.innerHTML.includes("Age")) {
				//       col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Age  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
				//           "<circle cx='9' cy='9' r='6.75' fill='#767485'/>" +
				//           "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>" +
				//           "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>" +
				//           "</svg></p>";
				//     }
				//     if (col.innerHTML.includes("Friends source")) {
				//       col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Friends source  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
				//           "<circle cx='9' cy='9' r='6.75' fill='#767485'/>" +
				//           "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>" +
				//           "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>" +
				//           "</svg></p>";
				//     }
				//   }
				// }
			}
			// addHeaderCheckboxClickListener();
		}, 300);
		// return () => {
		//   document.removeEventListener('click', headerCheckBoxAll[0]);
		// };
	}, []);

	const addIconToCol = () => {
		let ageCol = document.querySelectorAll(".ag-header-cell-text");
		let colInterval = setInterval(() => {
			if (ageCol?.length <= 0) {
				ageCol = document.querySelectorAll(".ag-header-cell-text");
			} else {
				clearInterval(colInterval);

				// if (ageCol?.length > 0) {

				//   for (let col of ageCol) {

				//     if (col.innerHTML.includes("Age")) {
				//       col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Age  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
				//           "<circle cx='9' cy='9' r='6.75' fill='#767485'/>" +
				//           "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>" +
				//           "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>" +
				//           "</svg></p>";
				//     }
				//     if (col.innerHTML.includes("Friends source")) {
				//       col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Friends source  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
				//           "<circle cx='9' cy='9' r='6.75' fill='#767485'/>" +
				//           "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>" +
				//           "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>" +
				//           "</svg></p>";
				//     }
				//   }
				// }
			}
			// addHeaderCheckboxClickListener();
		}, 300);
	};

	// useEffect(() => {
	//   setMaxSelect(props.friendsData.length);
	//   //console.log("FRIENDS IN LISTING::::>>", props.friendsData.length);
	// }, []);

	//  const onHeaderCheckboxSelectionChanged=(event)=>{
	//    console.log("eventoosss")
	//    //setSelectAllChecked(event.api.getSelectedNodes().length===event.api.getDisplayedRowCount())

	//  }
	useEffect(() => {
		// console.log("i am selectd frinends*****>>>>>:::::",selectedFriends);
		if (selectedFriends?.length >= 0) {
			// console.log("if select frind 11111111111111")
			dispatch(updateSelectedFriends(selectedFriends));
		} else {
			//console.log("else select frind 000000")
			dispatch(updateSelectedFriends([]));
		}
	}, [selectedFriends]);

	// useEffect(() => {
	//   if (selectedFrnd?.length <= 0) {
	//   console.log("selectd fr nddddds*****>>>>>:::::",selectedFrnd);
	//     if (gridRef.current && selectedFriends.length > 0) {
	//       gridRef.current.api.deselectAll();
	//     }
	//   }
	// }, [selectedFrnd]);
	//const headerCheckBoxHandler=()=>{}
	// useEffect(() => { }, []);

	useEffect(() => {
		gridRef &&
			gridRef.current &&
			gridRef.current.api &&
			gridRef.current.api.setQuickFilter(textFilter);

		// gridRef &&
		//   gridRef.current &&
		//   gridRef.current.api &&
		//   console.log(
		//     "lllllllccccount",
		//     gridRef.current.api.getDisplayedRowCount()
		//   );
	}, [textFilter]);

	useEffect(() => {
		// console.log('props.friendsData', props.friendsData);
		onGridReady();
		setColumnDefs(props.friendsListingRef);
		//setMaxSelect(props.friendsData.length);
		//console.log("FRIENDS IN LISTING", props.friendsData.length);
	}, [props.friendsData]);
	useEffect(() => {
		if (gridRef?.current?.api) {
			gridRef.current.api.addEventListener(
				"paginationChanged",
				onPaginationChanged
			);
		}

		if (!selectAllChecked) {
			// console.log("is ieeee checked", selectAllChecked);
			if (gridRef?.current?.api) {
				resetPaginationSelection(gridRef.current);
			}
		}
		//after removing the return it worked the staying selectAll issue
		// return () => {
		//   if (gridRef?.current?.api) {
		//     gridRef.current.api.removeEventListener('paginationChanged', onPaginationChanged);
		//   }

		// }
	}, [selectAllChecked]);

	// DefaultColDef sets props common to all Columns
	const defaultColDef = useMemo(() => ({
		sortable: true,
		cellClass: "cell-vertical-align",
		// autoHeaderHeight: true,
		suppressDragLeaveHidesColumns: true,
		resizable: true,
		suppressMultiSort: false,
		suppressMovable: true,
	}));

	const onPaginationChanged = useCallback(() => {
		//Reset rows selection based on current page
		if (!selectAllChecked) {
			//console.log("is ieeee checked", selectAllChecked);
			resetPaginationSelection(gridRef.current);
		}
		setTimeout(addHeaderCheckboxClickListener, 400);
		//addHeaderCheckboxClickListener()
		setTimeout(addIconToCol);
	}, [selectAllChecked]);

	// Example load data from sever
	const onGridReady = (params) => {
		try {
			gridRef.current.api.addEventListener(
				"paginationChanged",
				onPaginationChanged
			);
			setRowData(props.friendsData);
		} catch (error) {
			//console.log(error);
		} finally {
			var defaultSortModel = [{ colId: "engagement", sort: "desc" }];
			if (params) {
				params.columnApi.applyColumnState({ state: defaultSortModel });
			}
		}
	};
	function deselectHeaderCheckbox() {
		if(gridRef?.current?.columnApi){
			const checkboxColumn = gridRef.current.columnApi.getColumn("friendName"); // Replace 'friendName' with your actual checkbox column ID
		// console.log("chekcbox loadererrer",checkboxColumn);
		if (checkboxColumn?.colDef?.headerCheckboxSelection) {
			// const isHeaderCheckboxSelected = checkboxColumn.getColDef().headerCheckboxSelection;
			// console.log('Is header checkbox selected:', isHeaderCheckboxSelected);
			checkboxColumn.colDef.headerCheckboxSelection = false;
			gridRef.current.columnApi.applyColumnState({ state: [checkboxColumn] });
			checkboxColumn.colDef.headerCheckboxSelection = true;
			gridRef.current.columnApi.applyColumnState({ state: [checkboxColumn] });
			gridRef.current.api.refreshHeader();
		}

		}
	}

	// gridRef.current.api
	const resetPaginationSelection = (self) => {
		if(!self?.api){
			return;
		}
		// console.log("heloooooooo", self)
		//Deselect previously selected rows to reset selection
		//self.api.deselectAll();
		//   const headerCheckbox = document.getElementById("ag-3-input");
		// if (headerCheckbox) {
		//   headerCheckbox.checked = false;
		// }
		deselectHeaderCheckbox();
		//Initialize pagination data
		let paginationSize = self.api.paginationGetPageSize();
		let currentPageNum = self.api.paginationGetCurrentPage();
		let totalRowsCount = self.api.getDisplayedRowCount();

		//Calculate current page row indexes
		let currentPageRowStartIndex = currentPageNum * paginationSize;
		let currentPageRowLastIndex = currentPageRowStartIndex + paginationSize;
		if (currentPageRowLastIndex > totalRowsCount)
			currentPageRowLastIndex = totalRowsCount;

		for (let i = 0; i < totalRowsCount; i++) {
			//Set isRowSelectable=true attribute for current page rows, and false for other page rows
			let isWithinCurrentPage =
				i >= currentPageRowStartIndex && i < currentPageRowLastIndex;
			self.api.getDisplayedRowAtIndex(i).setRowSelectable(isWithinCurrentPage);
		}
	};

	const onFirstDataRendered = useCallback((event) => {
		gridRef.current.api.sizeColumnsToFit();
	}, []);

	// const onColumnMoved = (params) => {
	//   //console.log("moved", params.columnApi.getColumnState());
	// };

	const onPageSizeChanged = useCallback(() => {
		var value = document.getElementById("page-size").value;
		gridRef.current.api.paginationSetPageSize(Number(value));
		setItemsPerPage(Number(value));
	}, []);

	const navigateToNumPage = useCallback((e) => {
		gridRef.current.api.paginationGoToPage(Number(e.selected));
		setCurrentPage(Number(e.selected));
	}, []);

	const onGridSizeChanged = useCallback((params) => {
		// get the current grids width
		var gridWidth = document.getElementById("grid-wrapper")?.offsetWidth;
		// keep track of which columns to hide/show
		var columnsToShow = [];
		var columnsToHide = [];
		// iterate over all columns (visible or not) and work out
		// now many columns can fit (based on their minWidth)
		var totalColsWidth = 0;
		var allColumns = gridRef?.current?.columnApi?.getColumns();
		if (allColumns && allColumns.length > 0) {
			for (var i = 0; i < allColumns.length; i++) {
				var column = allColumns[i];
				totalColsWidth += column.getMinWidth() || 0;
				if (totalColsWidth > gridWidth) {
					columnsToHide.push(column.getColId());
				} else {
					columnsToShow.push(column.getColId());
				}
			}
		}
		// show/hide columns based on current grid width
		gridRef?.current?.columnApi?.setColumnsVisible(columnsToShow, true);
		gridRef?.current?.columnApi?.setColumnsVisible(columnsToHide, false);
		// fill out any available space to ensure there are no gaps
		gridRef?.current?.api?.sizeColumnsToFit();
	}, []);

	const filterChanged = useCallback(
		(e) => {
			let filteredCount = 0;
			gridRef.current.api.forEachNodeAfterFilter(() => filteredCount++);
			props.getFilterNum(filteredCount);
			console.log('filteredCount >>>>>', filteredCount);

			if (gridRef.current.api.filterManager.activeColumnFilters.length > 0) {
				setMaxSelect(filteredCount);
				//console.log("filtered:::", filteredCount);
			} else if (textFilter) {
				//console.log("::Gobal List filter active:::>", filteredCount);
				setMaxSelect(filteredCount);
			} else {
				setMaxSelect(props.friendsData.length);
				//console.log("not filtered", filteredCount);
			}
			// gridRef.current.api.deselectAll();
		},
		[textFilter]
	);

	useEffect(() => {
		setMaxSelect(listCount)
	}, [listCount])

	const removeFriendFromCampaign = async () => {
		// add Remove selected friends from campaign code here
		const removedContacts = await props?.removeCampaignContacts({ selectedFrnd, selectedFriends });

		if (removedContacts && removedContacts?.success) {
			Alertbox(
				`${selectedFriends.length > 1 ? "Friends" : "Friend"} removed from Campaign successfully!`,
				"success",
				1000,
				"bottom-right"
			);

			dispatch(removeSelectedFriends([]))
			console.log('localStorage.getItem("fr_default_fb")', localStorage.getItem("fr_default_fb"), 'params?.campaignId', params?.campaignId);
			props?.getCurrentCampaignFriends(localStorage.getItem("fr_default_fb"), params?.campaignId, 'all')
		} else {
			Alertbox(`${removedContacts?.message || "Can't Remove Friends"}`, "error-toast", 1000, "bottom-right");
		}
	};

	// DELETE THE SELECTED CAMPAIGNS FROM ROW..
	const deleteSelectedCampaigns = useCallback(() => {
		// add Remove selected campaigns code here
		const deletePayload = []

		selectedFriends && selectedFriends?.map(el => deletePayload.push(
			{
				campaignId: el?.campaign_id ? el?.campaign_id : el?._id
			}
		));

		try {
			dispatch(deleteCampaign(deletePayload))
				.unwrap()
				.then((res) => {
					console.log('res', res);
					Alertbox(
						`Campaign(s) has been deleted successfully.`,
						"success",
						1000,
						"bottom-right"
					);
					setDeleteCampaignConfirm(false)

					// campaignsResult && dispatch(countCurrentListsize(campaignsResult?.length));
				})
		} catch (error) {
			Alertbox(error, "error-toast", 1000, "bottom-right");
		}
	}, [selectedFriends, selectedFrnd]);

	// Change the rows to be selectable
	const makeRowsSelectable = () => {
		// Set the rowSelectable property of all row nodes to true
		gridRef.current.api.forEachNode((rowNode) => {
			rowNode.setRowSelectable(true);
		});

		// Refresh the cells to apply the changes
		gridRef.current.api.refreshCells();
	};
	const onChangeCheck = useCallback((isChecked) => {
		makeRowsSelectable();
		// gridRef.current.api.deselectAll();
		setSelectAllChecked(isChecked);
		if (isChecked) {
			// console.log('gridRef?.current >>>>>', gridRef?.current);
			// We can do something over there with ..
			// the grid.Ref.Current.API > data with the status of users
			gridRef.current.api.selectAllFiltered();
		} else {
			gridRef.current.api.deselectAll();
			if (gridRef?.current) {
				resetPaginationSelection(gridRef.current);
			}
		}
	}, []);

	const selectionChanged = useCallback(
		(e) => {
			// let selectedRows = gridRef.current.api.getSelectedRows();
			//  console.log("selecttionchangeee eventntnntntntntntn", e);
			const selectedNodes = gridRef.current.api.getSelectedNodes();
			// console.log("selectedNodes", selectedNodes);
			let selectedUsers = [];

			selectedNodes.forEach((node) => {
				// console.log("selected node",node);
				// console.log("co=urr white list",currentWhiteList);
				const newObj = { ...node.data };

				if (Object.keys(currentWhiteList).length > 0) {
					if (newObj.friendFbId in currentWhiteList) {
						newObj.whitelist_status = currentWhiteList[newObj.friendFbId];
					}
				}
				if (Object.keys(currentBlackList).length > 0) {
					if (newObj.friendFbId in currentBlackList) {
						newObj.blacklist_status = currentBlackList[newObj.friendFbId];
					}
				}

				if (newObj?.status && !newObj?.campaign_name && (newObj?.status !== 'pending' || newObj?.status !== 'pending')) {
					// If the row doesn't meet the criteria, deselect it
					node.setSelected(false);
					// selectedUsers = [...selectedUsers, {...newObj, rowId: node.id, selected: false, selectable: false}];
				} else {
					node.setSelected(true);
					selectedUsers = [...selectedUsers, { ...newObj, rowId: node.id }];
				}

				// console.log("new obj",newObj);
				// selectedUsers = [...selectedUsers, { ...newObj, rowId: node.id }];
			});

			// Setting the max select here..
			if (selectedUsers?.length) {
				setFilteredSelects(selectedUsers?.length);
			}

			// friendFbId
			setSelectedFriends(
				selectedUsers || selectedUsers.length !== 0 ? selectedUsers : null
			);
			if (selectedUsers?.length) {
				localStorage.setItem(
					"fr-selected-friends",
					JSON.stringify(selectedUsers)
				);
			}
		},
		[currentWhiteList, currentBlackList]
	);

	/**
	 * RENDERS THE CHECKBOX TITLE AFTER SELECTS THE FRIENDS
	 * @param {*} maxLength 
	 * @param {*} selectedFriends 
	 * @returns 
	 */
	const renderCheckboxTitle = (maxLength, selectedFriends) => {
		let currentListingLength = gridRef?.current?.props?.rowData?.length;

		// console.log("CURRENT LISTING LENGTH -- ", currentListingLength);
		// console.log("MAX LENGTH -- ", maxLength);
		// console.log("SELECTED FRIEDNS -- ", selectedFriends?.length);

		if (props?.isListing === "campaign-friends") {
			currentListingLength = gridRef?.current?.api?.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length;

			if (currentListingLength !== selectedFriends?.length && (maxLength - Number(selectedFriends?.length) == 0)) {
				return (
					<span>
						Do you want to select other all{" "}
						{currentListingLength - Number(selectedFriends.length)}{" "}
						{props?.isListing === "campaign" ? "Campaigns" : "Friends"}{" "}
					</span>
				);
			} else {
				return (
					<span>Uncheck All </span>
				);
			}
		} else {
			if (currentListingLength !== selectedFriends?.length && maxLength - Number(selectedFriends?.length) > 0) {
				return (
					<span>
						Do you want to select other all{" "}
						{maxSelect - Number(selectedFriends.length)}{" "}
						{props?.isListing === "campaign" ? "Campaigns" : "Friends"}{" "}
					</span>
				);
			} else {
				return (
					<span>Uncheck All </span>
				);
			}
		}
	};

	/**
	 * RENDER THE CHECKBOX ACCORDING TO DIFFERENT LOGICS
	 * @param {*} maxLength 
	 * @param {*} selectedFriends 
	 */
	const renderCheckbox = (maxLength, selectedFriends) => {
		let currentListingLength = gridRef?.current?.props?.rowData?.length;

		if (props?.isListing === "campaign-friends") {
			currentListingLength = gridRef?.current?.api?.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length;

			// console.log("currentListingLength -- ", currentListingLength); // 21
			// console.log("selectedFriends -- ", selectedFriends); // 7
			// console.log("MAXXX -- ", maxLength); // 7

			if (currentListingLength > selectedFriends && currentListingLength > maxLength) {
				return (
					<Checkbox
						onChangeCheck={onChangeCheck}
						checkValue={maxLength === Number(selectedFriends.length)}
					/>
				);
			} else {
				return (
					<Checkbox
						onChangeCheck={onChangeCheck}
						checkValue={currentListingLength === selectedFriends.length}
					/>
				);
			}

		} else {
			if (maxLength - Number(selectedFriends?.length) === 0) {
				return (
					<Checkbox
						onChangeCheck={onChangeCheck}
						checkValue={maxLength === Number(selectedFriends.length)}
					/>
				);
			} else {
				return (
					<Checkbox
						onChangeCheck={onChangeCheck}
						checkValue={currentListingLength === selectedFriends.length}
					/>
				);
			}
		}
	};

	// IS ROW SELECTABLE IS THERE..
	// const isRowSelectable = (node) => {
	// 	console.log("NOde -- ", node);

	// 	if (node.data) {
	// 		return node.data.status === "pending";
	// 	} else {
	// 		return false;
	// 	}
	// }



	//Below comment is needed for backup funcnality
	// useEffect(()=>{
	//  // console.log("data updated",props.friendsData)
	//   setTimeout(()=>{
	//     if(selectedFrnd?.length>0){
	//       const selectedRowIdsSet = new Set(selectedFrnd.map(item => item.rowId));
	//       gridRef &&
	//       gridRef.current &&
	//       gridRef.current.api &&
	//       gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
	//         // console.log("all node", node);
	//           const rowId = node.id;
	//           if (selectedRowIdsSet.has(rowId)) {
	//             console.log("all nodeeeeeeeeeeeeeeeeeee", node);
	//             // console.log("inside the row select includessssss");
	//             // if(node.selected){
	//             //  node.setSelected(false);
	//             // }
	//             node.setSelected(true);
	//           }
	//         });
	//      }
	//   },0)

	return (
		<>
			{
				deleteCampaignConfirm &&
				<Modal
					modalType='delete-type'
					modalIcon={DeleteImgIcon}
					headerText={"Delete Alert"}
					bodyText={
						<>
							{selectedFriends?.length} campaign(s) will be deleted permanently.
							Are you sure you want to delete?
						</>
					}
					closeBtnTxt='Close'
					closeBtnFun={setDeleteCampaignConfirm}
					open={deleteCampaignConfirm}
					setOpen={setDeleteCampaignConfirm}
					ModalFun={deleteSelectedCampaigns}
					btnText={"Yes. Delete"}
				/>
			}

			{/* {props?.isListing === "campaign-friends" 
				? gridRef.current.api.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length - Number(selectedFriends.length) 
				: maxSelect - Number(selectedFriends.length)
			} */}
			{/* gridRef.current.api.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length */}

			{selectedFriends &&
				selectedFriends.length > 0 &&
				selectedFrnd &&
				selectedFrnd.length > 0 ? (
				<div className='selection-popup d-flex f-justify-center f-align-center'>
					<p>
						{/* {props?.isListing === "campaign-friends"
							? gridRef.current.api.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length - Number(selectedFriends.length)
							: maxSelect - Number(selectedFriends.length)
						} */}
						{selectedFriends.length === gridRef.current.props.rowData.length &&
							"All"}{" "}
						{selectedFriends.length ? (
							<strong>{selectedFriends.length}</strong>
						) : (
							""
						)}{" "}
						{props?.isListing === "campaign" ? "Campaign" : "Friend"}
						{selectedFriends.length > 1 && "s"}{" "}
						{selectedFriends.length > 1 ? "are" : "is"} selected.

						{renderCheckboxTitle(props?.isListing === "campaign-friends" ? filteredSelects : maxSelect, selectedFriends)}

						{/* {props?.isListing == "campaign-friends"
							&& gridRef.current.api.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length !== selectedFriends.length
							&& gridRef.current.api.clientSideRowModel?.rowsToDisplay?.filter(el => el?.data?.status !== "send").length - Number(selectedFriends.length) > 0
							? (
								<span>
									Do you want to select other all{" "}
									{maxSelect - Number(selectedFriends.length)}{" "}
									{props?.isListing === "campaign" ? "Campaigns" : "Friends"}{" "}
								</span>
							) : (
								<span>Uncheck All </span>
							)}{" "} */}

						{/* 
						{gridRef.current.props.rowData.length !== selectedFriends.length &&
							maxSelect - Number(selectedFriends.length) > 0 ? (
							<span>
								Do you want to select other all{" "}
								{maxSelect - Number(selectedFriends.length)}{" "}
								{props?.isListing === "campaign" ? "Campaigns" : "Friends"}{" "}
							</span>
						) : (
							<span>Uncheck All </span>
						)}{" "} */}

						{renderCheckbox(props?.isListing === "campaign-friends" ? filteredSelects : maxSelect, selectedFriends)}

						{/* {maxSelect - Number(selectedFriends.length) === 0 ? (
							<Checkbox
								onChangeCheck={onChangeCheck}
								checkValue={maxSelect === Number(selectedFriends.length)}
							/>
						) : (
							<Checkbox
								onChangeCheck={onChangeCheck}
								checkValue={
									gridRef.current.props.rowData.length ===
									selectedFriends.length
								}
							/>
						)} */}

						{props?.isListing === "campaign-friends" && (
							<button
								className='remove-friends btn-inline red-text'
								onClick={removeFriendFromCampaign}
							>
								Remove friend(s)
							</button>
						)}
						{props?.isListing === "campaign" && (
							<button
								className='remove-friends btn-inline red-text'
								// onClick={deleteSelectedCampaigns}
								onClick={() => setDeleteCampaignConfirm(true)}
							>
								Delete campaign(s)
							</button>
						)}
					</p>
				</div>
			) : (
				""
			)}
			<div
				id='grid-wrapper'
				className={`ag-theme-fr-table
            ag-theme-alpine
            ${showPaginate ? "defaultPaginate" : ""}
            ${selectedFriends &&
						selectedFriends.length > 0 &&
						selectedFrnd &&
						selectedFrnd.length > 0
						? "selected-options"
						: ""
					}
            `}
				style={
					maxSelect === 0
						? {
							height: "inherit",
							width: "100%",
						}
						: tableStyle
				}
			>
				<AgGridReact
					onGridReady={onGridReady}
					// onRowDataChanged={()=>{}}
					ref={gridRef}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					animateRows={true}
					rowSelection='multiple'
					suppressRowClickSelection={true}
					onFirstDataRendered={onFirstDataRendered}
					//onHeaderCheckboxSelectionChanged={onHeaderCheckboxSelectionChanged}
					rowHeight={55}
					headerHeight={50}
					//onColumnMoved={onColumnMoved}
					pagination={true}
					paginationPageSize={15}
					suppressScrollOnNewData={false}
					onGridSizeChanged={onGridSizeChanged}
					onFilterChanged={filterChanged}
					rowModelType={showPaginate ? `infinite` : `clientSide`}
					cacheBlockSize={15}
					cacheOverflowSize={2}
					onSelectionChanged={selectionChanged}
					loadingOverlayComponent={ListingLoader}
					noRowsOverlayComponent={NoDataFound}
					cacheQuickFilter={true}
					// cacheBlockSize={listLimit}
					//enableBrowserTooltips={true}
					tooltipShowDelay={0}
					tooltipHideDelay={1000000}
					alwaysShowHorizontalScroll={true}
					suppressMenuHide={true}
				// isRowSelectable={isRowSelectable}
				//onHeaderCheckboxSelectionChanged={onHeaderCheckboxSelectionChanged}
				/>
			</div>
			{maxSelect !== 0 && !showPaginate ? (
				<footer className='table-footer d-flex f-align-center'>
					<Suspense fallback={""}>
						<Pagination
							currentPage={currentPage}
							pageNum={maxSelect}
							itemsPerPage={itemsPerPage}
							onNumClick={navigateToNumPage}
						/>
					</Suspense>
					<div className='select-page'>
						{/* <select
              onChange={onPageSizeChanged}
              id="page-size"
              defaultValue={"15"}
              ref={selectRef}
            >
              <option value="15">15 view</option>
              <option value="30">30 view</option>
              <option value="45">45 view</option>
              <option value="90">90 view</option>
              <option value="180">180 view</option>
              <option value={maxSelect}>All</option>
            </select>  */}
						<DropSelector
							handleChange={onPageSizeChanged}
							id='page-size'
							defaultValue={"15"}
							// ref={selectRef}
							selects={pageNumbers}
							extraClass='pageNo'
							height='30px'
							width='90px'
						/>
					</div>
				</footer>
			) : (
				""
			)}

			{/* <Modal /> */}
		</>
	);
};

export default memo(Listing);
