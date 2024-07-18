import { UnlinkedNameCellRenderer } from "../../../listing/FriendListColumns";
import { CommonColDefs } from "./CommonColDefs";

import {
  CSVAArrowIcon,
  FriendsFriendIcon,
  GroupIcon,
  IncomingIcon,
  IncomingRequest,
  OutgoingIcon,
  PostIcon,
  SuggestFriendIcon,
  SyncIcon,
} from "../../../..//assets/icons/Icons";

const addTooltipToHeader = (header, tooltipText) => (
  <div className="fr-ls-tooltip">
    <span>{header}</span>
    <span className="tooltiptext">{tooltipText}</span>
  </div>
);
const sourceTooltipToHeader = (header) => (
  <div className="fr-ls-tooltip">
    <span>{header}</span>
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
      </ul>
    </div>
  </div>
);

const countryTooltipRenderer = (header) => (
  <div className="fr-ls-tooltip">
    <span>{header}</span>
    <div
      className="header-tooltip-content"
      style={{
        width: "111px",
        minWidth: "111px",
        maxWidth: "111px",
        padding: "8px 16px",
      }}
    >
      <ul className="country-tier">
        <li>
          <span className="tier-icon">
            <svg
              width="24"
              height="14"
              viewBox="0 0 24 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79199 0.281799V2.2984H3.72559V0.281799H4.79199ZM4.66211 11.4449V13.2838H3.5957V11.4449H4.66211ZM5.41406 9.2027C5.41406 8.94293 5.36621 8.7219 5.27051 8.53961C5.17936 8.35732 5.02897 8.19554 4.81934 8.05426C4.61426 7.91298 4.33626 7.77627 3.98535 7.6441C3.3929 7.41624 2.87109 7.1747 2.41992 6.91949C1.97331 6.65973 1.62467 6.33844 1.37402 5.95563C1.12337 5.56826 0.998047 5.07835 0.998047 4.4859C0.998047 3.9208 1.13249 3.43089 1.40137 3.01617C1.67025 2.60146 2.04167 2.28245 2.51562 2.05914C2.99414 1.83128 3.55013 1.71735 4.18359 1.71735C4.66667 1.71735 5.10417 1.79026 5.49609 1.9361C5.88802 2.07737 6.22526 2.28701 6.50781 2.565C6.79036 2.83844 7.00684 3.1734 7.15723 3.56989C7.30762 3.96637 7.38281 4.41982 7.38281 4.93024H5.4209C5.4209 4.6568 5.39128 4.41526 5.33203 4.20563C5.27279 3.99599 5.1862 3.82054 5.07227 3.67926C4.96289 3.53798 4.83073 3.43317 4.67578 3.36481C4.52083 3.29189 4.34993 3.25543 4.16309 3.25543C3.88509 3.25543 3.65723 3.31012 3.47949 3.41949C3.30176 3.52887 3.17188 3.67698 3.08984 3.86383C3.01237 4.04612 2.97363 4.25576 2.97363 4.49274C2.97363 4.72516 3.01465 4.92796 3.09668 5.10114C3.18327 5.27431 3.33138 5.43382 3.54102 5.57965C3.75065 5.72093 4.03776 5.86676 4.40234 6.01715C4.99479 6.24502 5.51432 6.49111 5.96094 6.75543C6.40755 7.01976 6.75618 7.34332 7.00684 7.72614C7.25749 8.10895 7.38281 8.59658 7.38281 9.18903C7.38281 9.77692 7.24609 10.2782 6.97266 10.6929C6.69922 11.1031 6.31641 11.4175 5.82422 11.6363C5.33203 11.8505 4.76237 11.9576 4.11523 11.9576C3.69596 11.9576 3.27897 11.9029 2.86426 11.7935C2.44954 11.6796 2.07357 11.4973 1.73633 11.2466C1.39909 10.996 1.13021 10.6633 0.929688 10.2486C0.729167 9.82933 0.628906 9.31435 0.628906 8.70367H2.59766C2.59766 9.03636 2.64095 9.31435 2.72754 9.53766C2.81413 9.75641 2.92806 9.93186 3.06934 10.064C3.21517 10.1916 3.37923 10.2828 3.56152 10.3375C3.74382 10.3922 3.92839 10.4195 4.11523 10.4195C4.4069 10.4195 4.64616 10.3671 4.83301 10.2623C5.02441 10.1575 5.16797 10.0139 5.26367 9.8316C5.36393 9.64476 5.41406 9.43512 5.41406 9.2027ZM12.8311 0.281799V2.2984H11.7646V0.281799H12.8311ZM12.7012 11.4449V13.2838H11.6348V11.4449H12.7012ZM13.4531 9.2027C13.4531 8.94293 13.4053 8.7219 13.3096 8.53961C13.2184 8.35732 13.068 8.19554 12.8584 8.05426C12.6533 7.91298 12.3753 7.77627 12.0244 7.6441C11.432 7.41624 10.9102 7.1747 10.459 6.91949C10.0124 6.65973 9.66374 6.33844 9.41309 5.95563C9.16243 5.56826 9.03711 5.07835 9.03711 4.4859C9.03711 3.9208 9.17155 3.43089 9.44043 3.01617C9.70931 2.60146 10.0807 2.28245 10.5547 2.05914C11.0332 1.83128 11.5892 1.71735 12.2227 1.71735C12.7057 1.71735 13.1432 1.79026 13.5352 1.9361C13.9271 2.07737 14.2643 2.28701 14.5469 2.565C14.8294 2.83844 15.0459 3.1734 15.1963 3.56989C15.3467 3.96637 15.4219 4.41982 15.4219 4.93024H13.46C13.46 4.6568 13.4303 4.41526 13.3711 4.20563C13.3118 3.99599 13.2253 3.82054 13.1113 3.67926C13.002 3.53798 12.8698 3.43317 12.7148 3.36481C12.5599 3.29189 12.389 3.25543 12.2021 3.25543C11.9242 3.25543 11.6963 3.31012 11.5186 3.41949C11.3408 3.52887 11.2109 3.67698 11.1289 3.86383C11.0514 4.04612 11.0127 4.25576 11.0127 4.49274C11.0127 4.72516 11.0537 4.92796 11.1357 5.10114C11.2223 5.27431 11.3704 5.43382 11.5801 5.57965C11.7897 5.72093 12.0768 5.86676 12.4414 6.01715C13.0339 6.24502 13.5534 6.49111 14 6.75543C14.4466 7.01976 14.7952 7.34332 15.0459 7.72614C15.2965 8.10895 15.4219 8.59658 15.4219 9.18903C15.4219 9.77692 15.2852 10.2782 15.0117 10.6929C14.7383 11.1031 14.3555 11.4175 13.8633 11.6363C13.3711 11.8505 12.8014 11.9576 12.1543 11.9576C11.735 11.9576 11.318 11.9029 10.9033 11.7935C10.4886 11.6796 10.1126 11.4973 9.77539 11.2466C9.43815 10.996 9.16927 10.6633 8.96875 10.2486C8.76823 9.82933 8.66797 9.31435 8.66797 8.70367H10.6367C10.6367 9.03636 10.68 9.31435 10.7666 9.53766C10.8532 9.75641 10.9671 9.93186 11.1084 10.064C11.2542 10.1916 11.4183 10.2828 11.6006 10.3375C11.7829 10.3922 11.9674 10.4195 12.1543 10.4195C12.446 10.4195 12.6852 10.3671 12.8721 10.2623C13.0635 10.1575 13.207 10.0139 13.3027 9.8316C13.403 9.64476 13.4531 9.43512 13.4531 9.2027ZM20.8701 0.281799V2.2984H19.8037V0.281799H20.8701ZM20.7402 11.4449V13.2838H19.6738V11.4449H20.7402ZM21.4922 9.2027C21.4922 8.94293 21.4443 8.7219 21.3486 8.53961C21.2575 8.35732 21.1071 8.19554 20.8975 8.05426C20.6924 7.91298 20.4144 7.77627 20.0635 7.6441C19.471 7.41624 18.9492 7.1747 18.498 6.91949C18.0514 6.65973 17.7028 6.33844 17.4521 5.95563C17.2015 5.56826 17.0762 5.07835 17.0762 4.4859C17.0762 3.9208 17.2106 3.43089 17.4795 3.01617C17.7484 2.60146 18.1198 2.28245 18.5938 2.05914C19.0723 1.83128 19.6283 1.71735 20.2617 1.71735C20.7448 1.71735 21.1823 1.79026 21.5742 1.9361C21.9661 2.07737 22.3034 2.28701 22.5859 2.565C22.8685 2.83844 23.085 3.1734 23.2354 3.56989C23.3857 3.96637 23.4609 4.41982 23.4609 4.93024H21.499C21.499 4.6568 21.4694 4.41526 21.4102 4.20563C21.3509 3.99599 21.2643 3.82054 21.1504 3.67926C21.041 3.53798 20.9089 3.43317 20.7539 3.36481C20.599 3.29189 20.4281 3.25543 20.2412 3.25543C19.9632 3.25543 19.7354 3.31012 19.5576 3.41949C19.3799 3.52887 19.25 3.67698 19.168 3.86383C19.0905 4.04612 19.0518 4.25576 19.0518 4.49274C19.0518 4.72516 19.0928 4.92796 19.1748 5.10114C19.2614 5.27431 19.4095 5.43382 19.6191 5.57965C19.8288 5.72093 20.1159 5.86676 20.4805 6.01715C21.0729 6.24502 21.5924 6.49111 22.0391 6.75543C22.4857 7.01976 22.8343 7.34332 23.085 7.72614C23.3356 8.10895 23.4609 8.59658 23.4609 9.18903C23.4609 9.77692 23.3242 10.2782 23.0508 10.6929C22.7773 11.1031 22.3945 11.4175 21.9023 11.6363C21.4102 11.8505 20.8405 11.9576 20.1934 11.9576C19.7741 11.9576 19.3571 11.9029 18.9424 11.7935C18.5277 11.6796 18.1517 11.4973 17.8145 11.2466C17.4772 10.996 17.2083 10.6633 17.0078 10.2486C16.8073 9.82933 16.707 9.31435 16.707 8.70367H18.6758C18.6758 9.03636 18.7191 9.31435 18.8057 9.53766C18.8923 9.75641 19.0062 9.93186 19.1475 10.064C19.2933 10.1916 19.4574 10.2828 19.6396 10.3375C19.8219 10.3922 20.0065 10.4195 20.1934 10.4195C20.485 10.4195 20.7243 10.3671 20.9111 10.2623C21.1025 10.1575 21.2461 10.0139 21.3418 9.8316C21.4421 9.64476 21.4922 9.43512 21.4922 9.2027Z"
                fill="#49CE56"
              />
            </svg>
          </span>
          <span className="country-name">Tier 1</span>
        </li>
        <li>
          <span className="tier-icon">
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79199 0.281799V2.2984H3.72559V0.281799H4.79199ZM4.66211 11.4449V13.2838H3.5957V11.4449H4.66211ZM5.41406 9.2027C5.41406 8.94293 5.36621 8.7219 5.27051 8.53961C5.17936 8.35732 5.02897 8.19554 4.81934 8.05426C4.61426 7.91298 4.33626 7.77627 3.98535 7.6441C3.3929 7.41624 2.87109 7.1747 2.41992 6.91949C1.97331 6.65973 1.62467 6.33844 1.37402 5.95563C1.12337 5.56826 0.998047 5.07835 0.998047 4.4859C0.998047 3.9208 1.13249 3.43089 1.40137 3.01617C1.67025 2.60146 2.04167 2.28245 2.51562 2.05914C2.99414 1.83128 3.55013 1.71735 4.18359 1.71735C4.66667 1.71735 5.10417 1.79026 5.49609 1.9361C5.88802 2.07737 6.22526 2.28701 6.50781 2.565C6.79036 2.83844 7.00684 3.1734 7.15723 3.56989C7.30762 3.96637 7.38281 4.41982 7.38281 4.93024H5.4209C5.4209 4.6568 5.39128 4.41526 5.33203 4.20563C5.27279 3.99599 5.1862 3.82054 5.07227 3.67926C4.96289 3.53798 4.83073 3.43317 4.67578 3.36481C4.52083 3.29189 4.34993 3.25543 4.16309 3.25543C3.88509 3.25543 3.65723 3.31012 3.47949 3.41949C3.30176 3.52887 3.17188 3.67698 3.08984 3.86383C3.01237 4.04612 2.97363 4.25576 2.97363 4.49274C2.97363 4.72516 3.01465 4.92796 3.09668 5.10114C3.18327 5.27431 3.33138 5.43382 3.54102 5.57965C3.75065 5.72093 4.03776 5.86676 4.40234 6.01715C4.99479 6.24502 5.51432 6.49111 5.96094 6.75543C6.40755 7.01976 6.75618 7.34332 7.00684 7.72614C7.25749 8.10895 7.38281 8.59658 7.38281 9.18903C7.38281 9.77692 7.24609 10.2782 6.97266 10.6929C6.69922 11.1031 6.31641 11.4175 5.82422 11.6363C5.33203 11.8505 4.76237 11.9576 4.11523 11.9576C3.69596 11.9576 3.27897 11.9029 2.86426 11.7935C2.44954 11.6796 2.07357 11.4973 1.73633 11.2466C1.39909 10.996 1.13021 10.6633 0.929688 10.2486C0.729167 9.82933 0.628906 9.31435 0.628906 8.70367H2.59766C2.59766 9.03636 2.64095 9.31435 2.72754 9.53766C2.81413 9.75641 2.92806 9.93186 3.06934 10.064C3.21517 10.1916 3.37923 10.2828 3.56152 10.3375C3.74382 10.3922 3.92839 10.4195 4.11523 10.4195C4.4069 10.4195 4.64616 10.3671 4.83301 10.2623C5.02441 10.1575 5.16797 10.0139 5.26367 9.8316C5.36393 9.64476 5.41406 9.43512 5.41406 9.2027ZM12.8311 0.281799V2.2984H11.7646V0.281799H12.8311ZM12.7012 11.4449V13.2838H11.6348V11.4449H12.7012ZM13.4531 9.2027C13.4531 8.94293 13.4053 8.7219 13.3096 8.53961C13.2184 8.35732 13.068 8.19554 12.8584 8.05426C12.6533 7.91298 12.3753 7.77627 12.0244 7.6441C11.432 7.41624 10.9102 7.1747 10.459 6.91949C10.0124 6.65973 9.66374 6.33844 9.41309 5.95563C9.16243 5.56826 9.03711 5.07835 9.03711 4.4859C9.03711 3.9208 9.17155 3.43089 9.44043 3.01617C9.70931 2.60146 10.0807 2.28245 10.5547 2.05914C11.0332 1.83128 11.5892 1.71735 12.2227 1.71735C12.7057 1.71735 13.1432 1.79026 13.5352 1.9361C13.9271 2.07737 14.2643 2.28701 14.5469 2.565C14.8294 2.83844 15.0459 3.1734 15.1963 3.56989C15.3467 3.96637 15.4219 4.41982 15.4219 4.93024H13.46C13.46 4.6568 13.4303 4.41526 13.3711 4.20563C13.3118 3.99599 13.2253 3.82054 13.1113 3.67926C13.002 3.53798 12.8698 3.43317 12.7148 3.36481C12.5599 3.29189 12.389 3.25543 12.2021 3.25543C11.9242 3.25543 11.6963 3.31012 11.5186 3.41949C11.3408 3.52887 11.2109 3.67698 11.1289 3.86383C11.0514 4.04612 11.0127 4.25576 11.0127 4.49274C11.0127 4.72516 11.0537 4.92796 11.1357 5.10114C11.2223 5.27431 11.3704 5.43382 11.5801 5.57965C11.7897 5.72093 12.0768 5.86676 12.4414 6.01715C13.0339 6.24502 13.5534 6.49111 14 6.75543C14.4466 7.01976 14.7952 7.34332 15.0459 7.72614C15.2965 8.10895 15.4219 8.59658 15.4219 9.18903C15.4219 9.77692 15.2852 10.2782 15.0117 10.6929C14.7383 11.1031 14.3555 11.4175 13.8633 11.6363C13.3711 11.8505 12.8014 11.9576 12.1543 11.9576C11.735 11.9576 11.318 11.9029 10.9033 11.7935C10.4886 11.6796 10.1126 11.4973 9.77539 11.2466C9.43815 10.996 9.16927 10.6633 8.96875 10.2486C8.76823 9.82933 8.66797 9.31435 8.66797 8.70367H10.6367C10.6367 9.03636 10.68 9.31435 10.7666 9.53766C10.8532 9.75641 10.9671 9.93186 11.1084 10.064C11.2542 10.1916 11.4183 10.2828 11.6006 10.3375C11.7829 10.3922 11.9674 10.4195 12.1543 10.4195C12.446 10.4195 12.6852 10.3671 12.8721 10.2623C13.0635 10.1575 13.207 10.0139 13.3027 9.8316C13.403 9.64476 13.4531 9.43512 13.4531 9.2027Z"
                fill="#F29339"
              />
            </svg>
          </span>
          <span className="country-name">Tier 2</span>
        </li>
        <li>
          <span className="tier-icon">
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79199 0.281799V2.2984H3.72559V0.281799H4.79199ZM4.66211 11.4449V13.2838H3.5957V11.4449H4.66211ZM5.41406 9.2027C5.41406 8.94293 5.36621 8.7219 5.27051 8.53961C5.17936 8.35732 5.02897 8.19554 4.81934 8.05426C4.61426 7.91298 4.33626 7.77627 3.98535 7.6441C3.3929 7.41624 2.87109 7.1747 2.41992 6.91949C1.97331 6.65973 1.62467 6.33844 1.37402 5.95563C1.12337 5.56826 0.998047 5.07835 0.998047 4.4859C0.998047 3.9208 1.13249 3.43089 1.40137 3.01617C1.67025 2.60146 2.04167 2.28245 2.51562 2.05914C2.99414 1.83128 3.55013 1.71735 4.18359 1.71735C4.66667 1.71735 5.10417 1.79026 5.49609 1.9361C5.88802 2.07737 6.22526 2.28701 6.50781 2.565C6.79036 2.83844 7.00684 3.1734 7.15723 3.56989C7.30762 3.96637 7.38281 4.41982 7.38281 4.93024H5.4209C5.4209 4.6568 5.39128 4.41526 5.33203 4.20563C5.27279 3.99599 5.1862 3.82054 5.07227 3.67926C4.96289 3.53798 4.83073 3.43317 4.67578 3.36481C4.52083 3.29189 4.34993 3.25543 4.16309 3.25543C3.88509 3.25543 3.65723 3.31012 3.47949 3.41949C3.30176 3.52887 3.17188 3.67698 3.08984 3.86383C3.01237 4.04612 2.97363 4.25576 2.97363 4.49274C2.97363 4.72516 3.01465 4.92796 3.09668 5.10114C3.18327 5.27431 3.33138 5.43382 3.54102 5.57965C3.75065 5.72093 4.03776 5.86676 4.40234 6.01715C4.99479 6.24502 5.51432 6.49111 5.96094 6.75543C6.40755 7.01976 6.75618 7.34332 7.00684 7.72614C7.25749 8.10895 7.38281 8.59658 7.38281 9.18903C7.38281 9.77692 7.24609 10.2782 6.97266 10.6929C6.69922 11.1031 6.31641 11.4175 5.82422 11.6363C5.33203 11.8505 4.76237 11.9576 4.11523 11.9576C3.69596 11.9576 3.27897 11.9029 2.86426 11.7935C2.44954 11.6796 2.07357 11.4973 1.73633 11.2466C1.39909 10.996 1.13021 10.6633 0.929688 10.2486C0.729167 9.82933 0.628906 9.31435 0.628906 8.70367H2.59766C2.59766 9.03636 2.64095 9.31435 2.72754 9.53766C2.81413 9.75641 2.92806 9.93186 3.06934 10.064C3.21517 10.1916 3.37923 10.2828 3.56152 10.3375C3.74382 10.3922 3.92839 10.4195 4.11523 10.4195C4.4069 10.4195 4.64616 10.3671 4.83301 10.2623C5.02441 10.1575 5.16797 10.0139 5.26367 9.8316C5.36393 9.64476 5.41406 9.43512 5.41406 9.2027Z"
                fill="#FF6A77"
              />
            </svg>
          </span>
          <span className="country-name">Tier 3</span>
        </li>
      </ul>
    </div>
  </div>
);

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

