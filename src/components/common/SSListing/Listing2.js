import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MuiListStyleProps } from "./style/Style";
import {
    darken,
    useTheme
} from '@mui/material';
//import { fetchFriendList2 } from '../../../services/friends/FriendListServices';
import { useDispatch, useSelector } from 'react-redux';
import helper from "../../../helpers/helper"
// import apiClient from '../../../services';
// import CheckBox from '../../formComponents/Checkbox';

import "../../../assets/scss/component/common/_listing.scss"
import { getListData, updateCurrlistCount, updateFilterState } from "../../../actions/SSListAction";


export default function Listing2(props) {
    //mock data - strongly typed if you are using TypeScript (optional, but recommended)
    const theme = useTheme();
    const dispatch = useDispatch();
    const textFilter = useSelector((state) => state.friendlist.searched_filter);
    const isInitialRender = useRef(true);
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [rowSelectionTracker, setRowSelectionTracker] = useState({});
    const [isRefetching, setIsRefetching] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState({});
    const [selectAcross, setSelectAcross] = useState({selected:false,unSelected:[]})

    //table state
    const [selectAllState, setSelectAllState] = useState(false);
    const [unSelectedIds,setUnselectedIds] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnFilterFns, setColumnFilterFns] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [rowCount, setRowCount] = useState();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15, //customize the default page size
    });
    const listMuiProps = MuiListStyleProps(theme);
    const customTableMethods = props.tableMethods

    function getUniqueRecords(array1, array2) {
      // Merge the two arrays
      const mergedArray = [...array1, ...array2];
   
      // Create a Set to filter out duplicates
      const uniqueSet = new Set(mergedArray);
   
      // Convert the Set back to an array
      const uniqueArray = Array.from(uniqueSet);
   
      return uniqueArray;
    }
 
 
    function filterArray(array1, array2) {
      // Create a Set from array2 for efficient look-up
      const setArray2 = new Set(array2);
   
      // Filter array1 to remove elements that are present in array2
      const filteredArray = array1.filter(item => !setArray2.has(item));
   
      return filteredArray;
    }
 
 
    useEffect(() => {
      // console.log('rowSelection', rowSelection);
      // Fetching all unselectedIds by comparing with the previous rowSelection
      const usIds = Object.keys(rowSelectionTracker).filter(id => !(id in rowSelection));
 
 
      //if unSelectedIs is not empty  then
      if(unSelectedIds){
 
 
        //function to check from exsisting and new unchecked id and filter any dullicated unselected id if present
        let uniqueUncheckedIds =  getUniqueRecords(unSelectedIds,usIds)
 
 
        // function to remove uncheckedIds if its again checked
        let updateUncheckIdsIfChecked =  filterArray(uniqueUncheckedIds,Object.keys(rowSelection))
 
 
        // console.log('updateUncheckIdsIfChecked', updateUncheckIdsIfChecked)
        // Finally update it to unselectedIDs global state
        setUnselectedIds(updateUncheckIdsIfChecked)
        if (selectAcross?.selected) {
          setSelectAcross({
            ...selectAcross,
            unSelected: [...updateUncheckIdsIfChecked]
          })
          // console.log('updateUncheckIdsIfChecked', updateUncheckIdsIfChecked);
        }
      }else{
 
 
        // If no previous global state value available then add it for the first time
        setUnselectedIds(usIds)
        
        if (selectAcross?.selected) {
          setSelectAcross({
            ...selectAcross,
            unSelected: [...usIds]
          })
          // console.log('usIds', usIds);
        }
      }
 
 
    }, [rowSelection,rowSelectionTracker])

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
    setRowSelectionTracker(currentSelection)

    // console.log('NEWLY >>>>>>', selectedRowsFn());
    setRowSelection(selectedRowsFn);
  };


  const checkAll = e => {
    // console.log('e', e.target.checked);
    setUnselectedIds([])

    setSelectAcross({
      selected: e.target.checked,
      unSelected: []
    })

    if (e.target.checked) {
      let obj = data.reduce((acc, item) => {
        acc[item._id] = true;
        return acc;
      }, {});
      obj = {...rowSelection, ...obj}
     
      setRowSelection(obj)
      setRowSelectionTracker(obj)
    } else {
      setRowSelection({})
      setRowSelectionTracker({})
    }
    // handleSelectAllClick(e)
  }

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
    const fetchData = async (
      paginationData,
      globalFilter,
      filteronColumn,
      filteronColumnFns,
      sortingState
    ) => {
      //  console.log("sorting||||--- :::>>>", sorting);
      //setData(props?.friendsData.slice( pagination.pageIndex*pagination.pageSize,pagination.pageSize*(pagination.pageIndex+1)));
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      try {
        const queryParam = {
          page_number: paginationData.pageIndex + 1,
          page_size: paginationData.pageSize,
          search_string: globalFilter.length > 2 ? globalFilter : null,
          ...props.defaultParams,
        };

        if (filteronColumn.length > 0) {
          const { values, fields, operators } =
            helper.listFilterParamsGenerator(filteronColumn, filteronColumnFns);
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
          queryParam : queryParam,
          baseUrl : props.baseUrl,
        }

        dispatch(getListData(payload))
          .unwrap()
          .then((response) => {
            // let response = await fetchFriendList2(queryParam);
            const { data, count } = props.dataExtractor(response);
            //console.log("data list batch____>>", data,count);
            setRowCount(count);
            setData(data);
            if( !queryParam.filter || queryParam.filter === 0 ){
              dispatch(updateCurrlistCount(count));
            }
            if (selectAcross?.selected) {
              let obj = response?.data[0]?.friend_details.reduce(
                (acc, item) => {
                  // console.log('UNSELECTED OR NOT ', item._id , '>>>>>>>>', unSelectedIds?.includes(item._id));
                  if (!unSelectedIds?.includes(item._id)) {
                    acc[item?._id] = true;
                    return acc;
                  }
                },
                {}
              );
              obj = { ...rowSelection, ...obj };
              setRowSelection(obj);
            }
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
      setIsLoading(false);
      setIsRefetching(false);
    };
    const debouncedFetchData = useCallback(
      helper.debounce(fetchData, 1000),
      []
    );

    useEffect(() => {
      if (isInitialRender.current) {
        isInitialRender.current = false; // Set to false after the first render
      } else {
      debouncedFetchData(pagination,textFilter,columnFilters,columnFilterFns,sorting);
      dispatch(updateFilterState({
        filter_key_value: columnFilters,
        filter_fun_state: columnFilterFns
      }))
      }
    }, [
      textFilter,
      columnFilters,
      columnFilterFns,
    ]);
    useEffect(() => {
      //console.log("pagination", pagination);
      fetchData(pagination,textFilter,columnFilters,columnFilterFns,sorting);
    }, [pagination.pageIndex, pagination.pageSize,sorting]);

  const columns = useMemo(props.listColDef, [props.listColDef]);
  

    //pass table options to useMaterialReactTable
    const table = useMaterialReactTable({
        columns,
        data,
        rowCount,
        getRowId: (originalRow) => originalRow._id,
        enableRowSelection: true,
        enableSelectAll: true,
        selectAllMode: "page",
        enableTopToolbar: false,
        enableBottomToolbar: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        enableColumnActions: false,
        columnFilterDisplayMode: 'popover',
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
          handleSelectionChange(selectedRows)
          // setRowSelection(selectedRows)
        },
        //onSortingChange: setSorting,
        onColumnFilterFnsChange: setColumnFilterFns,
        state: {
            rowSelection,
            columnFilters,
            columnFilterFns,
            isLoading,
            pagination,
            // showAlertBanner: isError,
            // showProgressBars: isRefetching,
            sorting,
        },
        onSortingChange: setSorting,
        //pagination setting end 
        muiSkeletonProps: {
          animation: 'wave',
        },
        ...customTableMethods,
        ...listMuiProps
          
      
    })


    //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
    //but the useMaterialReactTable hook will be the most recommended way to define table options
    return (<div className="react-table-container">
      { 
        (
          Object.keys(rowSelection)?.length > 0 ||
          selectAcross?.selected
        ) &&
        <div className="selection-popup d-flex f-justify-center f-align-center">
          <p>
              
                <strong>
                  {
                    selectAcross?.selected ? 
                      selectAcross?.unSelected?.length === 0 ?
                        'All ' :
                        `All except ${selectAcross?.unSelected?.length} friends ` :
                      `${Object.keys(rowSelection)?.length} ${Object.keys(rowSelection)?.length > 1 ? 'friends ' : 'friend '}`}
                </strong>
                selected.
                
                {
                  selectAcross?.selected && selectAcross?.unSelected?.length === 0 ? 
                    <span>Do you want to unselect all Friends? </span> :
                    <span>Do you want to select all Friends? </span>
                }
                <label className="fr-custom-check">
                  <input
                    type='checkbox'
                    checked={selectAcross?.selected && selectAcross?.unSelected?.length === 0 && unSelectedIds?.length === 0}
                    onChange={(e)=>checkAll(e)}
                  />
                  <span className="checkmark"></span>
                </label>
            {/* <button onClick={()=>console.log('STATUS ::::::', selectAcross)}>
              Get status
            </button> */}
          </p>
        </div>
      }
        <MaterialReactTable table={table} />
    </div>);
}

