import { memo } from "react";
import { CalendarIcon } from "../../assets/icons/Icons";

const CreationRenderer = (params) => {
    const statusSync = params.value.toLowerCase();
    const syncDate = statusSync.split(' ')[0];
    const syncTime = statusSync.split(' ')[1];

    return (
      <span className={`sync-date d-flex f-align-center`}>
        <figure className={`sync-ico text-center`}>
            <CalendarIcon />
        </figure>
        <span className={`sync-dt`}>{syncDate}</span>
        <span className={`sync-tm`}>{syncTime}</span>
      </span>
    )
  }

  export default memo(CreationRenderer);