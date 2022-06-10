/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelConnection, ViewState } from "@bentley/imodeljs-frontend";
import { CommonToolbarItem, ToolbarOrientation, ToolbarUsage } from "@bentley/ui-abstract";

import {
    ContentGroup,
    ContentLayoutDef,
    ContentViewManager,
    CoreTools,
    CustomItemDef,
    Frontstage,
    FrontstageProvider,
    IModelConnectedViewSelector,
    IModelViewportControl,
    ItemList,
    StagePanel,
    SyncUiEventId,
    UiFramework,
    Widget,
    WidgetState,
    Zone,
    ZoneState,
    ToolWidgetComposer,
    ToolbarHelper,
    IModelConnectedNavigationWidget,
    ToolbarComposer,
} from "@bentley/ui-framework";

import * as React from "react";
import { TableContent } from "../contentviews/TableContent";

import { PropertyGridWidget } from "../widgets/PropertyGridWidget";
import { TreeWidget } from "../widgets/TreeWidget";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import MarkerPinsUI from "../marker/MarkerPinUI";
import MarkerPinApp from "../marker/MarkerPinApp";

/**
 * Sample Frontstage for 9-Zone sample application
 */
export class SampleFrontstage extends FrontstageProvider {
    // Content layout for content views
    private _contentLayoutDef: ContentLayoutDef;

    // Content group for both layouts
    private _contentGroup: ContentGroup;

    private markerPinUI: any;

    constructor(public viewStates: ViewState[], public iConnection: IModelConnection | undefined) {
        super();

        // Create the content layouts.
        this._contentLayoutDef = new ContentLayoutDef({
            horizontalSplit: { percentage: 0.9, top: 0, bottom: 1 },
        });

        // Create the content group.
        this._contentGroup = new ContentGroup({
            contents: [
                {
                    classId: IModelViewportControl,
                    applicationData: {
                        viewState: this.viewStates[0],
                        iModelConnection: UiFramework.getIModelConnection(),
                    },
                },
                {
                    classId: TableContent,
                    applicationData: {
                        iModelConnection: UiFramework.getIModelConnection(),
                    },
                },
            ],
        });
        if (this.iConnection) {
            this.markerPinUI = MarkerPinApp.setup(this.iConnection);
        }
    }

    /** Define the Frontstage properties */
    public get frontstage() {
        return (
            <Frontstage
                id="SampleFrontstage"
                defaultTool={CoreTools.selectElementCommand}
                defaultLayout={this._contentLayoutDef}
                contentGroup={this._contentGroup}
                isInFooterMode={true}
                //Top
                topLeft={<Zone widgets={[<Widget isFreeform={true} element={<GroupTools />} />]} />}
                topCenter={<Zone widgets={[<Widget isToolSettings={true} />]} />}
                topRight={
                    <Zone
                        widgets={[
                            /** Use standard NavigationWidget delivered in ui-framework */
                            <Widget
                                isFreeform={true}
                                element={
                                    <IModelConnectedNavigationWidget
                                        suffixVerticalItems={
                                            new ItemList([this._viewSelectorItemDef])
                                        }
                                    />
                                }
                            />,
                        ]}
                    />
                }
                //Center
                centerLeft={
                    <Zone widgets={[<Widget isFreeform={true} element={<RemainderTools />} />]} />
                }
                centerRight={
                    <Zone
                        defaultState={ZoneState.Minimized}
                        allowsMerging={true}
                        widgets={[
                            <Widget
                                control={TreeWidget}
                                fillZone={true}
                                iconSpec="icon-tree"
                                labelKey="NineZoneSample:components.tree"
                                applicationData={{
                                    iModelConnection: UiFramework.getIModelConnection(),
                                }}
                            />,
                        ]}
                    />
                }
                //Bottom
                //현재 코드론 Zone에 마커를 위젯으로 넣어줘어야 마커가 표시됨.
                bottomLeft={
                    <Zone widgets={[<Widget isFreeform={true} element={this.markerPinUI} />]} />
                }
                bottomCenter={
                    <Zone widgets={[<Widget isStatusBar={true} control={AppStatusBarWidget} />]} />
                }
                bottomRight={
                    <Zone
                        defaultState={ZoneState.Open}
                        allowsMerging={true}
                        widgets={[
                            <Widget
                                id="Properties"
                                control={PropertyGridWidget}
                                defaultState={WidgetState.Closed}
                                fillZone={true}
                                iconSpec="icon-properties-list"
                                labelKey="NineZoneSample:components.properties"
                                applicationData={{
                                    iModelConnection: UiFramework.getIModelConnection(),
                                }}
                                syncEventIds={[SyncUiEventId.SelectionSetChanged]}
                                stateFunc={this._determineWidgetStateForSelectionSet}
                            />,
                        ]}
                    />
                }
                rightPanel={<StagePanel allowedZones={[6, 9]} />}
            />
        );
    }

