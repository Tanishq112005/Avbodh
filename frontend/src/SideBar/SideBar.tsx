import { useState } from "react";
import SideBarItem from "../components/sideBarItem/SideBarItem";
import "./SideBar.css";

function SideBar() {
    const [isSideBarOpen, setSideBarOpenStatus] = useState(true);

    const toggleSidebar = () => {
        setSideBarOpenStatus(!isSideBarOpen);
    };

    return (
        <>
        {/* We always render this main div, we just toggle its class */}
        <div className={isSideBarOpen ? "sideBar" : "closedSideBar"}>
            
            {isSideBarOpen ? (
                /* --- OPEN STATE CONTENT --- */
                <>
                    <div className="logo">
                        <div className="logoName">Jarvis</div>
                        <button onClick={toggleSidebar} className="hamburgerButton" type="button" title="Close Sidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    <span className="newChat">
                        <SideBarItem
                            text={"New Chat"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            }
                        />
                    </span>

                    <div className="recentChats">
                        <div className="textRecentChat">Recent Chat</div>
                        <div>
                            <SideBarItem text={"Learning CSS"}></SideBarItem>
                            <SideBarItem text={"Learning OS"}></SideBarItem>
                        </div>
                    </div>
                </>
            ) : (
                /* --- CLOSED STATE CONTENT --- */
                <button onClick={toggleSidebar} className="hamburgerButton" type="button" title="Open Sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            )}
            
        </div>
        </>
    );
}

export default SideBar;