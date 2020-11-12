import React, { useState, useEffect } from "react";
import { useSprings, a, interpolate } from "react-spring";
import { useGesture } from "react-use-gesture";
import classnames from "classnames";

const cards = [
    "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
    "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
    "https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
];

// Final resting position of the cards
const goTo = (i) => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 });

// Starting position from outside the screen
const goFrom = () => ({ x: 0, rot: 0, scale: 1.5, y: window.innerHeight * 2 });

// Interpolates rotation and scale into a css transform
const transformStyle = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export default function Deck() {
    // All the cards in this set are gone
    const [gone] = useState(() => new Set());

    // Springs for each card
    const [springProps, setSprings] = useSprings(cards.length, (i) => ({ ...goTo(i), from: goFrom(i) }));

    // Gesture
    const gestureBind = useGesture(
        {
            onDrag: ({ args: [index], down, movement: [xDelta], direction: [xDir], velocity }) => {
                // Direction should either left or right
                const dir = xDir < 0 ? -1 : 1;

                // If the gesture is over and it had high velocity -> Flag the card to fly away
                if (!down && velocity > 0.3) gone.add(index);

                // Set the springs the current card
                setSprings((i) => {
                    // Do not set if not the current card
                    if (index !== i) return;

                    // If the card is gone or not
                    const isGone = gone.has(index);

                    // When a card is gone it flys out left or right, otherwise goes back to zero
                    const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;

                    // Rotation while flying away -> Scales with velocity
                    const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);

                    // The rest of the cards lift up
                    const scale = down ? 1.1 : 1;

                    // Set the spring
                    return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } };
                });

                // After some time all the cards come back
                if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || setSprings((i) => goTo(i)), 600);
            },
        },
        { filterTaps: true, axis: "x" }
    );

    // Subscribe and unsubscrive to events
    useEffect(() => {
        // Update the interactive items to add the cards
        window.PubSub.emit("updateInteractiveItems");
    }, []);

    return (
        <div className="deck">
            {springProps.map(({ x, y, rot, scale }, i) => (
                <a.div className="card" key={i} style={{ x, y }}>
                    <a.div
                        className={classnames("cardContent", "hoverable")}
                        {...gestureBind(i)}
                        style={{ transform: interpolate([rot, scale], transformStyle), backgroundImage: `url(${cards[i]})` }}
                    />
                </a.div>
            ))}
        </div>
    );
}
