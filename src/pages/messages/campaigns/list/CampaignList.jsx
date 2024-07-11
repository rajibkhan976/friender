import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { darken, useTheme } from "@mui/material";
import { fetchFriendList2 } from "../../../../services/friends/FriendListServices";
import { fetchAllCampaign } from '../../../../services/campaigns/CampaignServices';
import { useSelector } from "react-redux";
import helper from "../../../../helpers/helper";
import apiClient from "../../../../services";
// import "../../../../components/common/SSListing/style/listingStyles.scss";
import 'assets/scss/component/common/_listing.scss';
import { MuiListStyleProps } from "../../../../components/common/SSListing/style/Style";

export default function CampaignList(props) {
    //mock data - strongly typed if you are using TypeScript (optional, but recommended)
    const theme = useTheme();
    const isInitialRender = useRef(true);
    const textFilter = useSelector((state) => state.friendlist.searched_filter);
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [isRefetching, setIsRefetching] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState({});
    const [selectAcross, setSelectAcross] = useState({
        selected: false,
        unSelected: [],
    });

    //table state
    const [selectAllState, setSelectAllState] = useState(false);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnFilterFns, setColumnFilterFns] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [rowCount, setRowCount] = useState();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15, //customize the default page size
    });
    const listMuiProps = MuiListStyleProps(theme);

    useEffect(() => {
        console.log("rowSelection", rowSelection);
    }, [rowSelection]);

    const fetchListData = async (params) => {
        const response = await fetchAllCampaign(params);
        console.log("Campaign data", data);
        setData(response?.data);
        setRowCount(response?.total_campaings);
    }

    console.log(pagination);

    useEffect(() => {
        if (pagination) fetchListData({ page_number: pagination?.pageIndex + 1 });
    }, [pagination])

    const handleSelectAllClick = (e) => {
        console.log("clicked");
        let newSelectedRowIds = {};

        if (e.target.checked) {
            data.forEach((row) => {
                // console.log(row);
                newSelectedRowIds[row._id] = true;
            });
        } else {
            newSelectedRowIds = {};
        }

        setSelectedRowIds(newSelectedRowIds);
    };

    const checkAll = (e) => {
        console.log(e.target.checked);
        setSelectAcross({
            selected: e.target.checked,
            unSelected: [],
        });

        if (e.target.checked) {
            let obj = data.reduce((acc, item) => {
                acc[item._id] = true;
                return acc;
            }, {});
            obj = { ...rowSelection, ...obj };

            setRowSelection(obj);
        } else {
            setRowSelection({});
        }

        // handleSelectAllClick(e)
    };

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

    const fetchData = async (paginationData, globalFilter, filteronColumn, filteronColumnFns, sortingState) => {
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
                const { values, fields, operators } = helper.listFilterParamsGenerator(
                    filteronColumn,
                    filteronColumnFns
                );
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
            //console.log("queryParam____>>", queryParam);

            // let response = await apiClient(
            //     "get",
            //     `${props.baseUrl}`,
            //     {},
            //     { ...queryParam }
            // );
            // let response = await fetchFriendList2(queryParam);
            // const { data, count } = props.dataExtractor(response);
            //console.log("data list batch____>>", data,count);
            // setRowCount(count);
            //   setData(data);

            // setRowCount(json.meta.totalRowCount);
        } catch (error) {
            setIsError(true);
            console.error(error);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    };

    const debouncedFetchData = useCallback(helper.debounce(fetchData, 1000), []);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false; // Set to false after the first render
        } else {
            debouncedFetchData(pagination, textFilter, columnFilters, columnFilterFns, sorting);
        }
    }, [
        textFilter,
        columnFilters,
        columnFilterFns,
    ]);

    useEffect(() => {
        //console.log("pagination", pagination);
        fetchData(pagination, textFilter, columnFilters, columnFilterFns, sorting);
    }, [pagination.pageIndex, pagination.pageSize, sorting]);

    const columns = useMemo(props.listColDef, [props.listColDef]);

    //pass table options to useMaterialReactTable
    const table = useMaterialReactTable({
        columns,
        data,
        rowCount,
        getRowId: (originalRow) => originalRow.friendFbId,
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
            console.log(':::::', selectedRows());
            setRowSelection(selectedRows)
        },
        //onSortingChange: setSorting,
        onColumnFilterFnsChange: setColumnFilterFns,
        state: {
            rowSelection,
            columnFilters,
            columnFilterFns,
            //isLoading,
            pagination,
            // showAlertBanner: isError,
            // showProgressBars: isRefetching,
            sorting,
        },
        onSortingChange: setSorting,
        ...listMuiProps
        //pagination setting end   
    })


    //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
    //but the useMaterialReactTable hook will be the most recommended way to define table options
    return (
        <div className="react-table-container">
            <label>
        <input
                    type="checkbox"
                    checked={selectAcross?.selected}
                    onChange={(e) => checkAll(e)}
        />
                Select All
            </label>
            <MaterialReactTable table={table} />
        </div>
    );
}
