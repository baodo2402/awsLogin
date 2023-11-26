import React from "react";
import SearchBar from "./SearchBar";
import { Header } from "./Header";

export default function CalendarSearching() {
    return (
        <div>
            <Header title="Calendar Search" />
            <SearchBar />
            <div className='blank'></div>
                <div className='background-img'></div>
        </div>
    )
}