import { useDispatch, useSelector } from "react-redux";
 
import Listing from "../../components/common/Listing";
import {
  CreationRenderer,
  KeywordRenderer,
  RequestRenderer,
  GeneralNameCellRenderer,
  SourceRenderer,
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { getSendFriendReqst } from "../../actions/FriendsAction";
import Modal from "../../components/common/Modal";

const SendRequest = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const friendsList = useSelector(
    (state) => state.facebook_data.send_friend_request_list
  );

  // const [friendsList,setFriendsList]=useState(fr_req_send_list)
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));

    console.log("pending list:::::::::::::::::::::", friendsList);
  }, [dispatch, friendsList]);

  useEffect(() => {
    // setFriendsList(fr_req_send_list)
    dispatch(
      getSendFriendReqst({
        fbUserId: localStorage.getItem("fr_default_fb"),
      })
    )
      .unwrap()
      .then((res) => {
        console.log("the friend request send list", res);
      });
  }, []);

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionFilteredOnly: true,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: GeneralNameCellRenderer,
      minWidth: 220,
      maxWidth: 320,
    },
    // {
    //     field: "email",
    //     headerName: "Email",
    //     //filter: "agTextColumnFilter",
    //     cellRenderer: EmailRenderer,
    //    // lockPosition: "right",
    //     filterParams: {
    //       buttons: ["apply", "reset"],
    //       suppressMiniFilter: true,
    //       closeOnApply: true,
    //       filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //     },
    //   },
    // {
    //   field: "gender",
    //   headerName: "Gender",
    //  // filter: "agTextColumnFilter",
    //   cellRenderer: GenderRenderer,
    //   //   lockPosition: "right",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   },
    // },
    {
      field: "groupName" ? "groupName" : "finalSource",
      headerName: "Source",
      //filter: "agTextColumnFilter",
      cellRenderer: SourceRenderer,
      // lockPosition: "right",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    // {
    //   field: "request_send_count",
    //   headerName: "Request Sent",
    //   // filter: "agTextColumnFilter",
    //   cellRenderer: RequestRenderer,
    //   // lockPosition: "right",
    //   // filterParams: {
    //   //   buttons: ["apply", "reset"],
    //   //   suppressMiniFilter: true,
    //   //   closeOnApply: true,
    //   //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   // },
    // },
    {
      field: "keywords",
      headerName: "Keyword",
      // filter: "agTextColumnFilter",
      cellRendererParams: {
        setKeyWords,
        setModalOpen,
      },
      cellRenderer: KeywordRenderer,
      // lockPosition: "right",
      // filterParams: {
      //   buttons: ["apply", "reset"],
      //   suppressMiniFilter: true,
      //   closeOnApply: true,
      //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      // },
    },
    {
      field: "created_at",
      headerName: "Request Sent Date &  Time",
      cellRenderer: CreationRenderer,
      minWidth: 240,
      maxWidth: 250,
      filter: "agDateColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
          "inRange",
        ],
      },
    },
  ];
  // useEffect(() => {
  //   console.log("//////////////", keyWords);
  // }, [keyWords]);
  return (
    <div className="main-content-inner d-flex d-flex-column">
      {modalOpen && (
        <Modal
          modalType="normal-type"
          modalIcon={null}
          headerText={"Keywords"}
          bodyText={
            <>
              {keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword ? 
                keyWords?.matchedKeyword.map((el, i) =>
                (<span className={`sync-box-wrap`} key={`key-${i}`}>
                  {el}
                </span>)
              ) : (
                "No specific keyword used"
              )}
              </>
          }
          open={modalOpen}
          setOpen={setModalOpen}
          ModalFun={null}
          btnText={" "}
        />
      )}
      {friendsList?.length > 0 && (
        <>
          {!loading && (
            <Listing
              friendsData={friendsList}
              friendsListingRef={friendsListinRef}
            />
          )}
        </>
      )}
      {loading ? (
        <ListingLoader />
      ) : (
        friendsList?.length <= 0 && <NoDataFound />
      )}
    </div>
  );
};

export default SendRequest;