    /** Determine the WidgetState based on the Selection Set */
    private _determineWidgetStateForSelectionSet = (): WidgetState => {
        const activeContentControl = ContentViewManager.getActiveContentControl();
        if (
            activeContentControl &&
            activeContentControl.viewport &&
            activeContentControl.viewport.view.iModel.selectionSet.size > 0
        )
            return WidgetState.Open;
        return WidgetState.Closed;
    };

    /** Get the CustomItemDef for ViewSelector  */
    private get _viewSelectorItemDef() {
        return new CustomItemDef({
            customId: "sampleApp:viewSelector",
            reactElement: (
                <IModelConnectedViewSelector
                    listenForShowUpdates={false} // Demo for showing only the same type of view in ViewSelector - See IModelViewport.tsx, onActivated
                />
            ),
        });
    }
}

/**
 * Define a ToolWidget with Buttons to display in the TopLeft zone.
 */
class GroupTools extends React.Component {
    public render(): React.ReactNode {
        const horizontalItems: CommonToolbarItem[] = ToolbarHelper.createToolbarItemsFromItemDefs([
            CoreTools.measureToolGroup,
            CoreTools.sectionToolGroup,
        ]);
        const verticalItems: CommonToolbarItem[] = ToolbarHelper.createToolbarItemsFromItemDefs([
            CoreTools.selectElementCommand,

            //엘리멘트를 눌렀을때 숨기기, 분리, 강조하기 tool
            // SelectionContextToolDefinitions.hideElementsItemDef,
            // SelectionContextToolDefinitions.isolateElementsItemDef,
            // SelectionContextToolDefinitions.emphasizeElementsItemDef,
        ]);

        return (
            <ToolWidgetComposer
                horizontalToolbar={
                    <ToolbarComposer
                        items={horizontalItems}
                        usage={ToolbarUsage.ContentManipulation}
                        orientation={ToolbarOrientation.Horizontal}
                    />
                }
                verticalToolbar={
                    <ToolbarComposer
                        items={verticalItems}
                        usage={ToolbarUsage.ContentManipulation}
                        orientation={ToolbarOrientation.Vertical}
                    />
                }
            />
        );
    }
}
class RemainderTools extends React.Component {
    public render(): React.ReactNode {
        const verticalItems: CommonToolbarItem[] = ToolbarHelper.createToolbarItemsFromItemDefs([
            CoreTools.flyViewCommand,
            CoreTools.keyinBrowserButtonItemDef,
            CoreTools.keyinPaletteButtonItemDef,
            CoreTools.restoreFrontstageLayoutCommandItemDef,
            CoreTools.toggleCameraViewCommand,
            CoreTools.zoomViewCommand,
        ]);

        return (
            <ToolWidgetComposer
                verticalToolbar={
                    <ToolbarComposer
                        items={verticalItems}
                        usage={ToolbarUsage.ContentManipulation}
                        orientation={ToolbarOrientation.Vertical}
                    />
                }
            />
        );
    }
}
