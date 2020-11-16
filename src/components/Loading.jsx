import React from "react";

export default function Loading() {
    return (
        <div className="loading">
            <div className="loadingTextContainer">
                <h1 className="hideMask">
                    <span className="loadingText">Welcome to</span>
                </h1>
                <h1 className="hideMask">
                    <span className="loadingText">my portfolio.</span>
                </h1>
            </div>

            <div className="slider"></div>
        </div>
    );
}
