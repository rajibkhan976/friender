import { useDispatch, useSelector } from "react-redux";
 
import Listing from "../../components/common/Listing";
import {
  AgeRenderer,
  CreationRenderer,
  GenderRenderer,
  KeywordRenderer,
  SourceRenderer,
  UnlinkedNameCellRenderer,
  CountryRenderer,
  CountryTierRenderer,
  SourceRendererPending,
  RefriendCountRenderer
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { getSendFriendReqst } from "../../actions/FriendsAction";
import Modal from "../../components/common/Modal";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";


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

  /**
   * Custom comparator for columns with dates
   *
   * @returns updated array which is descending / ascending / default
   */
  const dateComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
    let valA = new Date(nodeA.data.created_at);
    let valB = new Date(nodeB.data.created_at);
    
    return valB - valA
  }

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: false,
      checkboxSelection: false,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionFilteredOnly: false,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: UnlinkedNameCellRenderer,
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
      field: "gender",
      headerName: "Gender ",
      filter: "agTextColumnFilter",
      cellRenderer: GenderRenderer,
      // lockPosition: "right",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    {
      field: "created_at",
      headerName:"Age"  ,
      valueGetter: AgeRenderer,
      headerTooltip:"Age",
      tooltipComponent: CustomHeaderTooltip,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      comparator: dateComparator,
    },
    {
      field: "country",
      headerName: "Country Name",
      filter: "agTextColumnFilter",
      cellRenderer: CountryRenderer,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    {
      field: "tier",
      headerName: "Country Tier",
      filter: "agTextColumnFilter",
      cellRenderer: CountryTierRenderer,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    {
      field: "refriending_attempt",
      headerName: "# Re-friending",
      filter: "agNumberColumnFilter",
      cellRenderer: RefriendCountRenderer,
    },
    {
      field: "keywords",
      headerName: "Keyword",
      // filter: "agTextColumnFilter",
      cellRendererParams: {
        setKeyWords,
        setModalOpen,
      },
      cellRenderer: KeywordRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        filterOptions: ["contains"], // Set filter options to match any part of the text
        valueGetter: params => {
          return params?.data?.matchedKeyword
        },
        textCustomComparator: function (filter, value, filterText) {
          const matchedKeywords = value.split(", "); // Split matched keywords by comma
    
          if (filter === "equals") {
            // Exact match
            return matchedKeywords.includes(filterText);
          } else {
            // Partial match
            return matchedKeywords.some(keyword => keyword.includes(filterText));
          }
        },
      },
      // lockPosition: "right",
      // filterParams: {
      //   buttons: ["apply", "reset"],
      //   suppressMiniFilter: true,
      //   closeOnApply: true,
      //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      // },
    },
    {
      field: "groupName" ? "groupName" : "finalSource",
      headerName: "Friends source",
      filter: "agTextColumnFilter",
      headerTooltip: 'Friends source',
      tooltipComponent: CustomHeaderTooltip,
      cellRenderer: SourceRendererPending,
      // lockPosition: "right",
      minWidth: 185,
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
      field: "created_at",
      headerName: "Request date &  time",
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
    <div className="main-content-inner fff d-flex d-flex-column">
      {modalOpen && (
        <Modal
          modalType="normal-type"
          modalIcon={null}
          headerText={"Keyword(s)"}
          bodyText={
            <>
              {keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword ? 
                keyWords?.matchedKeyword.map((el, i) =>
                (<span className={`tags positive-tags`} key={`key-${i}`}>
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
          modalButtons={false}
          additionalClass="modal-keywords"
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
