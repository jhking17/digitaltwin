import * as React from "react";
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import { Point3d } from "@bentley/geometry-core";
import { imageElementFromUrl, IModelApp, IModelConnection } from "@bentley/imodeljs-frontend";
import { I18NNamespace } from "@bentley/imodeljs-i18n";
import { MarkerPinDecorator } from "./MarkerPinDecorator";
import { PlaceMarkerTool } from "./PlaceMarkerTool";
import MarkerPinUI from "./MarkerPinUI";
import { CoreTools } from "@bentley/ui-framework";

export default class MarkerPinApp {
    private static _sampleNamespace: I18NNamespace;
    private static _markerDecorator?: MarkerPinDecorator;
    public static _images: Map<string, HTMLImageElement>;

    public static setup(imodelConnection: IModelConnection): any {
        this._sampleNamespace = IModelApp.i18n.registerNamespace("marker-pin-i18n-namespace");

        PlaceMarkerTool.register(this._sampleNamespace);

        MarkerPinApp._images = new Map();
        let img = new Image();
        MarkerPinApp._images.set("Google_Maps_pin.svg", img);

        return <MarkerPinUI imodel={imodelConnection} />;
    }

    public static teardown() {
        MarkerPinApp.disableDecorations();
    }
    public static async delete(id: number) {
        console.log("delete : id", id)
        await MarkerPinApp.deleteDecorations(id);
    }
    public static setback(): any {
        MarkerPinApp.enableDecorations();
        //this.setup(imodelConnection);
    }

    public static decoratorIsSetup() {
        return null != this._markerDecorator;
    }
    //this is the point for set points
    public static setupDecorator(points: Point3d[]) {
        if (!MarkerPinApp._images.has("Google_Maps_pin.svg")) return;
        this._markerDecorator = new MarkerPinDecorator();
        this.setMarkerPoints(points);
    }

    public static setMarkerPoints(points: Point3d[]) {
        if (this._markerDecorator)
            this._markerDecorator.setPoints(points, this._images.get("pin_.png")!);
    }

    public static addMarkerPoint(
        point: Point3d,
        pinName: string,
        pinImage: HTMLImageElement,
        id: number,
        onTouch: Function | null = null,
        onHover: Function | null = null
    ) {
        if (this._markerDecorator) {
            this._markerDecorator.addPoint(point, pinName, pinImage, id, onTouch, onHover);
        }
    }

    public static enableDecorations() {
        if (this._markerDecorator) IModelApp.viewManager.addDecorator(this._markerDecorator);
    }

    public static disableDecorations() {
        if (this._markerDecorator) {
            this._markerDecorator.removePoints();
        }
    }
    public static async deleteDecorations(id: number){
        if (this._markerDecorator) {
            await this._markerDecorator.deleteMarker(id);
        }
    }
}
