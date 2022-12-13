import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { updateNumberofListing } from "../../actions/FriendListAction";
import { getFriendList } from "../../actions/FriendsAction";
import { fetchUserProfile } from "../../services/authentication/facebookData";

const Friends = () => {
  // :::: This is the parent component for all Type of Friend List::::
  useEffect(() => {
    getFbUserId();
  }, []);
  const dispatch = useDispatch();

  const getFbUserId = async () => {
    try {
      let savedFbUId = localStorage.getItem("fr_default_fb");

      if (savedFbUId) {
        console.log("DEFAULT FB ID:::", savedFbUId);
      } else {
        const getCurrentFbProfile = await fetchUserProfile();
        if (getCurrentFbProfile) {
          console.log("got saved from cloud");
          savedFbUId = localStorage.setItem(
            "fr_default_fb",
            getCurrentFbProfile[0].fb_user_id
          );
        }
      }

      dispatch(
        getFriendList({
          // token: localStorage.getItem("fr_token"),
          fbUserId: savedFbUId,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.data[0].friend_details.length > 0) {
            dispatch(
              updateNumberofListing(
                response.data[0].friend_details.filter(
                  (item) => item.deleted_status !== 1
                ).length
              )
            );
          } else {
            console.log("here");
            dispatch(updateNumberofListing(0));
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Outlet />
    </>
  );
};

export default Friends;
