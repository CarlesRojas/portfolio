import React, { useState, useEffect, useContext, useRef } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Utils } from "contexts/Utils";

// Icons
import PlayIcon from "resources/Play.svg";
import ScrollDownIcon from "resources/ScrollDown.svg";

export default function Cursor(props) {
    // Props
    const { section } = props;

    // Contexts
    const { isMobile } = useContext(Utils);

    // Mouse state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [play, setPlay] = useState(false);
    const [scrollDown, setScrollDown] = useState(false);
    const scrollDownTimer = useRef(null);

    // If in the front page, every 2 seconds show scroll down animation
    useEffect(() => {
        // Clear previous timeout
        if (scrollDownTimer.current) clearTimeout(scrollDownTimer.current);
    }, [section]);

    // When the mouse moves -> Update its position
    const onMouseMove = (event) => {
        setPosition({ x: event.clientX, y: event.clientY });
    };

    // When the mouse is clicked -> Set clicked to true
    const onMouseDown = () => {
        setClicked(true);
    };

    // When the mouse is released -> Set clicked to false
    const onMouseUp = () => {
        setClicked(false);
    };

    // When the mouse leaves the viewport -> Set hidden to true
    const onMouseLeave = () => {
        setHidden(true);
    };

    // When the mouse enters the viewport -> Set hidden to false
    const onMouseEnter = () => {
        setHidden(false);
    };

    // Subscribe and unsubscrive to events
    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseenter", onMouseEnter);
        document.addEventListener("mouseleave", onMouseLeave);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        // When the cursor hovers over certain elems -> Hover animation
        document.querySelectorAll(".hoverable").forEach((elem) => {
            elem.addEventListener("mouseover", () => setHovered(true));
            elem.addEventListener("mouseout", () => setHovered(false));
        });

        // When the cursor hovers over certain elems -> Play animation
        document.querySelectorAll(".playable").forEach((elem) => {
            elem.addEventListener("mouseover", () => setPlay(true));
            elem.addEventListener("mouseout", () => setPlay(false));
        });

        // Show the scroll icon
        scrollDownTimer.current = setTimeout(() => {
            setScrollDown(true);
            setTimeout(() => setScrollDown(false), 2000);
        }, 6000);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);

            // Clear previous timeout
            if (scrollDownTimer.current) clearTimeout(scrollDownTimer.current);
        };
    }, []);

    // When on mobile -> Do not use custom mouse
    if (isMobile()) return null;

    // Add classes to the cursor
    const cursorClasses = classnames("cursor", {
        clicked: clicked && !play && !scrollDown,
        hidden: hidden,
        hovered: hovered && !play && !scrollDown,
        iconActive: play || scrollDown,
    });

    const icon = play ? PlayIcon : ScrollDownIcon;

    return (
        <div className={cursorClasses} style={{ left: `${position.x}px`, top: `${position.y}px` }}>
            <SVG className={classnames("icon", { playIcon: play })} src={icon} />
        </div>
    );
}
