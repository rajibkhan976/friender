import { history } from "./history";
import moment from "moment";

export const utils = {
    /**
     * Get query string form url
     * @param {*} variable
     */
    getQueryVariable: (variable) => {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
        return false;
    },
    /**
     * Add query parameter
     */
    addQueryParameter: (param, value) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set(param, value);
        history.push(
            window.location.pathname + "?" + currentUrlParams.toString()
        );
    },
    /**
     * Remove query parameter
     */
    removeQueryParameter: (param) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.delete(param);
        history.push(
            window.location.pathname + "?" + currentUrlParams.toString()
        );
    },
    /**
     * Format time
     * @param {*} secs 
     * @returns 
     */
    formatSecondsAsTime: (secs) => {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));

        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        if (isNaN(min)) {
            min = "0"
        }
        if (isNaN(sec)) {
            sec = "0"
        }

        return min + ':' + sec;
    },
    /**
     * Generate excerpt
     * @param {*} str 
     * @returns 
     */
    generateExcerpt: (str) => {
        return (str.length > 12) ? str.substr(0, 12) + '...' : str;
    },
    //Capitalize first letter
    capitalizeFirst: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    standardDateFormat: (date) => {
        return moment(date).format("MM/DD/YYYY");
    },
    getFormattedExpiryDate: (date) => {
        let formattedCardExpairy = date.replace(/[^\d]/g, "");
        formattedCardExpairy = formattedCardExpairy.substring(0, 6);

        var cardExpairySectionsMonth = formattedCardExpairy.slice(0, 2);
        var cardExpairySectionsYear = formattedCardExpairy.slice(2, 6);

        if (cardExpairySectionsMonth > 0 && cardExpairySectionsYear > 0) {
            formattedCardExpairy =
                cardExpairySectionsMonth + "/" + cardExpairySectionsYear;
        } else if (formattedCardExpairy <= 2) {
            formattedCardExpairy = cardExpairySectionsMonth;
        }

        return formattedCardExpairy;
    },
    convertUTCToTimezone(utcDt, timezone = null, dateFormat = "LLL") {
        const formattedDate = moment(utcDt).format(dateFormat);
        if(!timezone) return formattedDate;
        return moment.utc(formattedDate, null).tz(timezone).format(dateFormat);
    },
    convertTimezoneToUTC(date, timezone = null, dateFormat = "LLL") {
        const formattedDate = moment(date).format(dateFormat);
        if(!timezone) return formattedDate;
        return moment(formattedDate).tz(timezone).utc().format(dateFormat);
    }

}