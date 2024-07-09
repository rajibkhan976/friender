import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  // type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
  darken,
  useTheme
} from '@mui/material';
import { AccountCircle, Send } from '@mui/icons-material';
import { AgeRenderer, CommentRenderer, CountryRenderer, EngagementRenderer, GenderRenderer, KeywordRenderer, MessageRenderer, ReactionRenderer, RecentEngagementRenderer, SourceRendererPending, UnlinkedNameCellWithOptionsRenderer } from '../listing/FriendListColumns';
import { use } from 'chai';
import { fetchFriendList2 } from '../../services/friends/FriendListServices';
import { useSelector } from 'react-redux';
import  helper from "../../helpers/helper" 


export default function Listing2(props) {
  //mock data - strongly typed if you are using TypeScript (optional, but recommended)
  const theme = useTheme();
  const textFilter = useSelector((state) => state.friendlist.searched_filter);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [isRefetching, setIsRefetching] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [selectAcross, setSelectAcross] = useState({selected:false,unSelected:[]})

  //table state
  const [selectAllState, setSelectAllState] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [rowCount, setRowCount] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
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

  const checkAll = e => {
    console.log(e.target.checked);

    setSelectAcross({
      selected: e.target.checked,
      unSelected: []
    })

    // handleSelectAllClick(e)
  }
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
  useEffect(() => {
    setData(props?.friendsData)
    console.log('props.friendsData', props.friendsData);
  }, [props.friendsData]);

  // useEffect(() => {
  //   console.log('selectAcross :::',  selectAcross);
  // }, [selectAcross])


  useEffect(() => {
    console.log('useEFFCT');
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
          page_number: pagination.pageIndex+1,
          page_size: pagination.pageSize,
          search_string: textFilter,
          friend_status: "Activate",
          deleted_status: 0,
        }
    
        let response = await fetchFriendList2(queryParam)
      

        response = response.data[0]; 
        console.log("data list batch",response);
        setRowCount(response.friend_count)
        setData(response.friend_details);

        console.log('response.friend_details', response.friend_details, 'selectAcross >>>', selectAcross);
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

    const debouncedFetchData = helper.debounce(fetchData,200);
    debouncedFetchData();
    


  }, [
    textFilter,
    //columnFilters,
    //globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'friendName', //simple recommended way to define a column
        header: 'Name',
       // //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false, //disable a feature for this column
        Cell: ({ renderedCellValue, row }) => {
          return (
         <UnlinkedNameCellWithOptionsRenderer value={renderedCellValue} data={row.original}/>
        )}
      },
      {
        accessorKey: 'friendGender', //simple recommended way to define a column
        header: 'Gender',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <GenderRenderer value={renderedCellValue} data={row.original}/>
        )} ,
        filterFn: 'equals',
        filterSelectOptions: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select'
      },
      {
        accessorKey: 'created_at', //simple recommended way to define a column
        header: 'Age',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false, 
        Cell: ({ renderedCellValue, row }) => {
          return (
         <AgeRenderer value={renderedCellValue} data={row.original}/>
        )},
      },
      {
        accessorKey: 'country', //simple recommended way to define a column
        header: 'Country',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <CountryRenderer value={renderedCellValue} data={row.original}/>
        )} 
      },
      {
        accessorKey: 'reactionThread', //simple recommended way to define a column
        header: 'Total Reaction',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false, 
        Cell: ({ renderedCellValue, row }) => {
          return (
         <ReactionRenderer value={renderedCellValue} data={row.original}/>
        )}//disable a feature for this column
      },
      {
        accessorKey: 'commentThread', //simple recommended way to define a column
        header: 'Total Comment',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <CommentRenderer value={renderedCellValue} data={row.original}/>
        )} //disable a feature for this column
      },
      {
        accessorKey: 'engagement', //simple recommended way to define a column
        header: 'Engagement',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false, 
        Cell: ({ renderedCellValue, row }) => {
          return (
         <EngagementRenderer value={renderedCellValue} data={row.original}/>
        )}//disable a feature for this column
      },
      {
        accessorKey: 'message_thread', //simple recommended way to define a column
        header: 'Message Count',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false, 
        Cell: ({ renderedCellValue, row }) => {
          return (
         <MessageRenderer value={renderedCellValue} data={row.original}/>
        )}
      },
      {
        accessorKey: 'last_engagement_date', //simple recommended way to define a column
        header: 'Recent Engagement',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <RecentEngagementRenderer value={renderedCellValue} data={row.original}/>
        )}
      },
      {
        accessorKey: 'keywords', //simple recommended way to define a column
        header: 'Keyword(s)',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <KeywordRenderer value={renderedCellValue} data={row.original}/>
        )}
      },
      {
        accessorKey: 'finalSource', //simple recommended way to define a column
        header: 'Source',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
          return (
         <SourceRendererPending value={renderedCellValue} data={row.original}/>
        )}
      },
    ],
    [],
  );

  //light or dark white
  const baseBackgroundColor =
    theme.palette.mode === 'dark'
      ? 'rgb(40, 44, 52)'
      : 'rgb(40, 44, 52)';

  //pass table options to useMaterialReactTable
  const table = useMaterialReactTable({
    columns,
    data,
    getRowId:(originalRow) => originalRow.friendFbId,
    enableRowSelection: true,
    enableSelectAll: true,
    selectAllMode : "page",
    enableTopToolbar: false,
    enableBottomToolbar: true,
    enableColumnResizing: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnActions:false,
     columnFilterDisplayMode: 'popover',
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
    onRowSelectionChange: (selectedRows)=>{
      //console.log("srows ->",selectedRows);
      setRowSelection(selectedRows)},
    onSortingChange: setSorting,
    rowCount,
    state: {
      rowSelection,
      columnFilters,
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '5px',
      },
    },
    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontWeight: 'normal',
        fontSize: '14px',
        color: 'white',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      //conditionally style selected rows
      sx: {
        fontWeight: row.getIsSelected() ? 'bold' : 'normal',
        color:  'white',
      },
    }),
    muiTableBodyCellProps: ({ column }) => ({
      //conditionally style pinned columns
      sx: {
        fontWeight: column.getIsPinned() ? 'bold' : 'normal',
        color:  'white',
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
    muiTableBodyProps: {
      sx: (theme) => ({
        table: {
          height: "100% !important",
          borderCollapse: "collapse",
        },
        thead:{
          flex: `0 0 auto`,
        },
        tbody:{
          display: "block",
          flex: `1 1 auto !important`,
          overflowY: "auto !important",
        },
        '& td': {
          height: `40px !important`,
        },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.1),
        },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.2),
        },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.1),
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
      color: "primary",
      rowsPerPageOptions: [10, 15, 20, 30, 60, 90, 180],
      shape: "circular",
      variant: "outlined"
    }
  })


  //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
  //but the useMaterialReactTable hook will be the most recommended way to define table options
  return (<div className="react-table-container">
    <input 
        type='checkbox'
       value={selectAcross?.selected}
       onChange={(e)=>checkAll(e)}
  />
    <MaterialReactTable table={table} />
  </div>);
}
