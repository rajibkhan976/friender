import { MenuItem } from "@mui/material";
import { ReactComponent as TooltipIcon } from "../../../../assets/images/grey-query-icon.svg";
import { AgeRenderer, CommentRenderer, CountryRenderer, EngagementRenderer, FriendShipStatusRenderer, GenderRenderer, KeywordRenderer, MessageRenderer, ReactionRenderer, RecentEngagementRenderer, RefriendCountRenderer, SourceRendererPending, UnlinkedNameCellWithOptionsRenderer } from "../../../listing/FriendListColumns";
import { CSVAArrowIcon, FriendsFriendIcon, GroupIcon, IncomingIcon, IncomingRequest, OutgoingIcon, PostIcon, SuggestFriendIcon, SyncIcon, PostEngagementBorderedIcon, FbBorderedIcon } from "../../../../assets/icons/Icons";

const notContainsFilterFn = (row, id, filterValue) => {
    console.log(!row.getValue(id).toLowerCase().includes(filterValue.toLowerCase()));
    return !row.getValue(id).toLowerCase().includes(filterValue.toLowerCase());
};

const addTooltipToHeader = (header, tooltipText) => (
    <div className="fr-ls-tooltip">
        <span>{header}</span>
        <span className="tooltiptext">{tooltipText}</span>
    </div>
);

const sourceTooltipToHeader = (header, showTooltipicon = false) => (
    <div className="fr-ls-tooltip">
        <span>
            {header}
            {showTooltipicon && <TooltipIcon style={{ verticalAlign: "middle" }} />}
        </span>
        <div
            className="header-tooltip-content tooltip"
            style={{
                width: "268px",
            }}
        >
            <ul>
                <li>
                    <span>
                        {" "}
                        <OutgoingIcon />
                    </span>{" "}
                    Outgoing
                </li>
                <li>
                    <span>
                        <IncomingIcon />
                    </span>
                    Incoming
                </li>
                <li>
                    <span>
                        <SyncIcon />
                    </span>
                    Sync
                </li>
                <li>
                    <span>
                        {/* <SourceCsvIcon /> */}
                        <CSVAArrowIcon />
                    </span>
                    CSV Upload
                </li>
                <li>
                    <span>
                        <GroupIcon />
                    </span>
                    Request from group
                </li>
                <li>
                    <span>
                        {" "}
                        <IncomingRequest />
                    </span>
                    Incoming request
                </li>

                <li>
                    <span>
                        {" "}
                        <FriendsFriendIcon />
                    </span>{" "}
                    Request from friends friend
                </li>
                <li>
                    <span>
                        {" "}
                        <SuggestFriendIcon />
                    </span>{" "}
                    Request from suggested friends
                </li>
                <li>
                    <span>
                        {" "}
                        <PostIcon />
                    </span>{" "}
                    Request from post
                </li>

                <li>
                    <span>
                        {" "}
                        <PostEngagementBorderedIcon />
                    </span>{" "}
                    Post Engagement
                </li>

                <li>
                    <span>
                        {" "}
                        <FbBorderedIcon />
                    </span>{" "}
                    FB UI
                </li>
            </ul>
        </div>
    </div>
);

