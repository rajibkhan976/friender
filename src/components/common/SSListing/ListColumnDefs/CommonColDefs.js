import { AgeRenderer, CommentRenderer, CountryRenderer, EngagementRenderer, FriendShipStatusRenderer, GenderRenderer, KeywordRenderer, MessageRenderer, ReactionRenderer, RecentEngagementRenderer, SourceRendererPending, UnlinkedNameCellWithOptionsRenderer } from "../../../listing/FriendListColumns";

export const CommonColDefs = {
    Name: {
        accessorKey: 'friendName', //simple recommended way to define a column
        header: 'Name',
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <UnlinkedNameCellWithOptionsRenderer value={renderedCellValue} data={row.original} />
            )
        },
        columnFilterModeOptions: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'empty', 'notEmpty'],
        // renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode }) => [
        //     <MenuItem
        //       key="fuzzy"
        //       onClick={() => onSelectFilterMode('fuzzy')}
        //     >
        //       Fuzzy Filter
        //     </MenuItem>,
        //   ],
    },
    FrindShip: {
        accessorKey: 'friendship', //simple recommended way to define a column
        header: 'Friendship',
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <FriendShipStatusRenderer value={renderedCellValue} data={row.original} />
            )
        },
        filterVariant: 'multi-select',
        filterSelectOptions: [
            { label: 'Friend', value: 1 },
            { label: 'Unfriended', value: 2 },
            { label: 'Lost Friend', value: 3 },
            { label: 'Non Friend', value: 4 },
        ],
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Friendship',
            className: 'fr-filter-friendship'
        },
        enableColumnFilter: true,
        enableColumnFilterModes: false,
        filterFns:'equals',
        filterSelectProps: {
            classes: {
                root: 'fr-checkbox',
            },
        },
      //  columnFilterModeOptions: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'empty', 'notEmpty'],
        // renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode }) => [
        //     <MenuItem
        //       key="fuzzy"
        //       onClick={() => onSelectFilterMode('fuzzy')}
        //     >
        //       Fuzzy Filter
        //     </MenuItem>,
        //   ],
    },
    Gender: {
        accessorKey: 'friendGender', //simple recommended way to define a column
        header: 'Gender',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <GenderRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Gender'
        },
        columnFilterModeOptions: ['equals'],
        enableColumnFilterModes: false,
        filterSelectOptions: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select'
    },
    Age: {
        accessorKey: 'age',
        header: 'Age',
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <AgeRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Age' 
        },
        columnFilterModeOptions: ['equals', 'lessThan', 'greaterThan']
    },
    Country: {
        accessorKey: 'country', //simple recommended way to define a column
        header: 'Country',
        enableHiding: false,
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CountryRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Country' 
        },
        enableColumnFilterModes: true,
    },
    TotalReaction: {
        accessorKey: 'reactionThread', //simple recommended way to define a column
        header: 'Total Reaction',
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan','greaterThanOrEqualTo','lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <ReactionRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Reactions' 
        },
    },
    TotalComment: {
        accessorKey: 'commentThread', //simple recommended way to define a column
        header: 'Total Comment',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan','greaterThanOrEqualTo','lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CommentRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Comments' 
        },
    },
    Engagement: {
        accessorKey: 'total_engagement', //simple recommended way to define a column
        header: 'Engagement',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan','greaterThanOrEqualTo','lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <EngagementRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Total Engagement' 
        },
    },
    MessageCount: {
        accessorKey: 'message_thread', //simple recommended way to define a column
        header: 'Message Count',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: [ 'lessThan', 'greaterThan','greaterThanOrEqualTo','lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <MessageRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Message Count' 
        },
    },
    RecentEngagement: (inactiveAfter)=>{
        return({
            accessorKey: 'last_engagement_date', //simple recommended way to define a column
            header: 'Recent Engagement',
            //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
            enableHiding: false,
            columnFilterModeOptions: [ 'lessThan', 'greaterThan','greaterThanOrEqualTo','lessThanOrEqualTo'],
            Cell: ({ renderedCellValue, row }) => {
                return (
                    <RecentEngagementRenderer value={renderedCellValue} data={{...row.original}} inactiveAfter={inactiveAfter} />
                )
            },
            muiFilterTextFieldProps: { 
                placeholder: 'Filter by Recent Engagement' 
            },
        })   
    },
    Keyword: {
        accessorKey: 'matchedKeyword', //simple recommended way to define a column
        header: 'Keyword(s)',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['contains'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <KeywordRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Keywords' 
        },
    },
    Source: {
        accessorKey: 'source', //simple recommended way to define a column
        header: 'Source',
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <SourceRendererPending value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: { 
            placeholder: 'Filter by Sourcename' 
        },
    }
};