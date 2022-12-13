import React from "react";
import {  useLocation } from "react-router-dom";

interface ExtraMenuState {
    url: string;
}

const ExtraMenuPage = () => {
    const location = useLocation();
    const state = location.state as ExtraMenuState;

    return <iframe width="100%" height="100%" src={state.url}/>;
};

export default ExtraMenuPage;