export const CommonColDefs = {
    Name: {
        accessorKey: 'friendName', //simple recommended way to define a column
        header: addTooltipToHeader("Name", "Name"),
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => {
            return (
                <UnlinkedNameCellWithOptionsRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Name',
        },
        columnFilterModeOptions: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'empty', 'notEmpty'],
        renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode, table }) => {
            return [
                <MenuItem
                    key="1"
                    onClick={() => onSelectFilterMode('contains')}
                >
                    <div>Contains</div>
                </MenuItem>,
                <MenuItem
                    key="2"
                    onClick={() => onSelectFilterMode('equals')}
                >
                    <div>Equals</div>
                </MenuItem>,
                <MenuItem
                    key="3"
                    onClick={() => onSelectFilterMode('notEquals')}
                >
                    <div>Not Equals</div>
                </MenuItem>,
                <MenuItem
                    key="4"
                    onClick={() => onSelectFilterMode('startsWith')}
                >
                    <div>Starts With</div>
                </MenuItem>,
                <MenuItem
                    key="5"
                    onClick={() => onSelectFilterMode('endsWith')}
                >
                    <div>Ends With</div>
                </MenuItem>,
                <MenuItem
                    key="6"
                    onClick={() => onSelectFilterMode('empty')}
                >
                    <div>Blank</div>
                </MenuItem>,
                <MenuItem
                    key="7"
                    onClick={() => onSelectFilterMode('notEmpty')}
                >
                    <div>Not Blank</div>
                </MenuItem>,
                <MenuItem
                    key="8"
                    onClick={() => onSelectFilterMode('notContains')}
                >
                    <div>Not Contains</div>
                </MenuItem>,
            ]
        }
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
            { label: 'Lost', value: 3 },
            { label: 'Non friend', value: 4 },
        ],
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Friendship',
            className: 'fr-filter-friendship'
        },
        enableColumnFilter: true,
        enableColumnFilterModes: false,
        filterFns: 'equals',
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
            placeholder: 'Filter by Gender',
            className: 'fr-filter-gender'
        },
        columnFilterModeOptions: ['equals'],
        enableColumnFilterModes: false,
        filterSelectOptions: [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Neuter', value: 'Neuter' },
            { label: 'NA', value: 'NA' },
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
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith', 'notContains'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <CountryRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Country'
        },
        enableColumnFilterModes: true,
        renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode, table }) => {
            return [
                <MenuItem
                    key="1"
                    onClick={() => onSelectFilterMode('contains')}
                >
                    <div>Contains</div>
                </MenuItem>,
                <MenuItem
                    key="2"
                    onClick={() => onSelectFilterMode('startsWith')}
                >
                    <div>Starts With</div>
                </MenuItem>,
                <MenuItem
                    key="3"
                    onClick={() => onSelectFilterMode('endsWith')}
                >
                    <div>Ends With</div>
                </MenuItem>,
                <MenuItem
                    key="4"
                    onClick={() => onSelectFilterMode('notContains')}
                >
                    <div>Not Contains</div>
                </MenuItem>,
            ]
        }
    },
    TotalReaction: {
        accessorKey: 'reactionThread', //simple recommended way to define a column
        header: 'Total Reaction',
        enableHiding: false,
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
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
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
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
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
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
        columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <MessageRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Message Count'
        },
    },
    RecentEngagement: (inactiveAfter) => {
        return ({
            accessorKey: 'last_engagement_date', //simple recommended way to define a column
            header: 'Recent Engagement',
            //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
            enableHiding: false,
            columnFilterModeOptions: ['lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
            Cell: ({ renderedCellValue, row }) => {
                return (
                    <RecentEngagementRenderer value={renderedCellValue} data={{ ...row.original }} inactiveAfter={inactiveAfter} />
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
        header: sourceTooltipToHeader("Source", true),
        //muiTableHeadCellProps: { style: { color: 'white' } }, //custom props
        enableHiding: false,
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith', 'notContains'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <SourceRendererPending value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Sourcename'
        },
        renderColumnFilterModeMenuItems: ({ column, onSelectFilterMode, table }) => {
            return [
                <MenuItem
                    key="1"
                    onClick={() => onSelectFilterMode('contains')}
                >
                    <div>Contains</div>
                </MenuItem>,
                <MenuItem
                    key="2"
                    onClick={() => onSelectFilterMode('startsWith')}
                >
                    <div>Starts With</div>
                </MenuItem>,
                <MenuItem
                    key="3"
                    onClick={() => onSelectFilterMode('endsWith')}
                >
                    <div>Ends With</div>
                </MenuItem>,
                <MenuItem
                    key="4"
                    onClick={() => onSelectFilterMode('notContains')}
                >
                    <div>Not Contains</div>
                </MenuItem>,
            ]
        }
    },
    Refrending: {
        accessorKey: 'refriending_attempt', //simple recommended way to define a column
        header: '# Re-friending',
        enableHiding: false,
        columnFilterModeOptions: ['equals', 'notEquals', 'empty', 'notEmpty', 'lessThan', 'greaterThan', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'],
        Cell: ({ renderedCellValue, row }) => {
            return (
                <RefriendCountRenderer value={renderedCellValue} data={row.original} />
            )
        },
        muiFilterTextFieldProps: {
            placeholder: 'Filter by Refriending'
        },
    }
};

export const filterFns = {
    notContains: notContainsFilterFn,
};