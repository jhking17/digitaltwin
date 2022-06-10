import * as React from "react";
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import {
    EmphasizeElements,
    FeatureOverrideType,
    IModelApp,
    ScreenViewport,
} from "@bentley/imodeljs-frontend";
import { ColorDef } from "@bentley/imodeljs-common";
import EmphasizeElementsUI from "./EmphasizeElementsUI";

abstract class EmphasizeActionBase {
    protected abstract execute(emph: EmphasizeElements, vp: ScreenViewport): boolean;

    public run(): boolean {
        const vp = IModelApp.viewManager.selectedView;

        if (undefined === vp) {
            return false;
        }
        //여기서 정해지는데 애매모 해...
        const emph = EmphasizeElements.getOrCreate(vp);
        return this.execute(emph, vp);
    }
}

export class EmphasizeAction extends EmphasizeActionBase {
    private _wantEmphasis: boolean;

    public constructor(wantEmphasis: boolean) {
        super();
        this._wantEmphasis = wantEmphasis;
    }
    public execute(emph: EmphasizeElements, vp: ScreenViewport): boolean {
        emph.wantEmphasis = this._wantEmphasis;
        emph.emphasizeSelectedElements(vp);
        return true;
    }
}
export class ClearEmphasizeAction extends EmphasizeActionBase {
    public execute(emph: EmphasizeElements, vp: ScreenViewport): boolean {
        emph.clearEmphasizedElements(vp);
        return true;
    }
}

export class IsolateAction extends EmphasizeActionBase {
    public execute(emph: EmphasizeElements, vp: ScreenViewport): boolean {
        emph.isolateSelectedElements(vp);
        return true;
    }
}

export class ClearIsolateAction extends EmphasizeActionBase {
    public execute(emph: EmphasizeElements, vp: ScreenViewport): boolean {
        emph.clearIsolatedElements(vp);

        return true;
    }
}
