import React from "react";
import { PipeLineStore } from "./pipeline";
import { ParamStore } from "./param";
import { ResultStore } from "./result";


const stores = React.createContext({
    resultStore: new ResultStore(),
    pipeLineStore: new PipeLineStore(),
    paramStore: new ParamStore(),
});

export const useStores = () => React.useContext(stores);

export default stores;