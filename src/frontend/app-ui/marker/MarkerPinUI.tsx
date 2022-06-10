import * as React from "react";
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import { Point3d, Range2d } from "@bentley/geometry-core";
import {
    IModelApp,
    IModelConnection,
    ScreenViewport,
    StandardViewId,
    ViewState,
} from "@bentley/imodeljs-frontend";
import { Button, ButtonType, Toggle } from "@bentley/ui-core";
import { ViewSetup } from "./viewSetup";
import MarkerPinApp from "./MarkerPinApp";
import markerPin from "../../../images/pin_sensor.png";

interface MarkerPinsUIState {
    imodel?: IModelConnection;
    showDecorator: boolean;
    points: Point3d[];
    range: Range2d;
    height: number;
    pinImage: HTMLImageElement;
    pinNum: number;
}

export default class MarkerPinsUI extends React.Component<
    {
        imodel: IModelConnection;
    },
    MarkerPinsUIState
> {
    constructor(props?: any) {
        super(props);
        let img = new Image();
        img.src = markerPin;
        this.state = {
            showDecorator: true,
            points: [],
            range: Range2d.createNull(),
            height: 0,
            pinImage: img,
            pinNum: 0,
        };
    }

    componentDidMount() {
        this.onIModelReady(this.props.imodel);
    }

    public componentDidUpdate(_prevProps: {}, prevState: MarkerPinsUIState) {
        if (prevState.imodel !== this.state.imodel)
            if (this.state.showDecorator) {
                MarkerPinApp.setupDecorator(this.state.points);
                MarkerPinApp.enableDecorations();
            }

        if (prevState.points !== this.state.points) {
            if (MarkerPinApp.decoratorIsSetup()) MarkerPinApp.setMarkerPoints(this.state.points);
        }

        if (prevState.showDecorator !== this.state.showDecorator) {
            if (this.state.showDecorator) MarkerPinApp.enableDecorations();
            else MarkerPinApp.disableDecorations();
        }
    }

    public static async getTopView(imodel: IModelConnection): Promise<ViewState> {
        const viewState = await ViewSetup.getDefaultView(imodel);

        viewState.setStandardRotation(StandardViewId.Top);

        const range = viewState.computeFitRange();
        const aspect = viewState.getAspectRatio();

        viewState.lookAtVolume(range, aspect);

        return viewState;
    }

    private onIModelReady = (imodel: IModelConnection) => {
        IModelApp.viewManager.onViewOpen.addOnce((vp: ScreenViewport) => {
            const range3d = vp.view.computeFitRange();
            const range = Range2d.createFrom(range3d);
            const height = range3d.zHigh;

            this.setState({ imodel, range, height });
        });
    };

    public render() {
        return <div></div>;
    }
}
