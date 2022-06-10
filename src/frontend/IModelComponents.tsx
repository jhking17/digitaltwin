import React from "react";
import { ConfigurableUiContent } from "@bentley/ui-framework";
import { AppBackstageComposer } from "./app-ui/backstage/AppBackstageComposer";
const IModelComponents = () => {
    return <ConfigurableUiContent style={{height : "calc(100% - 84px)"}} appBackstage={<AppBackstageComposer />} />;
};

export default IModelComponents;
