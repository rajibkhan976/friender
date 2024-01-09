import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";

import ListingLoader from "../../common/loaders/ListingLoader";
import NoDataFound from "../../common/NoDataFound";

const CampaignsListing = (props) => {
	const gridRef = useRef(null);
	const [rowData, setRowData] = useState();
	const [columnDefs, setColumnDefs] = useState(null);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [itemsPerPage, setItemsPerPage] = useState(15);
	const [showPaginate, setShowPaginate] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [maxSelect, setMaxSelect] = useState(0);
	const [tableStyle, setTableStyle] = useState({
		height: "100%",
		width: "100%",
	});
	const selectedCampaigns = useSelector(
		(state) => state?.message?.selected_campaigns
	);

	// DefaultColDef sets props common to all Columns
	const defaultColDef = useMemo(() => ({
		sortable: true,
		initialWidth: 200,
		cellClass: "cell-vertical-align cell-listing-campaign",
		suppressDragLeaveHidesColumns: true,
		resizable: true,
		suppressMultiSort: false,
		suppressMovable: true,
	}));

	const onGridSizeChanged = useCallback((params) => {
		// get the current grids width
		var gridWidth = document.getElementById(
			"grid-wrapper-campaign"
		).offsetWidth;
		// keep track of which columns to hide/show
		var columnsToShow = [];
		var columnsToHide = [];
		// iterate over all columns (visible or not) and work out
		// now many columns can fit (based on their minWidth)
		var totalColsWidth = 0;
		var allColumns = gridRef.current.columnApi.getColumns();
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
		gridRef.current.columnApi.setColumnsVisible(columnsToShow, true);
		gridRef.current.columnApi.setColumnsVisible(columnsToHide, false);
		// fill out any available space to ensure there are no gaps
		gridRef.current.api.sizeColumnsToFit();
	}, []);

	const selectionChanged = useCallback((e) => {}, []);

	const onGridReady = (params) => {
		try {
			setRowData(props?.campaignsData);
			setColumnDefs(props?.campaignsListingRef);
		} catch (error) {
			//console.log(error);
		}
	};

	useEffect(() => {
		setRowData(props?.campaignsData);
		setMaxSelect(props?.campaignsData?.length);
	}, []);
	return (
		<>
			<div
				id='grid-wrapper-campaign'
				className={`ag-theme-fr-table 
                ag-theme-alpine 
                ${showPaginate ? "defaultPaginate" : ""} 
                ${
									selectedCampaigns && selectedCampaigns.length > 0
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
					style={{ width: "100%" }}
					onGridReady={onGridReady}
					ref={gridRef}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					animateRows={true}
					rowSelection='multiple'
					suppressRowClickSelection={true}
					rowHeight={69}
					headerHeight={48}
					pagination={true}
					paginationPageSize={itemsPerPage}
					suppressScrollOnNewData={false}
					onGridSizeChanged={onGridSizeChanged}
					cacheBlockSize={15}
					cacheOverflowSize={2}
					onSelectionChanged={selectionChanged}
					loadingOverlayComponent={ListingLoader}
					noRowsOverlayComponent={NoDataFound}
					cacheQuickFilter={true}
					tooltipShowDelay={0}
					tooltipHideDelay={1000000}
					alwaysShowHorizontalScroll={true}
					suppressMenuHide={true}
				/>
			</div>
		</>
	);
};

export default memo(CampaignsListing);
