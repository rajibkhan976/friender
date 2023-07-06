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
import { useBeforeUnload } from "react-router-dom";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import Checkbox from "../formComponents/Checkbox";
import ListingLoader from "./loaders/ListingLoader";
import NoDataFound from "./NoDataFound";
//import Modal from "../common/Modal";
import { updateSelectedFriends } from "../../actions/FriendListAction";
import "../../assets/scss/component/common/_listing.scss";
import { useDispatch, useSelector } from "react-redux";
//import { RowNode } from "ag-grid-community";
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import DropSelector from "../formComponents/DropSelector"

const Pagination = lazy(() => import("./Pagination"));

const Listing = (props) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const gridRef = useRef();
  const selectedFrnd = useSelector(
    (state) => state.friendlist.selected_friends
  );
  const textFilter = useSelector((state) => state.friendlist.searched_filter);
  const [rowData, setRowData] = useState();
  const [maxSelect, setMaxSelect] = useState(0);
  const [tableStyle, setTableStyle] = useState({
    height: "100%",
    width: "100%",
  });
  const [columnDefs, setColumnDefs] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showPaginate, setShowPaginate] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const isFirstColumn = (params) => {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };
  const currentWhiteList=useSelector((state)=>state.facebook_data.current_whitelist);
  const currentBlackList = useSelector((state) => state.facebook_data.current_blacklist);
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
  // },[tempWhiteList])
 
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
    }
  ];
  useEffect(() => {
    let ageCol = document.querySelectorAll(".ag-header-cell-text");
    let colInterval = setInterval(() => {
      if (ageCol?.length <= 0) {
        ageCol = document.querySelectorAll(".ag-header-cell-text");
      } else {
        clearInterval(colInterval);
        if (ageCol?.length > 0) {
          for (let col of ageCol) {
            if (col.innerHTML.includes("Age") ) {
              col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Age  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>"+
              "<circle cx='9' cy='9' r='6.75' fill='#767485'/>"+
              "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>"+
              "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>"+
              "</svg></p>";
            }
            if (col.innerHTML.includes("Friends source")) {
              col.innerHTML = "<p style='display:flex;align-items:center;justify-content:center;'> Friends source  <svg  style='margin-left:5px;' width='18'height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>"+
              "<circle cx='9' cy='9' r='6.75' fill='#767485'/>"+
              "<circle cx='9' cy='13.5' r='0.375' fill='black' stroke='black' stroke-width='0.5'/>"+
              "<path d='M9 12V10.9359C9 10.2277 9.45316 9.59895 10.125 9.375V9.375C10.7968 9.15105 11.25 8.52233 11.25 7.81415V7.42927C11.25 6.22569 10.2743 5.25 9.07073 5.25H9C7.75736 5.25 6.75 6.25736 6.75 7.5V7.5' stroke='black'/>"+
              "</svg></p>";
            }
          }
        }
      }
    }, 500);
  }, []);

  useEffect(() => {
    setMaxSelect(props.friendsData.length);
    //console.log("FRIENDS IN LISTING::::>>", props.friendsData.length);
  }, []);
 

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
    onGridReady();
    setColumnDefs(props.friendsListingRef);
    //setMaxSelect(props.friendsData.length);
    //console.log("FRIENDS IN LISTING", props.friendsData.length);
  }, [props.friendsData]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    initialWidth: 200,
    cellClass: "cell-vertical-align",
    // autoHeaderHeight: true,
    suppressDragLeaveHidesColumns: true,
    resizable: true,
    suppressMultiSort: false,
    suppressMovable: true
  }));

  // Example load data from sever
  const onGridReady = (params) => {
    var defaultSortModel = [{ colId: "created_at"
    // sort: "asc"
     }];
    try {
      setRowData(props.friendsData);
      
      if(props.friendsData) {
        params.columnApi.applyColumnState({ state: defaultSortModel });
      }
    } catch (error) {
      //console.log(error);
    } finally {
      if (params) {
        params.columnApi.applyColumnState({ state: defaultSortModel });
      }
    }
  };

  const onFirstDataRendered = useCallback((event) => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  const onColumnMoved = (params) => {
    console.log("moved", params.columnApi.getColumnState());
  };

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
    setItemsPerPage(Number(value));
  }, []);

  const navigateToNumPage = useCallback((e) => {
    gridRef.current.api.paginationGoToPage(Number(e.selected));
  }, []);

  const onGridSizeChanged = useCallback((params) => {
    // get the current grids width
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
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

  const filterChanged = useCallback(
    (e) => {
      let filteredCount = 0;
      gridRef.current.api.forEachNodeAfterFilter(() => filteredCount++);

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

  const onChangeCheck = useCallback((isChecked) => {
    if (isChecked) {
      gridRef.current.api.selectAllFiltered();
    } else {
      gridRef.current.api.deselectAll();
    }
  }, []);

  const selectionChanged = useCallback((e) => {
    // let selectedRows = gridRef.current.api.getSelectedRows();
    // console.log("selectedRows", selectedRows);
    const selectedNodes = gridRef.current.api.getSelectedNodes();
   // console.log("selectedNodes", selectedNodes);
    let selectedUsers = [];

    selectedNodes.forEach((node) => {
      // console.log("selected node",node);
      // console.log("co=urr white list",currentWhiteList);
      const newObj={...node.data}
      if(Object.keys(currentWhiteList).length>0){
        if(newObj.friendFbId in currentWhiteList){
          newObj.whitelist_status=currentWhiteList[newObj.friendFbId];
        }
      
      }
      if(Object.keys(currentBlackList).length>0){
        if(newObj.friendFbId in currentBlackList){
          newObj.blacklist_status=currentBlackList[newObj.friendFbId];
        
        }
      }
        
     // console.log("new obj",newObj);
      selectedUsers = [...selectedUsers, {...newObj,"rowId":node.id}];
    });

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
  }, [currentWhiteList,currentBlackList]);

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
      {selectedFriends &&
      selectedFriends.length > 0 &&
      selectedFrnd &&
      selectedFrnd.length > 0 ? (
        <div className="selection-popup d-flex f-justify-center f-align-center">
          <p>
            {selectedFriends.length === gridRef.current.props.rowData.length &&
              "All"}{" "}
            {selectedFriends.length ? (
              <strong>{selectedFriends.length}</strong>
            ) : (
              ""
            )}{" "}
            Friend{selectedFriends.length > 1 && "s"}{" "}
            {selectedFriends.length > 1 ? "are" : "is"} selected.
            {gridRef.current.props.rowData.length !== selectedFriends.length &&
            maxSelect - Number(selectedFriends.length) > 0 ? (
              <span>
                Do you want to select other all{" "}
                {maxSelect - Number(selectedFriends.length)} Friends{" "}
              </span>
            ) : (
              <span>Uncheck All </span>
            )}{" "}
            {maxSelect - Number(selectedFriends.length) === 0 ? (
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
            )}
          </p>
        </div>
      ) : (
        ""
      )}
      <div
        id="grid-wrapper"
        className={`ag-theme-fr-table 
            ag-theme-alpine 
            ${showPaginate ? "defaultPaginate" : ""} 
            ${
              selectedFriends &&
              selectedFriends.length > 0 &&
              selectedFrnd &&
              selectedFrnd.length > 0
                ? "selected-options"
                : ""
            }
            `}
        style={tableStyle}
      >
        <AgGridReact
          onGridReady={onGridReady}
          // onRowDataChanged={()=>{}}
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
          cacheQuickFilter={true}
          // cacheBlockSize={listLimit}
          //enableBrowserTooltips={true}
          tooltipShowDelay={0}
          tooltipHideDelay={1000000}
          alwaysShowHorizontalScroll={true}
        />
      </div>
      {maxSelect !== 0 && !showPaginate ? (
        <footer className="table-footer d-flex f-align-center">
          <Suspense fallback={""}>
            <Pagination
              pageNum={maxSelect}
              itemsPerPage={itemsPerPage}
              onNumClick={navigateToNumPage}
            />
          </Suspense>
          <div className="select-page">
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
                    id="page-size"
                    defaultValue={"15"}
                    // ref={selectRef}
                    selects={pageNumbers}
                    extraClass="pageNo"
                    height="30px"
                    width="90px"
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
