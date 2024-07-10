import { FriendQueueRecordsNameRenderer, MessageGroupRequestAcceptedRenderer, MessageGroupRequestSentRenderer } from "../../../listing/FriendListColumns";
import { CommonColDefs } from "./CommonColDefs";

const {
  Name,
  Keyword,
  Source,
} = CommonColDefs;

export const FriendsQueueColDef = () => {
  return [
    {...Name,
      Cell:({ renderedCellValue, row }) => {
        return (
            <FriendQueueRecordsNameRenderer value={renderedCellValue} data={row.original} />
        )
        
    }
    },
    {
			accessorKey: "message_group_request_sent",
			header: "Message group: when friend request is sent",
      size:360,
			Cell: ({ renderedCellValue, row }) => {
        return (
            <MessageGroupRequestSentRenderer value={renderedCellValue} data={row.original} />
        )
        
    }
		},
		{
			accessorKey: "message_group_request_accepted",
			header: "Message group: when friend request is accepted",
      size:400,
      Cell: ({ renderedCellValue, row }) => {
        return (
            <MessageGroupRequestAcceptedRenderer value={renderedCellValue} data={row.original} />
        )
    }
		},
    Keyword,
    Source,
  ];
};