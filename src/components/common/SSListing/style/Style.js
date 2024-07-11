import { darken } from "@mui/material";


export const MuiListStyleProps = (theme) => {
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "rgb(40, 44, 52)" : "#000000";

  return {
    //pagination setting end
    //styling props
    muiTableContainerProps: { className: "mui-table-container" },
    muiTablePaperProps: {
      className: 'mui-table-paper',
      elevation: 0,
      sx: {
        borderRadius: "10px",
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
      className: 'mui-table-head',
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
      className: 'mui-table-head-cell',
      //simple styling with the `sx` prop, works just like a style prop in this example
      sx: {
        fontWeight: "normal",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        height: "50px !important",

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
      className: 'mui-table-body',
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
          position: "relative",
          justifyContent: "center",

          '& .MuiBox-root': {
            bottom: '18px',
          },

          '& .MuiInputBase-root': {
            position: 'fixed',
            right: '5rem',
            marginTop: '35px'
          }
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
  }

}