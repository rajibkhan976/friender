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
  const columns = [
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
export const LostFriendlistColDefs = () => {
  const columns = [
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

export const GlobalContactlistColDefs = () => {
  const columns =  [
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
