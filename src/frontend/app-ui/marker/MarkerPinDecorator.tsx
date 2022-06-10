import { Point2d, Point3d, XAndY, XYAndZ, Sample, GeodesicPathPoint } from "@bentley/geometry-core";
import {
    BeButton,
    BeButtonEvent,
    Cluster,
    DecorateContext,
    Decorator,
    IModelApp,
    Marker,
    MarkerSet,
    SnapshotConnection,
    IModelConnection,
    MarginPercent,
} from "@bentley/imodeljs-frontend";
import { PopupMenu, PopupMenuEntry } from "./PopupMenu";
import { Id64, Id64String, Id64Arg } from "@bentley/bentleyjs-core";
import {
    SelectionChangeEventArgs,
    ISelectionProvider,
    Presentation,
} from "@bentley/presentation-frontend";
import { CoreTools } from "@bentley/ui-framework";

class SamplePinMarker extends Marker {
    private _markerSet: SampleMarkerSet;
    public id: number;
    private touchCallback: Function | null;
    private hoverCallback: Function | null;
    private static _height = 50;

    constructor(
        location: Point3d,
        title: string,
        image: HTMLImageElement,
        markerSet: SampleMarkerSet,
        id: number,
        onTouch: Function | null = null,
        onHover: Function | null = null
    ) {
        super(
            location,
            new Point2d(
                image.width * (SamplePinMarker._height / image.height),
                SamplePinMarker._height
            )
        );

        this.setImage(image);

        this._markerSet = markerSet;

        this.imageOffset = new Point3d(0, Math.floor(this.size.y * 0.5));

        this.title = title;

        this.setScaleFactor({ low: 0.75, high: 2.0 });

        this.id = id;

        this.touchCallback = onTouch;

        this.hoverCallback = onHover;
        Presentation.selection.selectionChange.addListener(this._onSelectionChanged);
    }
    private _onSelectionChanged = (
        evt: SelectionChangeEventArgs,
        selectionProvider: ISelectionProvider
    ) => {
        const selection = selectionProvider.getSelection(evt.imodel, evt.level);
    };

    public pick(pt: XAndY): boolean {
        if (undefined === this.imageOffset) return super.pick(pt);
        const pickRect = this.rect.clone();
        const offsetX =
            undefined === this._scaleFactor
                ? this.imageOffset.x
                : this.imageOffset.x * this._scaleFactor.x;
        const offsetY =
            undefined === this._scaleFactor
                ? this.imageOffset.y
                : this.imageOffset.y * this._scaleFactor.y;
        pickRect.top -= offsetY;
        pickRect.bottom -= offsetY;
        pickRect.left -= offsetX;
        pickRect.right -= offsetX;
        return pickRect.containsPoint(pt);
    }

    public onMouseEnter() {
        let x = this.position.x;
        let y = this.position.y;
        let pt: XAndY = { x, y };

        if (this.hoverCallback)
            this.hoverCallback(this.id, this.image, this.title, this.position, true);
    }
    public onMouseLeave(): void {
        if (this.hoverCallback)
            this.hoverCallback(this.id, this.image, this.title, this.position, false);
    }

    public onMouseButton(ev: BeButtonEvent): boolean {
        if (
            BeButton.Data !== ev.button ||
            !ev.isDown ||
            !ev.viewport ||
            !ev.viewport.view.isSpatialView()
        )
            return true;
        if (typeof this.touchCallback == "function") this.touchCallback(this.id);
        const vp = IModelApp.viewManager.selectedView;

        let left = 0.1;
        let top = 0.1;
        let right = 0.1;
        let bottom = 0.1;
        let check: MarginPercent = { left, top, right, bottom };
        if (undefined !== vp) {
            // vp.zoom(this.worldLocation, 0.5, { animateFrustumChange: true, marginPercent: check });
        }
        return true;
    }

    private _removeMarkerCallback = (_entry: PopupMenuEntry) => {
        this._markerSet.removeMarker(this);
    };

