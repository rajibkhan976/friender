import { useEffect, useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    darken,
    useTheme
} from '@mui/material';
import { fetchFriendList2 } from '../../../../services/friends/FriendListServices';
import { fetchAllCampaign } from '../../../../services/campaigns/CampaignServices';
import { fetchAllCampaigns } from '../../../../actions/CampaignsActions';
import { useDispatch, useSelector } from 'react-redux';
import helper from "../../../../helpers/helper";


export default function CampaignList(props) {
    //mock data - strongly typed if you are using TypeScript (optional, but recommended)
    const theme = useTheme();
    const dispatch = useDispatch();
    const textFilter = useSelector((state) => state.friendlist.searched_filter);
    const campaignsArray = useSelector(
        (state) => state.campaign.campaignsArray
    );
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [isRefetching, setIsRefetching] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState({});
    //const [selectAcross, setSelectAcross] = useState({selected:false,unSelected:[]})

    //table state
    const [selectAllState, setSelectAllState] = useState(false);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnFilterFns, setColumnFilterFns] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [rowCount, setRowCount] = useState();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15, //customize the default page size
    });

    const handleSelectAllClick = (e) => {
        console.log('clicked');
        let newSelectedRowIds = {};

        if (e.target.checked) {
            data.forEach(row => {
                // console.log(row);
                newSelectedRowIds[row._id] = true;
            });
        } else {
            newSelectedRowIds = {}
        }

        setSelectedRowIds(newSelectedRowIds);
    };

    // const checkAll = e => {
    //   console.log(e.target.checked);

    //   setSelectAcross({
    //     selected: e.target.checked,
    //     unSelected: []
    //   })

    //   handleSelectAllClick(e)
    // }
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

    useEffect(() => {
        console.log('columnFilters--- :::>>>', columnFilters);
        console.log('columnFilterFns--- :::>>>', columnFilterFns);
    }, [columnFilters, columnFilterFns])

    const fetchListData = async () => {
        const data = await fetchAllCampaign();
        console.log("Campaign data", data);
        setData(data);
    }

    useEffect(() => {
        fetchListData();
    }, [])

    useEffect(() => {

        console.log('columnFilters :::', columnFilters);
        //server side pagination on react material table
        const fetchData = async () => {
            //setData(props?.friendsData.slice( pagination.pageIndex*pagination.pageSize,pagination.pageSize*(pagination.pageIndex+1)));
            // console.log("fetchData>>>>>>>>>>>",pagination.pageIndex,pagination.pageSize*(pagination.pageIndex+1));
            if (!data.length) {
                setIsLoading(true);
            } else {
                setIsRefetching(true);
            }

            // const url = new URL(
            //   '/api/data',
            //   process.env.NODE_ENV === 'production'
            //     ? 'https://www.material-react-table.com'
            //     : 'http://localhost:3000',
            // );
            // url.searchParams.set(
            //   'start',
            //   `${pagination.pageIndex * pagination.pageSize}`,
            // );
            // url.searchParams.set('size', `${pagination.pageSize}`);
            // url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
            // url.searchParams.set('globalFilter', globalFilter ?? '');
            // url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

            try {
                const queryParam = {
                    page_number: pagination.pageIndex + 1,
                    page_size: pagination.pageSize,
                    search_string: textFilter,
                    ...props.defaultParams,
                }

                let response = await fetchFriendList2(queryParam)
                //let response = await apiClient('get',`${props.baseUrl}`,{}, { ...queryParam });
                // try {
                //     const data = await ApiClient.get(`${props.baseUrl}`, { ...queryParam });
                //     console.log(data);
                //   } catch (error) {
                //     console.error('Error fetching data:', error);
                //   }

                response = response.data[0];
                // console.log("data list batch", response);
                setRowCount(response.friend_count)
                setData(response.friend_details);

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

        const debouncedFetchData = helper.debounce(fetchData, 0);
        debouncedFetchData();



    }, [
        textFilter,
        //columnFilters,
        //globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting
    ]);

    const columns = useMemo(props.listColDef, [props.listColDef]);

    //light or dark white
    //light or dark white
    const baseBackgroundColor =
        theme.palette.mode === 'dark'
            ? 'rgb(40, 44, 52)'
            : '#000000';

    //pass table options to useMaterialReactTable
    const table = useMaterialReactTable({
        columns,
        data,
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
        //pagination setting start
        // manualFiltering: true,
        enablePagination: true,
        manualPagination: true,
        //manualSorting: true,
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
            //console.log("srows ->",selectedRows);
            setRowSelection(selectedRows)
        },
        onSortingChange: setSorting,
        onColumnFilterFnsChange: setColumnFilterFns,
        rowCount,
        state: {
            rowSelection,
            columnFilters,
            columnFilterFns,
            // globalFilter,
            //isLoading,
            pagination,
            // showAlertBanner: isError,
            // showProgressBars: isRefetching,
            //sorting,
        },
        paginationDisplayMode: "pages",
        //pagination setting end
        //styling props
        muiTableContainerProps: { sx: { maxHeight: '600px' } },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '5px',
            },
        },

        muiTableBodyRowProps: ({ row }) => ({
            //conditionally style selected rows
            sx: {
                fontWeight: row.getIsSelected() ? 'bold' : 'normal',
                color: 'white',
            },
        }),
        muiTableBodyCellProps: ({ column }) => ({
            //conditionally style pinned columns
            sx: {
                fontWeight: column.getIsPinned() ? 'bold' : 'normal',
                color: 'white',
                borderBottom: "none",
                marginBottom: "3px",
            },
        }),
        // muiSelectCheckboxProps:(row, table) => ({
        //     checked: (selectedRowIds[row?.row?.original?._id] || selectAcross?.selected) && !selectAcross?.unSelected?.includes(row?.row?.original?._id),
        //     // color: 'primary',
        //     onChange: (e) => {
        //         // console.log(table.getSelectedRowModel().rows);
        //         handleRowClick(e, row.row.original._id)
        //     },
        //     inputProps: {
        //         'aria-label': `select row ${row.row.original.name}`,
        //     },
        //     // style: {
        //     //   color: 'green',
        //     // },
        //     // size: 'small',
        // }),
        muiTableHeadCellProps: {
            //simple styling with the `sx` prop, works just like a style prop in this example
            sx: {
                fontWeight: 'normal',
                fontSize: '14px',
                color: 'white',
                backgroundColor: '#000000',
                height: '50px !important',

                // Table Heading's Icons Color..
                '& .MuiSvgIcon-root': {
                    color: '#ffffff !important',
                },
            },
        },

        // muiSelectCheckboxProps: (row, table) => ({
        //     // checked: (selectedRowIds[row?.row?.original?._id] || selectAcross?.selected) && !selectAcross?.unSelected?.includes(row?.row?.original?._id),
        //     color: 'primary',
        //     // onChange: (e) => {
        //     //     // console.log(table.getSelectedRowModel().rows);
        //     //     handleRowClick(e, row.row.original._id)
        //     // },
        //     // inputProps: {
        //     //     'aria-label': `select row ${row.row.original.name}`,
        //     // },
        //     style: {
        //       color: '#B3B3BF',
        //     },
        //     // size: 'small',
        // }),
        // Checkbox Design..
        muiSelectCheckboxProps: {
            sx: {
                color: '#B3B3BF',

                '& .MuiSvgIcon-root': {
                    color: '#B3B3BF',
                    height: '30px',
                    width: '30px',
                },

                // Checked Design..
                '&.Mui-checked': {
                    // #0094FF
                    color: '#ffffff',
                    // backgroundColor: '#000000',
                },
            }
        },
        muiTableBodyProps: {
            sx: (theme) => ({
                table: {
                    height: "100% !important",
                    borderCollapse: "collapse",
                },
                thead: {
                    flex: `0 0 auto`,
                },
                tbody: {
                    display: "block",
                    flex: `1 1 auto !important`,
                    overflowY: "auto !important",
                },
                '& td': {
                    height: `50px !important`,
                },
                '& tr': {
                    padding: "1.5px",
                },
                '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
                {
                    // backgroundColor: darken(baseBackgroundColor, 0.1),
                    backgroundColor: '#1c1c1e',
                },
                '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                {
                    backgroundColor: darken(baseBackgroundColor, 0.2),
                },
                '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
                {
                    // backgroundColor: darken(baseBackgroundColor, 0.1),
                    backgroundColor: '#1c1c1e',
                },
                '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
                {
                    backgroundColor: darken(baseBackgroundColor, 0.2),
                },
            }),
        },
        mrtTheme: (theme) => ({
            baseBackgroundColor: baseBackgroundColor,
            draggingBorderColor: theme.palette.secondary.main,
        }),
        muiPaginationProps: {
            rowsPerPageOptions: [15, 30, 60, 90, 180],
            sx: {
                color: "primary",
                shape: "circular",
                variant: "outlined",

                '& .MuiPaginationItem-root': {
                    color: '#8998B8', // Change this to your desired color for pagination numbers
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: '#1976d2', // Change this to your desired color for selected page numbers
                    color: '#000000 !important',
                },
                '& .MuiTablePagination-root': {
                    color: '#8998B8', // Change this to your desired color for "Rows per page" text
                },
                '& .MuiSelect-select': {
                    color: '#8998B8', // Change this to your desired color for dropdown numbers
                },
                '& .MuiMenuItem-root': {
                    color: '#8998B8', // Change this to your desired color for dropdown menu items
                },
                '& .MuiInputBase-root': {
                    color: '#fffffff !important'
                }
            },
        },


        // Rows per page area..
        muiBottomToolbarProps: {
            sx: {
                // position: "absolute",
                // right: '0',
                // top: '0',
                // left: 'unset',

                // Text Style..
                '& .MuiFormLabel-root': {
                    color: '#ffffff',
                    display: 'none',
                },
                // Input Style..  
                '& .MuiInput-root': {
                    color: '#ffffff',
                },
                // Icon Style..
                '& .MuiSelect-iconStandard': {
                    color: '#ffffff',
                }
            },
        },
    })


    //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
    //but the useMaterialReactTable hook will be the most recommended way to define table options
    return (<div className="react-table-container">
        <input
            type='checkbox'
        //  value={selectAcross?.selected}
        //  onChange={(e)=>checkAll(e)}
        />
        <MaterialReactTable table={table} />
    </div>);
}
