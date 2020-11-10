import React, { useRef, useEffect, useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";

export default function Stars() {
    // Contexts
    const { useForceUpdate } = useContext(Utils);

    // Force update
    const forceUpdate = useForceUpdate();

    // Stars
    const numStars = 25;
    const stars = useRef([]);
    const starCoordinates = useRef([]);
    const starOpacity = useRef([]);

    // When the mouse moves -> Update its position
    const onMouseMove = (event) => {
        // CARLES Delete this return
        return;

        stars.current.forEach((star, i) => {
            const speed = (1 - starOpacity.current[i] + 0.05) * 7;
            const x = (window.innerWidth - event.pageX * speed) / 100;
            const y = (window.innerHeight - event.pageY * speed) / 100;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    };

    // Create options for the stars and render this component again
    const createStarOptions = () => {
        // Get all the stars
        stars.current = [...document.querySelectorAll(".star")];

        // Set random coordinates for the stars
        starCoordinates.current = stars.current.map(() => {
            return {
                x: Math.floor(Math.random() * (window.innerWidth - 20)) + 10,
                y: Math.floor(Math.random() * (window.innerHeight - 20)) + 10,
            };
        });

        // Set a random opacity for the stars
        starOpacity.current = stars.current.map(() => {
            return Math.random();
        });

        // Force update
        forceUpdate();
    };

    // Wait until the resize ends to execute a function
    function waitToResizeEnd(func, time) {
        time = time || 100;
        var timer;
        return function (event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, time, event);
        };
    }

    // Subscribe and unsubscrive to events
    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", waitToResizeEnd(createStarOptions, 150));

        // Calculate options for stars
        createStarOptions();

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", waitToResizeEnd(createStarOptions, 150));
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    var starsDOM = [];
    for (let i = 0; i < numStars; i++) {
        const coords = i < starCoordinates.current.length ? starCoordinates.current[i] : { x: 0, y: 0 };
        const opacity = i < starOpacity.current.length ? starOpacity.current[i] : 0;
        starsDOM.push(<div key={i} className="star" style={{ left: coords.x, top: coords.y, opacity }}></div>);
    }

    return <div className="stars">{starsDOM}</div>;
}