    private _centerMarkerCallback = (_entry: PopupMenuEntry) => {
        const vp = IModelApp.viewManager.selectedView;

        if (undefined !== vp) {
            vp.zoom(this.worldLocation, 1.0, { animateFrustumChange: true });
        }
    };
}

class SampleClusterMarker extends Marker {
    private static _radius = 13;

    constructor(location: XYAndZ, size: XAndY, cluster: Cluster<SamplePinMarker>) {
        super(location, size);
        this.label = cluster.markers.length.toLocaleString();
        this.labelColor = "black";
        this.labelFont = "bold 14px san-serif";

        if (undefined !== cluster.markers[0].image) {
            this.imageOffset = new Point3d(
                0,
                Math.floor(this.size.y * 0.5) + SampleClusterMarker._radius
            );
            this.setImage(cluster.markers[0].image);
        }

        const maxLen = 10;
        let title = "";
        cluster.markers.forEach((marker, index: number) => {
            if (index < maxLen) {
                if (title !== "") title += "<br>";
                title += marker.title;
            }
        });
        if (cluster.markers.length > maxLen) title += "<br>...";

        const div = document.createElement("div");
        div.innerHTML = title;
        this.title = div;
    }

    public drawFunc(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = "#372528";
        ctx.fillStyle = "white";
        ctx.lineWidth = 5;
        ctx.arc(0, 0, SampleClusterMarker._radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

class SampleMarkerSet extends MarkerSet<SamplePinMarker> {
    public minimumClusterSize = 5;

    protected getClusterMarker(cluster: Cluster<SamplePinMarker>): Marker {
        return SampleClusterMarker.makeFrom(cluster.markers[0], cluster);
    }

    public setPoints(points: Point3d[], image: HTMLImageElement): void {
        this.markers.clear();
        let index = 1;
        for (const point of points) {
            this.markers.add(new SamplePinMarker(point, `Marker ${index++}`, image, this, 0));
        }
    }
    // will be implemented later

    public removeMarker(marker: SamplePinMarker) {
        this.markers.delete(marker);

        const vp = IModelApp.viewManager.selectedView;
        if (undefined !== vp) vp.invalidateDecorations();
    }
}

export class MarkerPinDecorator implements Decorator {
    private _autoMarkerSet = new SampleMarkerSet();
    private _manualMarkerSet = new SampleMarkerSet();
    private _history = new SampleMarkerSet();
    //later would be changed with inclusion of name state

    public setPoints(points: Point3d[], pinImage: HTMLImageElement): void {
        this._autoMarkerSet.setPoints(points, pinImage);

        const vp = IModelApp.viewManager.selectedView;
        if (undefined !== vp) vp.invalidateDecorations();
    }

    public addPoint(
        point: Point3d,
        pinName: string,
        pinImage: HTMLImageElement,
        id: number,
        onTouch: Function | null = null,
        onHover: Function | null = null
    ): void {
        const vp = IModelApp.viewManager.selectedView;
        if (vp) {
            vp.invalidateDecorations();
        }
        this._manualMarkerSet.markers.add(
            new SamplePinMarker(
                point,
                pinName,
                pinImage,
                this._manualMarkerSet,
                id,
                onTouch,
                onHover
            )
        );
        IModelApp.tools.run(
            CoreTools.selectElementCommand.toolId,
            IModelApp.viewManager.selectedView
        );
        // this is for trial
        const pin = [point];
    }

    public removePoints() {
        this._manualMarkerSet = new SampleMarkerSet();
    }
    public deleteMarker(id: number): Promise<boolean> {
        var x = false;
        return new Promise((r)=>{
            this._manualMarkerSet.markers.forEach((a, _b, _c) => {
                if (a.id === id) {
                    this._manualMarkerSet.markers.delete(a);
                    x = true;
                }
            });
            r(true);
            if (x == false) {
                r(false);
            }
        })
    }

    public decorate(context: DecorateContext): void {
        if (context.viewport.view.isSpatialView() || context.viewport.view.isDrawingView()) {
            this._autoMarkerSet.addDecoration(context);
            this._manualMarkerSet.addDecoration(context);
        }
    }
}
