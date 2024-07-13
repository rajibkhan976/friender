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
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignContextMenuCellRenderer value={renderedCellValue} data={row.original} />
            )
        }
    },
};
