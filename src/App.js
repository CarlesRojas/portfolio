import Cursor from "components/Cursor";

export default function App() {
    // Set dark mode
    document.body.classList.add("dark");

    return (
        <div className="app">
            <div className="section"></div>
            <div className="section red"></div>
            <div className="section blue"></div>
            <div className="section green"></div>
            <Cursor />
        </div>
    );
}
