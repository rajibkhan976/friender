import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { darken, useTheme } from "@mui/material";
import { fetchFriendList2 } from "../../../services/friends/FriendListServices";
import { useSelector } from "react-redux";
import helper from "../../../helpers/helper";
import apiClient from "../../../services";
import "./style/listingStyles.scss";

export default function Listing2(props) {
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

  useEffect(() => {
    console.log("rowSelection", rowSelection);
  }, [rowSelection]);

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
  const fetchData = async (
    paginationData,
    globalFilter,
    filteronColumn,
    filteronColumnFns
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
        const { values, fields, operators } = helper.listFilterParamsGenerator(
          filteronColumn,
          filteronColumnFns
        );
        queryParam["values"] = JSON.stringify(values);
        queryParam["fields"] = JSON.stringify(fields);
        queryParam["operators"] = JSON.stringify(operators);
        queryParam["filter"] = 1;
      }

      console.log("sorting---outi :::>>>", sorting);
      if (sorting.length > 0) {
        console.log("sorting--- :::>>>", sorting);
        queryParam["sort_by"] = sorting[0].id;
        queryParam["sort_order"] = sorting[0].desc ? "desc" : "asc";
      }
      //console.log("queryParam____>>", queryParam);

      let response = await apiClient(
        "get",
        `${props.baseUrl}`,
        {},
        { ...queryParam }
      );
      // let response = await fetchFriendList2(queryParam);
      const { data, count } = props.dataExtractor(response);
      //console.log("data list batch____>>", data,count);
      setRowCount(count);
      setData(data);

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
      debouncedFetchData(
        pagination,
        textFilter,
        columnFilters,
        columnFilterFns
      );
    }
  }, [textFilter, columnFilters, columnFilterFns, sorting]);
  useEffect(() => {
    //console.log("pagination", pagination);
    fetchData(pagination, textFilter, columnFilters, columnFilterFns);
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(props.listColDef, [props.listColDef]);

  //light or dark white
  //light or dark white
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "rgb(40, 44, 52)" : "#000000";

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
    columnFilterDisplayMode: "popover",
    enableColumnFilterModes: true,
    manualFiltering: true,
    enableSorting: true,
    // manualSorting: true,
    //enableMultiSort:true,
    //pagination setting start
    enablePagination: true,
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
      console.log(":::::", selectedRows());
      setRowSelection(selectedRows);
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

    //pagination setting end
    //styling props
    muiTableContainerProps: { className: "mui-table-container" },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "5px",
      },
    },

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

    muiTableHeadProps: {
      // Customizing table head cells
      sx: {
        "& .MuiTableCell-root": {
          borderBottom: "none",
        },
        "& .MuiTableSortLabel-root": {
          color: "#ffffff", // Change color of sort label text
        },
      },
    },

    muiTableHeadCellProps: {
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontWeight: "normal",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        height: "50px !important",

        // Table Heading's Icons Color..
        "& .MuiTableSortLabel-icon": {
          color: "#ffffff !important", // Sort icon color
        },

        // Table Heading's Icons Color..
        // Checkbox Icon on Header..
        "& .MuiSvgIcon-root": {
          color: "#B3B3BF",
          height: "25px",
          width: "25px",
          borderRadius: "5px",
        },
        // Checked Situation on header checkbox
        "& .Mui-checked .MuiSvgIcon-root": {
          color: "#1976d2",
          backgroundColor: "none",
        },
        // Interminate Situation on header checkbox
        "& .MuiCheckbox-indeterminate .MuiSvgIcon-root": {
          color: "#1976d2",
          backgroundColor: "none",
        },

        "& .MuiCheckbox-root": {
          color: "#0094FF",
          backgroundColor: "none",
        },

        // Other Icons on Header..
        "& .MuiSvgIcon-root:first-child": {
          // marginRight: '10px',
          // marginLeft: '10px',
          color: "#ffffff",
        },
        "& span": {
          color: "#ffffff",
        },
      },
    },

    // Body Styling
    muiTableBodyRowProps: ({ row }) => ({
      //conditionally style selected rows
      sx: {
        fontWeight: row.getIsSelected() ? "bold" : "normal",
        color: "white",
      },
    }),

    muiTableBodyCellProps: ({ column }) => ({
      //conditionally style pinned columns
      sx: {
        fontWeight: column.getIsPinned() ? "bold" : "normal",
        color: "white",
        borderBottom: "none",
        marginBottom: "3px",
      },
    }),

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
        "& td": {
          height: `50px !important`,
        },
        "& tr": {
          padding: "1.5px",
        },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            // backgroundColor: darken(baseBackgroundColor, 0.1),
            backgroundColor: "#1c1c1e",
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            // backgroundColor: darken(baseBackgroundColor, 0.1),
            backgroundColor: "#1c1c1e",
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
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
        color: "#0094FF",
        "& .MuiSvgIcon-root": {
          color: "#B3B3BF",
          height: "25px",
          width: "25px",
          borderRadius: "5px",
        },
        "&.Mui-checked .MuiSvgIcon-root": {
          color: "#0094FF",
          backgroundColor: "none",
        },
      },
    },

    // Rows per page area..
    // Bottom pagination and page numbers area..
    muiBottomToolbarProps: {
      className: "mui-table-footer",

      sx: {
        "& .MuiBox-root": {
          className: "mui-table-footer",
          position: "relative",
          justifyContent: "center",
        },

        "& .MuiTablePagination-root": {
          color: "#ffffff",
          border: "none",
          boxShadow: "none",
          display: "flex",
          flexDirection: "row-reverse",

          // The Pagination bars wrapper..
          // '& .MuiPagination-root': {
          //   marginRight: '10px',
          // }

          // '&.Mui-selected': {
          //   backgroundColor: '#1c1c1e',
          //   color: '#ffffff',
          // },
          // '&.Mui-selected:hover': {
          //   backgroundColor: '#1c1c1e',
          //   color: '#ffffff',
          // },
          // '&.Mui-disabled': {
          //   backgroundColor: '#1c1c1e',
          //   color: '#ffffff',
          // },
          // '&.Mui-disabled:hover': {
          //   backgroundColor: '#1c1c1e',
          //   color: '#ffffff',
          // },
        },

        // Row Page Numbers Section..
        "& .MuiInputBase-root": {
          className: "mui-footer-rows-per-page-input",
          // right: '-25rem',
          backgroundColor: "#1C1C1E",
          padding: "0 10px",
          borderRadius: "5px",
        },

        // Text Style..
        "& .MuiFormLabel-root": {
          // color: '#ffffff',
          display: "none",
        },
        // Input Style..
        "& .MuiInput-root": {
          color: "#ffffff",
        },
        // Icon Style..
        "& .MuiSelect-iconStandard": {
          color: "#ffffff",
        },
      },
    },

    // Pagination Specific Area..
    muiPaginationProps: {
      rowsPerPageOptions: [15, 30, 60, 90, 180],
      sx: {
        color: "primary",
        shape: "circular",
        variant: "outlined",

        "& .MuiPaginationItem-root": {
          color: "#8998B8", // Change this to your desired color for pagination numbers
        },
        "& .MuiPaginationItem-page.Mui-selected": {
          backgroundColor: "#1976d2", // Change this to your desired color for selected page numbers
          color: "#ffffff !important",
        },
        "& .MuiTablePagination-root": {
          color: "#8998B8", // Change this to your desired color for "Rows per page" text
        },
        "& .MuiSelect-select": {
          color: "#8998B8", // Change this to your desired color for dropdown numbers
        },
        "& .MuiMenuItem-root": {
          color: "#8998B8", // Change this to your desired color for dropdown menu items
        },
        "& .MuiInputBase-root": {
          color: "#fffffff !important",
        },
      },
    },

    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

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
