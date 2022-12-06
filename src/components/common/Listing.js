import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import Pagination from "./Pagination";
import Checkbox from "../formComponents/Checkbox";
import ListingLoader from "./loaders/ListingLoader";
import NoDataFound from "./NoDataFound";
import Modal from "../common/Modal"
import { updateSelectedFriends } from "../../actions/FriendListAction";
import { useDispatch, useSelector } from "react-redux";
// import 'ag-grid-community/styles/ag-theme-alpine.css';

const Listing = (props) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const gridRef = useRef();
  const selectedFrnd=useSelector((state)=>state.friend_list_data.selected_friends)
  const textFilter=useSelector((state)=>state.listingFilter.searched_filter)
  const [rowData, setRowData] = useState();
  const [maxSelect, setMaxSelect] = useState(0);
  const [tableStyle, setTableStyle] = useState({
    height: "100%",
    width: "100%",
  });
  const [columnDefs, setColumnDefs] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showPaginate, setShowPaginate] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(null);
  const isFirstColumn = (params) => {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    initialWidth: 200,
    cellClass: "cell-vertical-align",
    // autoHeaderHeight: true,
    suppressDragLeaveHidesColumns: true
  }));

  // Example load data from sever
  const onGridReady = (params) => {
    try {
      setRowData(props.friendsData);
    } catch (error) {
      console.log(error);
    }
  };

  const onFirstDataRendered = useCallback((event) => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  const onColumnMoved = (params) => {
    console.log('moved', params.columnApi.getColumnState());
  }

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById('page-size').value;
    gridRef.current.api.paginationSetPageSize(Number(value));
    setItemsPerPage(Number(value))
  }, []);

  const navigateToNumPage = useCallback((e) => {
    gridRef.current.api.paginationGoToPage(Number(e.selected));
  }, []);

  const onGridSizeChanged = useCallback((params) => {
    // get the current grids width
    var gridWidth = document.getElementById('grid-wrapper').offsetWidth;
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

  const filterChanged = useCallback((e) => {
    if(gridRef.current.api.filterManager.activeColumnFilters.length > 0){
      setShowPaginate(true);
      gridRef.current.api.paginationSetPageSize(maxSelect);
    } else {
      setShowPaginate(false);
      gridRef.current.api.paginationSetPageSize(15);
    }
  }, [])

  const onChangeCheck = useCallback((isChecked) => {
    if(isChecked) {
      gridRef.current.api.selectAll();
    } else {
      gridRef.current.api.deselectAll();
    }
  },[])




  useEffect(()=>{
    // console.log("i am selectd frinends*****>>>>>:::::",selectedFriends);
    dispatch(updateSelectedFriends(selectedFriends));
  },[selectedFriends]);  

  const selectionChanged = useCallback((e) => {
    let selectedRows = gridRef.current.api.getSelectedRows();
    let selectedUsers = [];
    
    selectedRows.forEach((item) => {
      selectedUsers = [...selectedUsers, item.fb_user_id]
    })
    
    // friendFbId
    setSelectedFriends(selectedUsers || selectedUsers.length != 0 ? selectedRows : null);

    // console.log('selectedRows.length', selectedRows?.length);
    if(selectedRows?.length) {
      localStorage.setItem('fr-selected-friends', JSON.stringify(selectedUsers));
    }
  }, [])

  useEffect(() => {
    gridRef?.current?.api?.setQuickFilter(textFilter);
    // console.log('textFilter', textFilter);
  }, [textFilter])

  // useEffect(() => {
  //   console.log('friendsData:::', props.friendsData);
  //   setColumnDefs(props.friendsListingRef);
  //   setMaxSelect(props.friendsData.length); 
  // }, [props.friendsData]);

  useEffect(() => {
    onGridReady();
    setColumnDefs(props.friendsListingRef);
    setMaxSelect(props.friendsData.length); 
    console.log("FRIENDS IN LISTING", props.friendsData.length);
  }, [props.friendsData])

  return (
    <>
    {(selectedFriends && selectedFriends.length > 0) &&(selectedFrnd&&selectedFrnd.length>0) ? 
      <div className="selection-popup d-flex f-justify-center f-align-center">
        <p>
          {(selectedFriends.length == gridRef.current.props.rowData.length) && 'All'} {selectedFriends.length ? <strong>{selectedFriends.length}</strong> : ''} Friend{selectedFriends.length > 1 && 's'} on this page are selected,
          {(gridRef.current.props.rowData.length != selectedFriends.length) ? 
            <span>Do you want to select other all {maxSelect - Number(selectedFriends.length)} Friends </span> :
            <span>Uncheck All </span>
          } <Checkbox 
              onChangeCheck={onChangeCheck}
              checkValue={(gridRef.current.props.rowData.length == selectedFriends.length)}
            />
        </p>
      </div> : ""
      }
      <div 
          id="grid-wrapper" 
          className={
            `ag-theme-fr-table 
            ag-theme-alpine 
            ${showPaginate ? 'defaultPaginate' : ''} 
            ${(selectedFriends && selectedFriends.length > 0) &&(selectedFrnd&&selectedFrnd.length>0) ? 'selected-options' : ''}
            `
          } style={tableStyle}>
          <AgGridReact
            onGridReady={onGridReady}
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            onFirstDataRendered={onFirstDataRendered}
            rowHeight={55}
            headerHeight={50}
            onColumnMoved={onColumnMoved}
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
            // cacheBlockSize={listLimit}
          />
      </div>
      {(maxSelect != 0 && !showPaginate) ? 
      <footer className="table-footer d-flex f-align-center">
        <Pagination
          pageNum={maxSelect} 
          itemsPerPage={itemsPerPage}
          onNumClick={navigateToNumPage}
        />
        <div className="select-page">
            <select 
              onChange={onPageSizeChanged} 
              id="page-size" 
              defaultValue={'15'}
              ref={selectRef}
            >
                <option value="15">
                15 view
                </option>
                <option value="30">30 view</option>
                <option value="45">45 view</option>
                <option value="90">90 view</option>
                <option value="180">180 view</option>
                <option value={maxSelect}>All</option>
            </select>
        </div>
      </footer> : ''
      }

      {/* <Modal /> */}
    </>
  );
};

export default memo(Listing);
