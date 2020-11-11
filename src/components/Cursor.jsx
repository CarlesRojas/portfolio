import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";

// Contexts
import { Utils } from "contexts/Utils";

export default function Cursor() {
    // Contexts
    const { isMobile } = useContext(Utils);

    // Mouse state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

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

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    // When on mobile -> Do not use custom mouse
    if (isMobile()) return null;

    // Add classes to the cursor
    const cursorClasses = classnames("cursor", {
        clicked: clicked,
        hidden: hidden,
        hovered: hovered,
    });

    return <div className={cursorClasses} style={{ left: `${position.x}px`, top: `${position.y}px` }} />;
}
