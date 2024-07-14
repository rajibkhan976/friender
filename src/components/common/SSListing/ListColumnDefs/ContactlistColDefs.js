import { UnlinkedNameCellRenderer } from "../../../listing/FriendListColumns";
import { CommonColDefs } from "./CommonColDefs";

const {
  Name,
  Gender,
  Age,
  Country,
  FrindShip,
  TotalReaction,
  TotalComment,
  Engagement,
  MessageCount,
  RecentEngagement,
  Keyword,
  Source
} = CommonColDefs;

export const FriendlistColDefs = () => {
  return [
    Name,
    Gender,
    {
    ...FrindShip,
    enableColumnFilter: false,
    },
    Age,
    Country,
    TotalReaction,
    TotalComment,
    Engagement,
    MessageCount,
    RecentEngagement,
    Keyword,
    Source
  ];
};
export const LostFriendlistColDefs = () => {
  return [
    {
      ...Name,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <UnlinkedNameCellRenderer value={renderedCellValue} data={row.original} />
        )
      },

    },
    Gender,
    FrindShip,
    Age,
    Country,
    TotalReaction,
    TotalComment,
    Engagement,
    MessageCount,
    RecentEngagement,
    Keyword,
    Source
  ];
};

export const GlobalContactlistColDefs = () => {
  return [
    Name,
    Gender,
    FrindShip,
    Age,
    Country,
    TotalReaction,
    TotalComment,
    Engagement,
    MessageCount,
    RecentEngagement,
    Keyword,
    Source
  ];
};
