import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MuiListStyleProps } from "./style/Style";
import { useTheme } from "@mui/material";
//import { fetchFriendList2 } from '../../../services/friends/FriendListServices';
import { useDispatch, useSelector } from "react-redux";
import helper from "../../../helpers/helper";

import "../../../assets/scss/component/common/_listing.scss";
import {
  crealGlobalFilter,
  getListData,
  removeMTRallRowSelection,
  resetFilters,
  updateFilterState,
  updateMRTrowSelectionState,
  updateSelectAcross,
  updateSelectAllState,
  updateSelectedFriends,
} from "../../../actions/SSListAction";
import {crealFilter, removeSelectedFriends} from "../../../actions/FriendListAction"
import NoDataFound from "../NoDataFound";

export default function Listing2(props) {
  //mock data - strongly typed if you are using TypeScript (optional, but recommended)
  const theme = useTheme();
  const dispatch = useDispatch();
  const inactiveAfter = useSelector(
    (state) => state.settings.mySettings?.data[0]?.friends_willbe_inactive_after
  );
  const textFilter = useSelector((state) => state.friendlist.searched_filter);
  const selected = useSelector((state) => state.ssList.selected_friends);
  const filter_state = useSelector((state) => state.ssList.filter_state);
  //  const select_all_state = useSelector((state) => state.ssList.select_all_state)
  const isInitialRender = useRef(true);
  const data = useSelector((state) => state.ssList.ssList_data);
  // const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const isLoading = useSelector((state) => state.ssList.isLoading);
  // const [rowSelection, setRowSelection] = useState({});
  const rowSelection = useSelector(
    (state) => state.ssList.MRT_selected_rows_state
  );
  const [rowSelectionTracker, setRowSelectionTracker] = useState({});
  const [isRefetching, setIsRefetching] = useState(false);
  //const [selectedRowIds, setSelectedRowIds] = useState({});
  //const [selectAcross, setSelectAcross] = useState({selected:false,unSelected:[]})
  const selectAcross = useSelector((state) => state.ssList.selectAcross);
  //table state
  //  const [selectAllState, setSelectAllState] = useState(false);
  const [unSelectedIds, setUnselectedIds] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnFilterFns, setColumnFilterFns] = useState([]);
  // const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const rowCount = useSelector((state) => state.ssList.list_filtered_count);
  // const [rowCount, setRowCount] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15, //customize the default page size
  });
  const listMuiProps = MuiListStyleProps(theme, data?.length);
  const customTableMethods = props.tableMethods;
  const setRowSelection = (selectState) => {
    //* Note VVI: always have to pass the old selection state
    //console.log("selectState", selectState)
    const newSelction = selectState(rowSelection);
    dispatch(updateMRTrowSelectionState(newSelction));
  };
  const setSelectAcross = (args) => {
    //console.log("selectAcross", args);
    dispatch(updateSelectAcross(args));
  };
  // useEffect(() => {
  //   console.log("useEffect_+_+_+_+_+_+_+>>>>", props);
  //   console.log("+++++++++props.listColDef+++++++++++", props.listColDef);
  // }, [props]);

  function getUniqueRecords(array1, array2) {
    // Create a Set to store unique elements
    const uniqueSet = new Set();
    for (const item of array1) {
      uniqueSet.add(item);
    }
    for (const item of array2) {
      uniqueSet.add(item);
    }
    return Array.from(uniqueSet);
  }

  function filterArray(array1, array2) {
    // Create a Set from array2 for efficient look-up
    const setArray2 = new Set(array2);

    // Filter array1 to remove elements that are present in array2
    const filteredArray = array1.filter((item) => !setArray2.has(item));

    return filteredArray;
  }

  useEffect(() => {
    //console.log('rowSelection??????>>>>>>________', rowSelection);
    // Fetching all unselectedIds by comparing with the previous rowSelection
    const usIds = Object.keys(rowSelectionTracker).filter(
      (id) => !(id in rowSelection)
    );

    //if unSelectedIs is not empty  then
    if (unSelectedIds) {
      //function to check from exsisting and new unchecked id and filter any dullicated unselected id if present
      let uniqueUncheckedIds = getUniqueRecords(unSelectedIds, usIds);

      // function to remove uncheckedIds if its again checked
      let updateUncheckIdsIfChecked = filterArray(
        uniqueUncheckedIds,
        Object.keys(rowSelection)
      );

      // console.log('updateUncheckIdsIfChecked', updateUncheckIdsIfChecked)
      // Finally update it to unselectedIDs global state
      setUnselectedIds(updateUncheckIdsIfChecked);
      if (selectAcross?.selected) {
        setSelectAcross({
          ...selectAcross,
          unSelected: [...updateUncheckIdsIfChecked],
        });
        dispatch(
          updateSelectAllState({
            ...selectAcross,
            unSelected: [...updateUncheckIdsIfChecked],
          })
        );
        // console.log('updateUncheckIdsIfChecked', updateUncheckIdsIfChecked);
      }

      let filterUnFromSelected = rowSelectionTracker?.length
        ? Object.keys(rowSelectionTracker)?.filter(
          (item) => !updateUncheckIdsIfChecked.includes(item)
        )
        : Object.keys(rowSelection)?.filter(
          (item) => !updateUncheckIdsIfChecked.includes(item)
        );
      // console.log('filterReduxSelected >>>', filterUnFromSelected);
      let unSelectFromRedux = selected?.filter(
        (el) => !updateUncheckIdsIfChecked.includes(el?._id)
      );
      let arrayOfTrackerObjects = [
        ...data?.filter((item) => filterUnFromSelected?.includes(item?._id)),
        ...unSelectFromRedux,
      ];
      // console.log('arrayOfTrackerObjects', Array.from(new Set(arrayOfTrackerObjects)));
      dispatch(
        updateSelectedFriends(Array.from(new Set(arrayOfTrackerObjects)))
      );
    } else {
      // If no previous global state value available then add it for the first time
      setUnselectedIds(usIds);

      if (selectAcross?.selected) {
        setSelectAcross({
          ...selectAcross,
          unSelected: [...usIds],
        });
        dispatch(
          updateSelectAllState({
            ...selectAcross,
            unSelected: [...usIds],
          })
        );
        // console.log('usIds', usIds);
      }

      let filterUnFromSelected = rowSelectionTracker?.length
        ? Object.keys(rowSelectionTracker)?.filter(
          (item) => !usIds.includes(item)
        )
        : Object.keys(rowSelection)?.filter((item) => !usIds.includes(item));
      // console.log('filterReduxSelected >>>', filterUnFromSelected);
      let unSelectFromRedux = selected?.filter(
        (el) => !usIds.includes(el?._id)
      );
      let arrayOfTrackerObjects = [
        ...data?.filter((item) => filterUnFromSelected?.includes(item?._id)),
        ...unSelectFromRedux,
      ];
      // console.log('arrayOfTrackerObjects', Array.from(new Set(arrayOfTrackerObjects)));
      dispatch(
        updateSelectedFriends(Array.from(new Set(arrayOfTrackerObjects)))
      );
    }
  }, [rowSelection, rowSelectionTracker]);

  // useEffect(() => {
  //   console.log('unselcted state', unSelectedIds);

  // }, [unSelectedIds])

  // useEffect(() => {
  //   console.log('rowSelection', rowSelection);
  // }, [rowSelection])

  //   const handleSelectAllClick = (e) => {
  //     console.log('clicked');
  //     let newSelectedRowIds = {};

  //     if (e.target.checked) {
  //         data.forEach(row => {
  //             // console.log(row);
  //             newSelectedRowIds[row._id] = true;
  //         });
  //     } else {
  //         newSelectedRowIds = {}
  //     }

  //     setSelectedRowIds(newSelectedRowIds);
  // };

  const handleSelectionChange = async (selectedRowsFn) => {
    const currentSelection = { ...rowSelection };

    // console.log('PREVIOUSLY ::::::', currentSelection);

    // Manintaing the previously selected row
    setRowSelectionTracker(currentSelection);

    // console.log('NEWLY >>>>>>', selectedRowsFn());
    setRowSelection(selectedRowsFn);
  };

  const checkAll = (e) => {
    // console.log('e', e.target.checked);
    setUnselectedIds([]);

    setSelectAcross({
      selected: e.target.checked,
      unSelected: [],
    });

    dispatch(
      updateSelectAllState({
        selected: e.target.checked,
        unSelected: [],
      })
    );

    if (e.target.checked) {
      let obj = data.reduce((acc, item) => {
        acc[item._id] = true;
        return acc;
      }, {});
      obj = { ...rowSelection, ...obj };

      dispatch(updateMRTrowSelectionState(obj));
      setRowSelectionTracker(obj);
    } else {
      dispatch(updateMRTrowSelectionState({}));
      setRowSelectionTracker({});
      dispatch(updateSelectedFriends([]));
    }
    // handleSelectAllClick(e)
  };

  // const handleRowClick = (e, rowId) => {
  //   console.log('rowId >>>>>', rowId);

  // handleSelectAllClick(e)
  // };
  // const handleRowClick = (e, rowId) => {
  //   console.log('rowId >>>>>', rowId);

  //   if (selectAcross?.selected) {
  //       if (!e.target.checked) {
  //               setSelectAcross({
  //                   ...selectAcross,
  //                   unSelected: [
  //                       ...selectAcross.unSelected,
  //                       rowId
  //                   ]
  //               })
  //       } else {
  //           setSelectAcross({
  //               ...selectAcross,
  //               unSelected: selectAcross?.unSelected?.filter(el => el !== rowId)
  //           })
  //       }
  //   }

  //   setSelectedRowIds((prevSelectedRowIds) => ({
  //     ...prevSelectedRowIds,
  //     [rowId]: !prevSelectedRowIds[rowId],
  //   }));
  // };

  // render life cycle hook
  // useEffect(() => {
  //   setData(props?.friendsData)
  // }, [props.friendsData]);

  // useEffect(() => {
  //   console.log('selectAcross :::',  selectAcross);
  // }, [selectAcross])

  // useEffect(() => {
  //   console.log("columnFilters--- :::>>>", columnFilters);
  //   console.log("columnFilterFns--- :::>>>", columnFilterFns);
  // }, [columnFilters, columnFilterFns]);
  useEffect(() => {
    if (selectAcross?.selected) {
      let obj = data.reduce((acc, item) => {
        // Ensure item and item._id are valid
        if (item?._id && !unSelectedIds?.includes(item._id)) {
          acc[item._id] = true;
        }
        return acc; // Always return acc
      }, {});

      obj = { ...rowSelection, ...obj };
      dispatch(updateMRTrowSelectionState(obj));
    }
  }, [data]);
  const fetchData = async (
    paginationData,
    globalFilter,
    filteronColumn,
    filteronColumnFns,
    sortingState
  ) => {
    //  console.log("sorting||||--- :::>>>", sorting);
    //setData(props?.friendsData.slice( pagination.pageIndex*pagination.pageSize,pagination.pageSize*(pagination.pageIndex+1)));
    // if (!data.length) {
    //   setIsLoading(true);
    // } else {
    //   setIsRefetching(true);
    // }
    const updatedFl = filteronColumn?.length > 0 && filteronColumn?.filter(el => el?.value?.length > 0)
    // console.log(updatedFl);
    // console.log('filteronColumn', filteronColumn);

    try {
      const queryParam = {
        page_number: paginationData.pageIndex + 1,
        page_size: paginationData.pageSize,
        search_string: globalFilter.length > 2 ? globalFilter : null,
        ...props.defaultParams,
      };

      if (updatedFl.length > 0) {
        let { values, fields, operators } = helper.listFilterParamsGenerator(
          updatedFl,
          filteronColumnFns
        );
        
        if (fields?.indexOf('friendGender') > -1 && operators[fields?.indexOf('friendGender')][0] === 'contains'){
          operators[fields?.indexOf('friendGender')][0] = 'equals';
        }
        console.log('values, fields, operators', values, fields, operators);
        queryParam["values"] = JSON.stringify(values);
        queryParam["fields"] = JSON.stringify(fields);
        queryParam["operators"] = JSON.stringify(operators);
        queryParam["filter"] = 1;
      }

      //console.log("sorting---outi :::>>>", sortingState);
      if (sortingState.length > 0) {
        //console.log("sorting--- :::>>>", sortingState);
        queryParam["sort_by"] = sortingState[0].id;
        queryParam["sort_order"] = sortingState[0].desc ? "desc" : "asc";
      }

      const payload = {
        queryParam: queryParam,
        baseUrl: props.baseUrl,
        responseAdapter: props.dataExtractor,
      };

      dispatch(getListData(payload))
        .unwrap()
        .then((response) => {
          // let response = await fetchFriendList2(queryParam);
          // const { data, count } = response;
          // console.log("data list batch____>>", data,count);
          // setRowCount(count);
          // setData(data);
          // if( !queryParam.filter || queryParam.filter === 0 ){
          //   dispatch(updateCurrlistCount(count));
          // }
          // if (selectAcross?.selected) {
          //   let obj = response?.data[0]?.friend_details.reduce(
          //     (acc, item) => {
          //       // console.log('UNSELECTED OR NOT ', item._id , '>>>>>>>>', unSelectedIds?.includes(item._id));
          //       if (!unSelectedIds?.includes(item._id)) {
          //         acc[item?._id] = true;
          //         return acc;
          //       }
          //     },
          //     {}
          //   );
          //   obj = { ...rowSelection, ...obj };
          //   setRowSelection(obj);
          // }
        })
        .catch((error) => {
          setIsError(true);
          console.error(error);
          return;
        });
      // let response = await apiClient(
      //   "get",
      //   `${props.baseUrl}`,
      //   {},
      //   { ...queryParam }
      // );
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    //  setIsLoading(false);
    setIsRefetching(false);
  };
  const debouncedFetchData = useCallback(helper.debounce(fetchData, 1000), []);

  // useEffect(() => {
  //   console.log("filter_state updated", filter_state);
  // }, [filter_state]);

  useEffect(() => {
    if (isInitialRender.current) {
      dispatch(removeMTRallRowSelection())
      isInitialRender.current = false; // Set to false after the first render
    } else {
      debouncedFetchData(
        pagination,
        textFilter,
        columnFilters,
        columnFilterFns,
        sorting
      );
      dispatch(
        updateFilterState({
          filter_key_value: columnFilters,
          filter_fun_state: columnFilterFns,
        })
      );
    }
  }, [textFilter, columnFilters, columnFilterFns]);
  useEffect(() => {
    //console.log("pagination", pagination);
    fetchData(pagination, textFilter, columnFilters, columnFilterFns, sorting);
  }, [pagination.pageIndex, pagination.pageSize, sorting]);

  // useEffect(() => {
  //   console.log('columnFilters', columnFilters);
  // }, [columnFilters])

  const columns = useMemo(()=>{return props.listColDef(inactiveAfter)}, [props.listColDef,data]);

  useEffect(() => {
    dispatch(resetFilters())
    dispatch(crealFilter(""))
    dispatch(crealGlobalFilter())
  }, [])

  const RenderEmpty = () => {
    // console.log('HIIIII', filter_state);
    return (
      ((filter_state?.filter_key_value || filter_state?.filter_key_value) && !isLoading) ? 
        <NoDataFound
          customText="Whoops!"
          additionalText={<>We couldn’t find the data<br /> that you filtered for.</>}
          interactionText="Clear filter"
          isInteraction={() => {
            setColumnFilters([])
            setColumnFilterFns([])
            dispatch(resetFilters())
            dispatch(crealFilter(""))
            dispatch(crealGlobalFilter())
          }}
        /> : <NoDataFound />
    )
  }

  //pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns,
    data,
    rowCount,
    getRowId: (originalRow) => originalRow._id,
    renderEmptyRowsFallback: RenderEmpty,
    enableRowSelection: true,
    enableSelectAll: true,
    selectAllMode: "page",
    enableTopToolbar: false,
    enableBottomToolbar: true,
    //enableColumnResizing: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnActions: false,
    columnFilterDisplayMode: "popover",
    enableColumnFilterModes: true,
    manualFiltering: true,
    //enableSorting: true,
    manualSorting: true,
    // enableSortingRemoval: false,
    // enableMultiSort:false,
    //pagination setting start
    // enablePagination: true,
    manualPagination: true,
    paginationDisplayMode: "pages",
    filterFns: {
      notContains: (row, id, filterValue) => {
        // console.log('row, id, filterValue', row, id, filterValue);
        return row.getValue(id) === filterValue;
      },
    },
    localization: {
      filterCustomFilterFn: 'Custom Filter Fn',
    },
    // muiToolbarAlertBannerProps: isError
    //   ? {
    //     color: 'error',
    //     children: 'Error loading data',
    //   }
    //   : undefined,
    onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (pagination) => {
      setPagination(pagination);
    },
    onRowSelectionChange: (selectedRows) => {
      // console.log(':::::', selectedRows());
      // console.log('IS ALL IN THIS PAGE SELECTED? ', table?.getIsAllPageRowsSelected());
      handleSelectionChange(selectedRows);
      // setRowSelection(selectedRows)
    },
    //onSortingChange: setSorting,
    onColumnFilterFnsChange: setColumnFilterFns,
    state: {
      rowSelection,
      columnFilters,
      columnFilterFns,
      isLoading,
      showProgressBars: false,
      showLoadingOverlay: false,
      isSaving: false,
      // showSkeletons: data.length === 0 ? true : false,
      pagination,
      // showAlertBanner: isError,
      // showProgressBars: isRefetching,
      sorting,
    },
    onSortingChange: setSorting,
    //pagination setting end
    muiSkeletonProps: {
      animation: "wave",
      variant: 'rectangular',
    },
    ...customTableMethods,
    ...listMuiProps
  });

  //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
  //but the useMaterialReactTable hook will be the most recommended way to define table options
  return (
    <div className={`react-table-container ${isLoading ? 'is-loading':''}`}  style={{ width: '100%', minWidth: '800px' }}>
      {((rowSelection && Object.keys(rowSelection)?.length > 0) ||
        (selectAcross?.selected && selectAcross?.unSelected < rowCount) ) && (
          <div className="selection-popup d-flex f-justify-center f-align-center">
            <p>
              <strong>
                {selectAcross?.selected
                  ? selectAcross?.unSelected?.length === 0
                    ? "All "
                    : `All except ${selectAcross?.unSelected?.length} friends `
                  : `${Object.keys(rowSelection)?.length} ${Object.keys(rowSelection)?.length > 1
                    ? "friends "
                    : "friend "
                  }`}
              </strong>
              selected.
              {selectAcross?.selected &&
                selectAcross?.unSelected?.length === 0 ? (
                <span>Do you want to unselect all Friends? </span>
              ) : (
                <span>Do you want to select all Friends? </span>
              )}
              <label className="fr-custom-check">
                <input
                  type="checkbox"
                  checked={
                    (selectAcross?.selected &&
                      selectAcross?.unSelected?.length === 0 &&
                      unSelectedIds?.length === 0) ||
                    selected.length === rowCount
                  }
                  onChange={(e) => checkAll(e)}
                />
                <span className="checkmark"></span>
              </label>
              {/* <button onClick={()=>console.log('STATUS ::::::', selectAcross)}>
              Get status
            </button> */}
            </p>
          </div>
        )}

      {/* {data && data?.length > 0 ? ( */}
        <MaterialReactTable table={table} />
      {/* ) : (
        <NoDataFound />
      )} */}
    </div>
  );
}
