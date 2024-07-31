import {
  CampaignCreationRenderer,
  UnlinkedNameCellRenderer,
} from "../../../listing/FriendListColumns";
import {
  CampaignFriendMessageRenderer,
  CampaignFriendStatusRenderer,
  CampaignNameCellRenderer,
  CampaignStatusCellRenderer,
  CampaignFriendsCountCellRenderer,
  CampaignFriendsPendingCellRenderer,
  CampaignScheduleCellRenderer,
  CampaignEndTimeCellRenderer,
  CampaignContextMenuCellRenderer
} from "../../../messages/campaigns/CampaignListingColumns";
import { CommonColDefs } from "./CommonColDefs";
const { Name, Keyword, Source } = CommonColDefs;
const addTooltipToHeader = (header, tooltipText) => (
  <div className="fr-ls-tooltip">
    <span>{header}</span>
    <span className="tooltiptext">{tooltipText}</span>
  </div>
);
export const campaignUserColumnDefs = () => {
  const columns = [
    {
      ...Name,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <UnlinkedNameCellRenderer
            value={renderedCellValue}
            data={row.original}
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableHiding: false,
      enableColumnFilter: false,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <CampaignFriendStatusRenderer
            value={renderedCellValue}
            data={row.original}
          />
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message  ",
      enableHiding: false,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <CampaignFriendMessageRenderer
            value={renderedCellValue}
            data={row.original}
          />
        );
      },
    },
    Keyword,
    Source,
    {
      accessorKey: "created_at",
      enableHiding: false,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <CampaignCreationRenderer
            value={renderedCellValue}
            data={row.original}
          />
        );
      },
      header: addTooltipToHeader(
        "Friend added date & time",
        "Friend added to Campaign Date & Time"
      ),
    },
  ];
  return columns.map((col) => ({
    ...col,
    muiTableHeadCellProps: {
      className: col.accessorKey + `-header-class`,
    },
    muiTableBodyCellProps: {
      className: col.accessorKey + `-cell-class`,
    },
  }));
};

// Campaign Column Definitions for React Material Table
// #region Campaign Columns
export const campaignColumnDefs = () => {
  const columns = [
    {
      accessorKey: 'campaign_name', //simple recommended way to define a column
      header: 'Campaign name',
      enableHiding: false,
      enableColumnFilter: false,
      layoutMode: 'grid-no-grow',
      grow: 1,
      enableColumnResizing: false,
      muiTableHeadCellProps: {
          className: `campaign_name-header-class`,
      },
      muiTableBodyCellProps: {
          className: `campaign_name--cell-class`,
      },
      Cell: ({ renderedCellValue, row }) => {
          return (
              <CampaignNameCellRenderer value={renderedCellValue} data={row.original} />
          )
      },
    },

    {
      accessorKey: 'status', //simple recommended way to define a column
        header: 'Status',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        layoutMode: 'grid-no-grow',
        grow: 1,
        enableColumnResizing: false,
        muiTableHeadCellProps: {
            className: `status-header-class`,
        },
        muiTableBodyCellProps: {
            className: `status--cell-class`,
        },
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignStatusCellRenderer value={renderedCellValue} data={row.original} />
            )
        },
    },

    {
      accessorKey: 'friends_added',
        header: 'Friends added',
        enableHiding: false,
        enableColumnFilter: false,
        layoutMode: 'grid-no-grow',
        grow: 1,
        enableColumnResizing: false,
        muiTableHeadCellProps: {
            className: `friends_added-header-class`,
        },
        muiTableBodyCellProps: {
            className: `friends_added--cell-class`,
        },
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignFriendsCountCellRenderer value={renderedCellValue} data={row.original} />
            )
        },
    },

    {
      accessorKey: 'friends_pending', //simple recommended way to define a column
      header: 'Pending',
      enableHiding: false,
      enableColumnFilter: false,
      layoutMode: 'grid-no-grow',
      grow: 1,
      enableColumnResizing: false,
      muiTableHeadCellProps: {
          className: `friends_pending-header-class`,
      },
      muiTableBodyCellProps: {
          className: `friends_pending--cell-class`,
      },
      Cell: ({ renderedCellValue, row }) => {
          return (
              <CampaignFriendsPendingCellRenderer value={renderedCellValue} data={row.original} />
          )
      }
    },

    {
      accessorKey: 'campaign_id', //simple recommended way to define a column
      header: 'Scheduled on',
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      layoutMode: 'grid-no-grow',
      grow: 1,
      enableColumnResizing: false,
      muiTableHeadCellProps: {
          className: `scheduled-header-class`,
      },
      muiTableBodyCellProps: {
          className: `scheduled--cell-class`,
      },
      Cell: ({ renderedCellValue, row }) => {
          return (
              <CampaignScheduleCellRenderer value={renderedCellValue} data={row.original} />
          )
      }
    },

    {
      accessorKey: 'campaign_end_time', //simple recommended way to define a column
      header: 'End date & time',
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      layoutMode: 'grid-no-grow',
      grow: 1,
      enableColumnResizing: false,
      muiTableHeadCellProps: {
          className: `campaign_end_time-header-class`,
      },
      muiTableBodyCellProps: {
          className: `campaign_end_time--cell-class`,
      },
      Cell: ({ renderedCellValue, row }) => {
          return (
              <CampaignEndTimeCellRenderer value={renderedCellValue} data={row.original} />
          )
      }
    },
    {
      accessorKey: '_id', //simple recommended way to define a column
      header: '',
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      layoutMode: 'grid-no-grow',
      grow: 1,
      enableColumnResizing: false,
      muiTableHeadCellProps: {
          className: `context_menu-header-class`,
      },
      muiTableBodyCellProps: {
          className: `context_menu--cell-class`,
      },
      Cell: ({ renderedCellValue, row }) => {
          return (
              <CampaignContextMenuCellRenderer value={renderedCellValue} data={row.original} />
          )
      }
    }
  ];

  return columns.map((col) => ({
    ...col,
    muiTableHeadCellProps: {
      className: col.accessorKey + `-header-class`,
    },
    muiTableBodyCellProps: {
      className: col.accessorKey + `-cell-class`,
    },
  }));
};
