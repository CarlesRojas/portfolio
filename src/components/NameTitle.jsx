import React, { useEffect, useRef, useContext } from "react";
import classnames from "classnames";

// Contexts
import { Utils } from "contexts/Utils";

export default function NameTitle(props) {
    // Props
    const { section, changeSection } = props;

    // Contexts
    const { isMobile, lerp, invlerp } = useContext(Utils);

    // Reference to the svg and its container
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    // #######################################
    //      TILT
    // #######################################

    // Update tilt
    var updateTilt = function (event) {
        // Get tilt
        const x = lerp(-0.5, 0.5, invlerp(window.innerHeight, 0, event.clientY));
        const y = lerp(-0.5, 0.5, invlerp(0, window.innerWidth, event.clientX));
        const style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";

        // Update style
        svgRef.current.style.transform = style;
        svgRef.current.style.webkitTransform = style;
        svgRef.current.style.mozTransform = style;
        svgRef.current.style.msTransform = style;
        svgRef.current.style.oTransform = style;
    };

    // #######################################
    //      TEXT MASK
    // #######################################

    // When the mouse moves -> Update the blob position & tilt image
    const onMouseMove = (event) => {
        // Don't animate in the dev enviroment
        if (process.env.NODE_ENV === "development") return;

        // Update Tilt
        updateTilt(event);

        // SVG Top position
        const svgTop = svgRef.current.getBoundingClientRect().top;

        // Circle 1
        var circle1 = document.getElementById("circle1");
        circle1.style.transformOrigin = `${event.clientX}px ${event.clientY - 5 - svgTop}px`;
        circle1.style.cx = `${event.clientX - 5}`;
        circle1.style.cy = `${event.clientY - svgTop}`;

        // Circle 2
        var circle2 = document.getElementById("circle2");
        circle2.style.transformOrigin = `${event.clientX}px ${event.clientY + 5 - svgTop}px`;
        circle2.style.cx = `${event.clientX + 5}`;
        circle2.style.cy = `${event.clientY - svgTop}`;

        // Circle 3
        var circle3 = document.getElementById("circle3");
        circle3.style.transformOrigin = `${event.clientX - 5}px ${event.clientY - svgTop}px`;
        circle3.style.cx = `${event.clientX}`;
        circle3.style.cy = `${event.clientY - 5 - svgTop}`;

        // Circle 4
        var circle4 = document.getElementById("circle4");
        circle4.style.transformOrigin = `${event.clientX + 5}px ${event.clientY - svgTop}px`;
        circle4.style.cx = `${event.clientX}`;
        circle4.style.cy = `${event.clientY + 5 - svgTop}`;

        // Circle 1
        var circle5 = document.getElementById("circle5");
        circle5.style.transformOrigin = `${event.clientX}px ${event.clientY - 5 - svgTop}px`;
        circle5.style.cx = `${event.clientX - 5}`;
        circle5.style.cy = `${event.clientY - svgTop}`;

        // Circle 2
        var circle6 = document.getElementById("circle6");
        circle6.style.transformOrigin = `${event.clientX}px ${event.clientY + 5 - svgTop}px`;
        circle6.style.cx = `${event.clientX + 5}`;
        circle6.style.cy = `${event.clientY - svgTop}`;

        // Circle 3
        var circle7 = document.getElementById("circle7");
        circle7.style.transformOrigin = `${event.clientX - 5}px ${event.clientY - svgTop}px`;
        circle7.style.cx = `${event.clientX}`;
        circle7.style.cy = `${event.clientY - 5 - svgTop}`;

        // Circle 4
        var circle8 = document.getElementById("circle8");
        circle8.style.transformOrigin = `${event.clientX + 5}px ${event.clientY - svgTop}px`;
        circle8.style.cx = `${event.clientX}`;
        circle8.style.cy = `${event.clientY + 5 - svgTop}`;
    };

    // #######################################
    //      EVENTS
    // #######################################

    // Subscribe and unsubscrive to events
    useEffect(() => {
        if (section === 0 && !isMobile()) {
            document.addEventListener("mousemove", onMouseMove);
        }

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    return (
        <div className={classnames("nameTitle", { front: section === 0 })} onClick={() => changeSection(0)}>
            <div className={classnames("nameContainer", { front: section === 0 })} ref={containerRef}>
                <svg className="nameSVG" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    {/* MASK */}
                    <mask id="blobMask">
                        <circle id="circle1" r="150" cx="150" cy="145" fill="white" stroke="none"></circle>
                        <circle id="circle2" r="150" cx="150" cy="155" fill="white" stroke="none"></circle>
                        <circle id="circle3" r="150" cx="145" cy="150" fill="white" stroke="none"></circle>
                        <circle id="circle4" r="150" cx="155" cy="150" fill="white" stroke="none"></circle>
                    </mask>

                    {/* INVERTED MASK */}
                    <mask id="blobMaskInv">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" stroke="none" />
                        <circle id="circle5" r="150" cx="150" cy="145" fill="black" stroke="none"></circle>
                        <circle id="circle6" r="150" cx="150" cy="155" fill="black" stroke="none"></circle>
                        <circle id="circle7" r="150" cx="145" cy="150" fill="black" stroke="none"></circle>
                        <circle id="circle8" r="150" cx="155" cy="150" fill="black" stroke="none"></circle>
                    </mask>

                    {/* HIDDEN */}
                    <mask id="hidden">
                        <rect x="0" y="0" width="100%" height="100%" fill="black" stroke="none" />
                    </mask>

                    {/* NORMAL NAME */}
                    <text
                        className={classnames({ front: section === 0 })}
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        mask={section === 0 && !isMobile() ? "url(#blobMaskInv)" : ""}
                    >
                        [ carles rojas ]
                    </text>

                    {/* GRAFFITI NAME */}
                    <text
                        className={classnames("graffitiName", { front: section === 0 })}
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        mask={section === 0 && !isMobile() ? "url(#blobMask)" : "url(#hidden)"}
                    >
                        carles rojas
                    </text>
                </svg>
            </div>
        </div>
    );
}
