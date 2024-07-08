import { CommonColDefs } from "./CommonColDefs";

const {
  Name,
  Gender,
  Age,
  Country,
  TotalReaction,
  TotalComment,
  Engagement,
  MessageCount,
  RecentEngagement,
  Keyword,
  Source,
} = CommonColDefs;

export const FriendlistColDefs = () => {
  return [
    Name,
    Gender,
    Age,
    Country,
    TotalReaction,
    TotalComment,
    Engagement,
    MessageCount,
    RecentEngagement,
    Keyword,
    Source,
  ];
};
