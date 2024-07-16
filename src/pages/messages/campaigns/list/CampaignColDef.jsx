import {
    CampaignNameCellRenderer,
    CampaignStatusCellRenderer,
    CampaignFriendsCountCellRenderer,
    CampaignScheduleCellRenderer,
    CampaignEndTimeCellRenderer,
    CampaignContextMenuCellRenderer,
    CampaignFriendsPendingCellRenderer,
} from "../../../../components/messages/campaigns/CampaignListingColumns";

export const CampaignColDef = {
    CampaignName: {
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
    Status: {
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
    FriendsAdded: {
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
    Pending: {
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
    ScheduledOn: {
        accessorKey: '_id', //simple recommended way to define a column
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
    EndDateNTime: {
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
    Actions: {
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
    },
};
