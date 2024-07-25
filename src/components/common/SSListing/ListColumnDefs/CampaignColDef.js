import { CampaignCreationRenderer, UnlinkedNameCellRenderer } from "../../../listing/FriendListColumns";
import { CampaignFriendMessageRenderer, CampaignFriendStatusRenderer } from "../../../messages/campaigns/CampaignListingColumns";
import { CommonColDefs } from "./CommonColDefs";
const {
    Name,
    Keyword,
    Source,
  } = CommonColDefs;
  const addTooltipToHeader = (header, tooltipText) => (
    <div className="fr-ls-tooltip">
      <span>{header}</span>
      <span className="tooltiptext">{tooltipText}</span>
    </div>
  );
export const campaignUserColumnDefs = ()=>{
    const columns  = [
        {
            ...Name,
            Cell: ({ renderedCellValue, row }) => {
              return (
                  <UnlinkedNameCellRenderer value={renderedCellValue} data={row.original} />
              )
        }},
         {
            accessorKey: 'status',
            header: 'Status',
            enableHiding: false,
            enableColumnFilter: false,
            Cell: ({ renderedCellValue, row }) => {
                return (
                    <CampaignFriendStatusRenderer value={renderedCellValue} data={row.original} />
                )
            },
           
        },
         {
            accessorKey: 'message',
            header: 'Message  ',
            enableHiding: false,
            enableColumnFilter: false,
            enableSorting: false,
            Cell: ({ renderedCellValue, row }) => {
                return (
                    <CampaignFriendMessageRenderer value={renderedCellValue} data={row.original} />
                )
            },
        },
        Keyword,
        Source,
        {
            accessorKey: 'created_at',
            enableHiding: false,
            Cell: ({ renderedCellValue, row }) => {
                return (
                    <CampaignCreationRenderer value={renderedCellValue} data={row.original} />
                )
            },
            header:addTooltipToHeader("Friend added date & time","Friend added to Campaign Date & Time")
        }
    ]
    return columns.map(col => ({
        ...col,
        muiTableHeadCellProps: {
          className: col.accessorKey+`-header-class`
        },
        muiTableBodyCellProps: {
          className: col.accessorKey + `-cell-class`
        },
      }));
};