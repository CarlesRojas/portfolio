import React, { useState, createContext, useRef, useEffect } from "react";

// Utils Context
export const Utils = createContext();

const UtilsProvider = (props) => {
    // #######################################
    //      COOKIES
    // #######################################

    // Set a cookie
    const setCookie = (name, value, expirationDays = 10) => {
        var date = new Date();
        date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    // Get a cookie
    const getCookie = (name) => {
        var cookieName = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var splittedCookie = decodedCookie.split(";");
        for (var i = 0; i < splittedCookie.length; i++) {
            var c = splittedCookie[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    };

    // Delete a cookie
    const deleteCookie = (name) => {
        document.cookie = name + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    // Get all cookies
    const getCookies = () => {
        var pairs = document.cookie.split(";");
        var cookies = {};
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            if (pair[0].includes("reddon")) cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
        }
        return cookies;
    };

    // Clear all cookies
    const clearCookies = () => {
        var res = document.cookie;
        var multiple = res.split(";");
        for (var i = 0; i < multiple.length; i++) {
            var key = multiple[i].split("=");
            if (key[0].includes("reddon")) document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    };

    // #######################################
    //      INTERPOLATIONS
    // #######################################

    // Clamp a value between a min and max
    const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

    // Linear interpolation (0 <= t <= 1) -> Returns value between start and end
    const lerp = (start, end, t) => start * (1 - t) + end * t;

    // Inverse linear interpolation (x <= a <= y) -> Returns value between 0 and 1
    const invlerp = (x, y, a) => clamp((a - x) / (y - x));

    // #######################################
    //      DATE AND TIME
    // #######################################

    // Convert UTF Unix Time to Date object
    const unixTimeToDate = (unixTime) => {
        // Date objext in milliseconds
        return new Date(unixTime * 1000);
    };

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get a formated string about how long ago the date was
    const timeAgo = (dateParam, shortDate = true) => {
        if (!dateParam) return null;

        // Get the formatted date
        const getFormattedDate = (date, shortDate = true, prefomattedDate = false, hideYear = false) => {
            const day = date.getDate();
            const month = MONTH_NAMES[date.getMonth()];
            const monthShort = MONTH_NAMES_SHORT[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            let minutes = date.getMinutes();

            // Adding leading zero to minutes
            if (minutes < 10) minutes = `0${minutes}`;

            // Today || Today at 10:20 || Yesterday || Yesterday at 10:20
            if (prefomattedDate) return shortDate ? prefomattedDate : `${prefomattedDate} at ${hours}:${minutes}`;

            // Jan 10 || 10 January at 10:20
            if (hideYear) return shortDate ? `${monthShort} ${day}` : `${day} ${month} at ${hours}:${minutes}`;

            // Jan 2017 || 10 January 2017 at 10:20
            return shortDate ? `${monthShort} ${year}` : `${day} ${month} ${year} at ${hours}:${minutes}`;
        };

        const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
        const today = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();

        if (seconds < 60) return shortDate ? "now" : "just now";
        else if (seconds < 120) return shortDate ? "1m" : "1 minute ago";
        else if (minutes < 60) return shortDate ? `${minutes}m` : `${minutes} minutes ago`;
        else if (hours < 24) return shortDate ? `${hours}h` : `${hours} hours ago`;
        else if (isToday) return getFormattedDate(date, shortDate, "Today");
        else if (isYesterday) return getFormattedDate(date, shortDate, "Yesterday");
        else if (isThisYear) return getFormattedDate(date, shortDate, false, true);
        return getFormattedDate(date);
    };

    // #######################################
    //      NUMBER FORMAT
    // #######################################

    const fifteen_power = Math.pow(10, 15);
    const twelve_power = Math.pow(10, 12);
    const nine_power = Math.pow(10, 9);
    const six_power = Math.pow(10, 6);
    const three_power = Math.pow(10, 3);

    function format_number(num) {
        var negative = num < 0;
        num = Math.abs(num);
        var letter = "";

        if (num >= fifteen_power) {
            letter = "Q";
            num = num / fifteen_power;
        } else if (num >= twelve_power) {
            letter = "T";
            num = num / twelve_power;
        } else if (num >= nine_power) {
            letter = "B";
            num = num / nine_power;
        } else if (num >= six_power) {
            letter = "M";
            num = num / six_power;
        } else if (num >= three_power) {
            letter = "K";
            num = num / three_power;
        }

        var num_characters = letter.length ? 3 : 4;

        // Limit to one decimal and at most 4 characters
        if (num >= 100) num = num.toFixed(Math.min(1, Math.max(0, num_characters - 3)));
        else if (num >= 10) num = num.toFixed(Math.min(1, Math.max(0, num_characters - 2)));
        else num = num.toFixed(Math.min(1, Math.max(0, num_characters - 1)));

        return (+parseFloat(num) * (negative ? -1 : 1)).toString() + letter;
    }

    // #######################################
    //      HOOKS
    // #######################################

    //create your forceUpdate hook
    const useForceUpdate = () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const [value, setValue] = useState(0);
        if (value < 0) console.log(value);
        return () => setValue((value) => ++value);
    };

    // Mantain the size of the bounding box updated in a reference
    function useMeasure() {
        const ref = useRef();
        const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
        const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));

        useEffect(() => {
            if (ref.current) ro.observe(ref.current);
            return () => ro.disconnect();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return [{ ref }, bounds];
    }

    // #######################################
    //      MOBILE CHECK
    // #######################################

    const isMobile = () => {
        if (typeof navigator === "undefined") return false;

        const ua = navigator.userAgent;
        return /Android|Mobi/i.test(ua);
    };

    return (
        <Utils.Provider
            value={{
                // COOKIES
                setCookie,
                getCookie,
                deleteCookie,
                getCookies,
                clearCookies,

                // INTERPOLATIONS
                clamp,
                lerp,
                invlerp,

                // DATE AND TIME
                unixTimeToDate,
                timeAgo,

                // FORMAT NUMBERS
                format_number,

                // HOOKS
                useForceUpdate,
                useMeasure,

                // MOBILE CHECK
                isMobile,
            }}
        >
            {props.children}
        </Utils.Provider>
    );
};

export default UtilsProvider;
