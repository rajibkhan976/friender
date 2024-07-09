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
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignNameCellRenderer value={renderedCellValue} data={row.original} />
            )
        },
        // columnFilterModeOptions: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'empty', 'notEmpty'],
        // renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode }) => [
        //     <MenuItem
        //       key="fuzzy"
        //       onClick={() => onSelectFilterMode('fuzzy')}
        //     >
        //       Fuzzy Filter
        //     </MenuItem>,
        //   ],
    },
    Status: {
        accessorKey: 'status', //simple recommended way to define a column
        header: 'Status',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignStatusCellRenderer value={renderedCellValue} data={row.original} />
            )
        },
        columnFilterModeOptions: ['equals'],
        filterSelectOptions: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select'
    },
    FriendsAdded: {
        accessorKey: 'friends_added',
        header: 'Friends added',
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignFriendsCountCellRenderer value={renderedCellValue} data={row.original} />
            )
        },
        columnFilterModeOptions: ['equals', 'lessThan', 'greaterThan']
    },
    Pending: {
        accessorKey: 'friends_pending', //simple recommended way to define a column
        header: 'Pending',
        enableHiding: false,
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith'],
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
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignScheduleCellRenderer value={renderedCellValue} data={row.original} />
            )
        }
    },
    EndDateNTime: {
        accessorKey: 'campaign_end_time', //simple recommended way to define a column
        header: 'End date & time',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignEndTimeCellRenderer value={renderedCellValue} data={row.original} />
            )
        }
    },
    Actions: {
        accessorKey: '_id', //simple recommended way to define a column
        header: '',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CampaignContextMenuCellRenderer value={renderedCellValue} data={row.original} />
            )
        }
    },
};