// #region Friendlist ColDefs
export const FriendlistColDefs = (inactiveAfter) => {
  const columns = [
    {
      ...Name,
      header: addTooltipToHeader("Name", "Name")
    },
  { ...Gender, header: addTooltipToHeader("Gender", "Gender") },
  {
    ...Age,
    header: addTooltipToHeader(
      "Age",
      `Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n`
    ),
  },
  {
    ...Country,
    header: countryTooltipRenderer("Country"),
  },
  {
    ...FrindShip,
    header: addTooltipToHeader(
      "Friendship",
      `This section showcases all\n kinds of friendship statuses.`
    ),
    enableColumnFilter: false,
  },
  {
    ...TotalReaction,
    header: addTooltipToHeader("Total Reaction", "Reactions"),
  },
  { ...TotalComment, header: addTooltipToHeader("Total Comment", "Comments") },
  {
    ...Engagement,
    header: addTooltipToHeader("Engagement", "Total Engagement"),
  },
  { ...MessageCount, header: addTooltipToHeader("Message Count", "Messages") },
  {
    ...RecentEngagement(inactiveAfter),
    header: addTooltipToHeader("Recent Engagement", "Recent Engagement"),
  },
  {
    ...Keyword,
    header: addTooltipToHeader("Keyword(s)", "Matched Keywords"),
  },
  { ...Source, header: sourceTooltipToHeader("Source") },
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

// #region Lost Friends List
export const LostFriendlistColDefs = (inactiveAfter) => {
  const columns = [
    // {
    //   ...Name,
    //   Cell: ({ renderedCellValue, row }) => {
    //     return (
    //       <UnlinkedNameCellRenderer value={renderedCellValue} data={row.original} />
    //     )
    //   },

    // },
    {
      ...Name,
      header: addTooltipToHeader("Name", "Name")
    },Name,
    { ...Gender, header: addTooltipToHeader("Gender", "Gender") },
    {
      ...Age,
      header: addTooltipToHeader(
        "Age",
        `Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n`
      ),
    },
    {
      ...Country,
      header: countryTooltipRenderer("Country"),
    },
    {
      ...FrindShip,
      header: addTooltipToHeader(
        "Friendship",
        `This section showcases all\n kinds of friendship statuses.`
      ),
      enableColumnFilter: false,
    },
    {
      ...TotalReaction,
      header: addTooltipToHeader("Total Reaction", "Reactions"),
    },
    { ...TotalComment, header: addTooltipToHeader("Total Comment", "Comments") },
    {
      ...Engagement,
      header: addTooltipToHeader("Engagement", "Total Engagement"),
    },
    { ...MessageCount, header: addTooltipToHeader("Message Count", "Messages") },
    {
      ...RecentEngagement(inactiveAfter),
      header: addTooltipToHeader("Recent Engagement", "Recent Engagement"),
    },
    {
      ...Keyword,
      header: addTooltipToHeader("Keyword(s)", "Matched Keywords"),
    },
    { ...Source, header: sourceTooltipToHeader("Source") },
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

// #region White List
export const WhiteAndBlacklistContactlistColDefs = (inactiveAfter) => {
  const columns = [
    {
      ...Name,
      header: addTooltipToHeader("Name", "Name")
    },
  { ...Gender, header: addTooltipToHeader("Gender", "Gender") },
  {
    ...Age,
    header: addTooltipToHeader(
      "Age",
      `Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n`
    ),
  },
  {
    ...Country,
    header: countryTooltipRenderer("Country"),
  },
  {
    ...FrindShip,
    header: addTooltipToHeader(
      "Friendship",
      `This section showcases all\n kinds of friendship statuses.`
    ),
  },
  {
    ...TotalReaction,
    header: addTooltipToHeader("Total Reaction", "Reactions"),
  },
  { ...TotalComment, header: addTooltipToHeader("Total Comment", "Comments") },
  {
    ...Engagement,
    header: addTooltipToHeader("Engagement", "Total Engagement"),
  },
  { ...MessageCount, header: addTooltipToHeader("Message Count", "Messages") },
  {
    ...RecentEngagement(inactiveAfter),
    header: addTooltipToHeader("Recent Engagement", "Recent Engagement"),
  },
  {
    ...Keyword,
    header: addTooltipToHeader("Keyword(s)", "Matched Keywords"),
  },
  { ...Source, header: sourceTooltipToHeader("Source") },
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

// #region Global Contact List
export const GlobalContactlistColDefs = (inactiveAfter) => {
  const columns =  [
  {
    ...Name,
    header: addTooltipToHeader("Name", "Name")
  },
  { ...Gender, header: addTooltipToHeader("Gender", "Gender") },
  {
    ...Age,
    header: addTooltipToHeader(
      "Age",
      `Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n`
    ),
  },
  {
    ...Country,
    header: countryTooltipRenderer("Country"),
  },
  {
    ...FrindShip,
    header: addTooltipToHeader(
      "Friendship",
      `This section showcases all\n kinds of friendship statuses.`
    ),
    // enableColumnFilter: false,
  },
  {
    ...TotalReaction,
    header: addTooltipToHeader("Total Reaction", "Reactions"),
  },
  { ...TotalComment, header: addTooltipToHeader("Total Comment", "Comments") },
  {
    ...Engagement,
    header: addTooltipToHeader("Engagement", "Total Engagement"),
  },
  { ...MessageCount, header: addTooltipToHeader("Message Count", "Messages") },
  {
    ...RecentEngagement(inactiveAfter),
    header: addTooltipToHeader("Recent Engagement", "Recent Engagement"),
  },
  {
    ...Keyword,
    header: addTooltipToHeader("Keyword(s)", "Matched Keywords"),
  },
  { ...Source, header: sourceTooltipToHeader("Source") },
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