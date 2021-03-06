import React, { useEffect, useRef, useState, useContext } from "react";
import Cursor from "components/Cursor";
import { a, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import classnames from "classnames";
import gsap from "gsap";

// Components
import NameTitle from "components/NameTitle";
import Stars from "components/Stars";
import Deck from "components/Deck";
import Loading from "components/Loading";

// Contexts
import { Utils } from "contexts/Utils";

export default function App() {
    // Contexts
    const { useForceUpdate } = useContext(Utils);

    // Force update
    const forceUpdate = useForceUpdate();

    // Set dark mode
    document.body.classList.add("dark");

    // #######################################
    //      SECTIONS
    // #######################################

    // Current section state
    const [section, setSection] = useState(0);
    const currSection = useRef(0);

    // Number of sections & section timeout
    const numSections = useRef(4);
    const changeSectionTimeout = useRef(null);

    // Section height
    const currSectionHeight = useRef(window.innerHeight);

    // When the change of section ends
    const onSectionChangeRest = () => {
        // Inform about the section change
        window.PubSub.emit("onSectionRest", { section: currSection.current });
    };

    // Vertical Scoll spring
    const [{ y }, setY] = useSpring(() => ({ y: 0, onRest: onSectionChangeRest }));

    // Change to next or previous section
    const nextPrevSection = (next = true) => {
        // If it changed section recently -> Block action
        if (changeSectionTimeout.current) return;

        // If in the first section -> Can't scroll up
        if (!next && currSection.current === 0) return;

        // If in the last section -> Can't scroll down
        if (next && currSection.current === numSections.current - 1) return;

        // Create timeout for changing section
        changeSectionTimeout.current = setTimeout(() => {
            changeSectionTimeout.current = null;
        }, 500);

        // Set current section
        currSection.current = currSection.current + (next ? 1 : -1);
        setSection(currSection.current);

        // Move to current section
        setY({ y: currSection.current * -currSectionHeight.current });
    };

    // Change to a target section directly
    const changeSection = (targetSection) => {
        // Ignore if the target section does not exists
        if (targetSection < 0 || targetSection >= numSections.current || targetSection === currSection.current) return;

        // If it changed section recently -> Block action
        if (changeSectionTimeout.current) return;

        // Create timeout for changing section
        changeSectionTimeout.current = setTimeout(() => {
            changeSectionTimeout.current = null;
        }, 500);

        // Set current section
        currSection.current = targetSection;
        setSection(currSection.current);

        // Move to current section
        setY({ y: currSection.current * -currSectionHeight.current });
    };

    // Scroll Gesture
    const gestureBind = useDrag(
        ({ event, down, last, vxvy: [, vy], distance, cancel, canceled }) => {
            // Stop event propagation
            event.stopPropagation();

            // Cancel gesture and snap to next post
            if (!canceled && ((down && distance > 50) || (last && Math.abs(vy) > 0.15))) {
                // Cancel the event and go to the next or previous section
                cancel();
                nextPrevSection(vy < 0);
            }
        },
        { filterTaps: true, axis: "y" }
    );

    // When the mouse moves -> Update its position
    const onWheel = (event) => {
        // Prevent default
        event.preventDefault();

        // Deconstruct
        const { deltaY } = event;

        // If scrolling up or down -> Change section
        nextPrevSection(deltaY > 0);
    };

    // On screen resize -> Upathe the height of elements
    const onResize = (event) => {
        currSectionHeight.current = window.innerHeight;

        // Move to current section
        setY({ y: currSection.current * -currSectionHeight.current, immediate: true });

        // Force update
        forceUpdate();
    };

    // #######################################
    //      DECK
    // #######################################

    // Deck state
    const [showDeck, setShowDeck] = useState(false);
    const deck = showDeck ? <Deck></Deck> : null;

    // Show deck the first time on section 1
    useEffect(() => {
        if (!showDeck && section === 1) {
            // Show deck
            setShowDeck(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    // #######################################
    //      EVENTS
    // #######################################

    // Subscribe and unsubscrive to events and animate
    useEffect(() => {
        document.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", onResize);

        // Animate
        const timeline = gsap.timeline({ defaults: { ease: "power1.out" } });

        timeline.to(".loadingText", { y: "0%", duration: 1, stagger: 0.25 });
        timeline.to(".slider", { y: "-100%", duration: 0.8, delay: 0.75 });
        timeline.to(".loadingTextContainer", { y: "-100%", duration: 0.4 }, "-=0.6");
        timeline.fromTo(".nameTitle", { opacity: 0, y: "5%" }, { opacity: 1, y: "0%", duration: 1 }, "-=0.4");
        timeline.fromTo(".stars", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.3");

        return () => {
            document.removeEventListener("wheel", onWheel, { passive: false });
            window.removeEventListener("resize", onResize);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app">
            {/* NAV POINTS */}
            <div className="navPoints">
                <div className={classnames("navPoint", "hoverable", { active: section === 0 })} onClick={() => changeSection(0)}>
                    <div className="point"></div>
                </div>
                <div className={classnames("navPoint", "hoverable", { active: section === 1 })} onClick={() => changeSection(1)}>
                    <div className="point"></div>
                </div>
                <div className={classnames("navPoint", "hoverable", { active: section === 2 })} onClick={() => changeSection(2)}>
                    <div className="point"></div>
                </div>
                <div className={classnames("navPoint", "hoverable", { active: section === 3 })} onClick={() => changeSection(3)}>
                    <div className="point"></div>
                </div>
            </div>

            {/* STARS */}
            <Stars></Stars>

            {/* SECTIONS */}
            <a.div className="sectionContainer" {...gestureBind()} style={{ y, height: currSectionHeight.current * numSections.current }}>
                <div className="section"></div>
                <div className="section">{deck}</div>
                <div className="section blue"></div>
                <div className="section green"></div>
            </a.div>

            {/* NAME TITLE */}
            <NameTitle section={section} changeSection={changeSection}></NameTitle>

            {/* LOADING */}
            <Loading></Loading>

            {/* CURSOR */}
            <Cursor section={section} />
        </div>
    );
}
