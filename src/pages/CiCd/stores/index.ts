import React from "react";
import { PipeLineStore } from "./pipeline";
import { ParamStore } from "./param";


const stores = React.createContext({
    pipeLineStore: new PipeLineStore(),
    paramStore: new ParamStore(),
});

export const useStores = () => React.useContext(stores);

export default stores;