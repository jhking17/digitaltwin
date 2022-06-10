import React, { useState, useEffect } from "react";
import {
    ISelectionProvider,
    Presentation,
    SelectionChangeEventArgs,
} from "@bentley/presentation-frontend";
import { Button, ButtonType, Toggle, LabeledToggle, useRefEffect } from "@bentley/ui-core";
import { ColorDef } from "@bentley/imodeljs-common";
import "./emph.css";
import {
    EmphasizeAction,
    ClearEmphasizeAction,
    IsolateAction,
    ClearIsolateAction,
} from "./EmphasizeElementsApp";
import { IModelApp, EmphasizeElements, FitViewTool } from "@bentley/imodeljs-frontend";
import * as S from "./EmphasizeElementsUI.styled";
import { Id64Arg } from "@bentley/bentleyjs-core";
interface EmphasizeElementsState {}
const EmphasizeElementsUI: React.FunctionComponent<EmphasizeElementsState> = () => {
    //selectionIsEmpty
    const [isSelEmpty, setIsSelEmpty] = useState<boolean>(true);
    //emphasizeIsActive
    const [isEmpActive, setIsEmpActive] = useState<boolean>(false);
    //isolateIsActive
    const [isIsoActive, setIsIsoActive] = useState<boolean>(false);

    const [selectedElements, setSelectedElements] = useState<Id64Arg>("");
    //wantEmphasis

    const [isZoom, setIsZoom] = useState<boolean>(false);

    const [index, setIndex] = useState<string | null>("");

    useEffect(() => {
        Presentation.selection.selectionChange.addListener(_onSelectionChanged);
    }, []);

    useEffect(() => {
        const vp = IModelApp.viewManager.selectedView;
        if (vp) {
            if (isZoom) {
                vp.zoomToElements(selectedElements, { animateFrustumChange: false });
            } else {
                // IModelApp.tools.run(FitViewTool.toolId, vp);
            }
        }
    }, [isZoom]);

    const _onSelectionChanged = (
        e: SelectionChangeEventArgs,
        selectionProvider: ISelectionProvider
    ) => {
        const selection = selectionProvider.getSelection(e.imodel, e.level);
        setIsSelEmpty(selection.isEmpty);
        const elementsIter = e.imodel.selectionSet.elements.values();
        let _list = [];
        for (const ele of elementsIter) {
            _list.push(ele);
        }
        setSelectedElements(_list);
    };
    //그룹에 추가
    //정확히 어떤 기능을 하는지 모르므로 일단 스킵
    //그룹화 기능이 어떤것인지 확실해 지면 적용
    const _testActionButton = () => {
        // if (index === "") {
        //     setIndex("0");
        //     localStorage.setItem("0", zoomTo);
        //     localStorage.setItem("index", "0");
        //     return;
        // }
        // if (index != null) {
        //     var currentIndex = Number(index) + 1;
        //     setIndex(currentIndex.toString());
        //     localStorage.setItem(currentIndex.toString(), zoomTo);
        //     localStorage.setItem("index", currentIndex.toString());
        // }
    };

    const emphasizeElements = () => {
        setIsEmpActive(!isEmpActive);
        if (!isEmpActive) {
            new EmphasizeAction(true).run();
        } else {
            new ClearEmphasizeAction().run();
        }
    };
    const isolateElements = () => {
        //For Each View Port (모두 분리 원할시)
        setIsIsoActive(!isIsoActive);
        const vp = IModelApp.viewManager.selectedView;
        if (vp) {
            const emph = EmphasizeElements.getOrCreate(vp);
            if (!isIsoActive) {
                emph.isolateSelectedElements(vp);
            } else {
                emph.clearIsolatedElements(vp);
            }
        }
    };
    return (
        <S.Wrapper>
            <Button onClick={_testActionButton} disabled={isSelEmpty}>
                추가
            </Button>
            <Button buttonType={ButtonType.Blue} onClick={emphasizeElements}>
                {isEmpActive ? "비활성" : "강조"}
            </Button>
            <LabeledToggle
                isOn={isZoom}
                onChange={() => setIsZoom(!isZoom)}
                label="확대"
                disabled={isSelEmpty}
            />
            <LabeledToggle isOn={isIsoActive} onChange={isolateElements} label="분리" />
        </S.Wrapper>
    );
};
export default EmphasizeElementsUI;

// const vp = IModelApp.viewManager.selectedView;
// if (selectedElements !== "") {
//     new EmphasizeAction(true).run()
// }
// if (isIsolate && type === ActionType.Isolate) {
//     if (!isIsoActive) {
//         if (new IsolateAction().run()) {
//             setIsIsoActive(true);
//             setName("비활성");
//         }
//         if (isZoom) {
//             vp?.zoomToElements(zoomTo, { animateFrustumChange: false });
//         }
//     } else {
//         if (new ClearIsolateAction().run()) {
//             setIsIsoActive(false);
//             setName("Isolate");
//             setIsSelEmpty(true);
//         }
//     }
// } else {
//     if (!isEmpActive) {
//         if (new EmphasizeAction(emphasis).run()) {
//             setIsEmpActive(true);
//             setName("비활성");
//         }
//         if (isZoom) {
//             vp?.zoomToElements(zoomTo, { animateFrustumChange: false });
//         }
//     } else {
//         if (new ClearEmphasizeAction().run()) {
//             setIsEmpActive(false);
//             setName("강조");
//             setIsSelEmpty(true);
//         }
//     }
// }
// import * as React from "react";
// import {
//     ISelectionProvider,
//     Presentation,
//     SelectionChangeEventArgs,
// } from "@bentley/presentation-frontend";
// import { Button, ButtonType, Toggle, LabeledToggle } from "@bentley/ui-core";
// import { ColorPickerButton } from "@bentley/ui-components";
// import { ColorDef } from "@bentley/imodeljs-common";
// import "./emph.css";
// import {
//     EmphasizeAction,
//     ClearEmphasizeAction,
//     IsolateAction,
//     ClearIsolateAction,
// } from "./EmphasizeElementsApp";
// import { IModelApp, EmphasizeElements, ScreenViewport } from "@bentley/imodeljs-frontend";

// enum ActionType {
//     Emphasize = "Emphasize",
//     Isolate = "Isolate",
// }
// interface EmphasizeElementsState {
//     selectionIsEmpty: boolean;
//     emphasizeIsActive: boolean;
//     hideIsActive: boolean;
//     isolateIsActive: boolean;
//     overrideIsActive: boolean;
//     wantEmphasis: boolean;
//     colorValue: ColorDef;
//     name: string;
//     zoomTo: string;
//     isZoom: boolean;
//     isIsolate: boolean;
//     isSpecificIsolate: boolean;
//     index: string | null;
//     //could do much more but i dont think it is taht much necessary atm
// }

// export default class EmphasizeElementsUI extends React.Component<
//     { iModelName: string },
//     EmphasizeElementsState
// > {
//     /** Creates an Sample instance */
//     constructor(props?: any) {
//         super(props);
//         this.state = {
//             selectionIsEmpty: true,
//             emphasizeIsActive: false,
//             hideIsActive: false,
//             isolateIsActive: false,
//             overrideIsActive: false,
//             wantEmphasis: true,
//             colorValue: ColorDef.red,
//             name: "강조",
//             zoomTo: "",
//             isZoom: false,
//             isIsolate: false,
//             isSpecificIsolate: false,
//             index: localStorage.getItem("index") != null ? localStorage.getItem("index") : "",
//         };
//         Presentation.selection.selectionChange.addListener(this._onSelectionChanged);
//     }

//     private _onSelectionChanged = (
//         evt: SelectionChangeEventArgs,
//         selectionProvider: ISelectionProvider
//     ) => {
//         const selection = selectionProvider.getSelection(evt.imodel, evt.level);
//         this.setState({ selectionIsEmpty: selection.isEmpty });
//         let x = evt.imodel.selectionSet.elements.values().next().value;
//         console.log(evt.imodel.selectionSet.elements);
//         console.log("This is the ID", x);
//         console.log(evt.imodel.selectionSet.elements.values().next());
//         if (evt.imodel.selectionSet.elements.size == 1) {
//             this.setState({
//                 zoomTo: x,
//             });
//         } else {
//             let x = evt.imodel.selectionSet.elements;
//             var all = "";
//             for (var z of x) {
//                 console.log(z);
//                 all += z;
//             }
//             this.setState({
//                 zoomTo: all,
//             });
//             //added downgrade in config
//         }
//     };

//     private _testActionButton = () => {
//         if (this.state.index == "") {
//             this.setState({
//                 index: "0",
//             });
//             localStorage.setItem("0", this.state.zoomTo);
//             localStorage.setItem("index", "0");
//             return;
//         }
//         if (this.state.index != null) {
//             // const vp = IModelApp.viewManager.selectedView;
//             var currentIndex = Number(this.state.index) + 1;
//             this.setState({
//                 index: currentIndex.toString(),
//             });
//             localStorage.setItem(currentIndex.toString(), this.state.zoomTo);
//             localStorage.setItem("index", currentIndex.toString());
//         }
//         //localStorage.setItem("item 1", JSON.stringify(vp));
//         // if(vp){
//         //   if(this.state.isSpecificIsolate){
//         //     new EmphasizeElements().isolateElements("0x20000000126",vp);
//         //   } else {
//         //     new EmphasizeElements().clearIsolatedElements(vp);
//         //   }
//         //   this.setState({ isSpecificIsolate : !this.state.isSpecificIsolate });
//         // }
//         // return{
//         // }
//     };

//     private _handleActionButton = (type: ActionType) => {
//         if (type == ActionType.Isolate && this.state.isIsolate == true) {
//             if (type == ActionType.Isolate && this.state.isolateIsActive == false) {
//                 const vp = IModelApp.viewManager.selectedView;
//                 if (new IsolateAction().run()) {
//                     this.setState({
//                         isolateIsActive: true,
//                         name: "비활성",
//                     });
//                 }
//                 if (this.state.isZoom == true) {
//                     vp?.zoomToElements(this.state.zoomTo, { animateFrustumChange: false });
//                 }
//             } else {
//                 if (new ClearIsolateAction().run())
//                     this.setState({
//                         isolateIsActive: false,
//                         name: "Isolate",
//                         selectionIsEmpty: true,
//                     });
//             }
//         } else {
//             if (this.state.emphasizeIsActive == false) {
//                 const vp = IModelApp.viewManager.selectedView;
//                 if (new EmphasizeAction(this.state.wantEmphasis).run()) {
//                     this.setState({
//                         emphasizeIsActive: true,
//                         name: "비활성",
//                     });
//                 }
//                 if (this.state.isZoom == true) {
//                     vp?.zoomToElements(this.state.zoomTo, { animateFrustumChange: false });
//                 }
//             } else {
//                 if (new ClearEmphasizeAction().run())
//                     this.setState({
//                         emphasizeIsActive: false,
//                         name: "강조",
//                         selectionIsEmpty: true,
//                     });
//             }
//         }
//     };

//     public render() {
//         /* <div id ="emph" >
//             <button id="button" type = "button" onClick={()=>{this._handleActionButton(ActionType.Emphasize)}} disabled={this.state.selectionIsEmpty}>{this.state.name}
//             </button>
//             <LabeledToggle isOn={this.state.isZoom} onChange={() => this.setState((prevState) => ({ isZoom: !prevState.isZoom }))} label="Zoom" />
//             </div> */
//         return (
//             <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
//                 <Button onClick={this._testActionButton} disabled={this.state.selectionIsEmpty}>
//                     추가
//                 </Button>
//                 <Button
//                     buttonType={ButtonType.Blue}
//                     id="realbutton"
//                     onClick={() => {
//                         this._handleActionButton(ActionType.Isolate);
//                     }}
//                     disabled={this.state.selectionIsEmpty}
//                 >
//                     {this.state.name}
//                 </Button>
//                 <LabeledToggle
//                     isOn={this.state.isZoom}
//                     onChange={() => this.setState(prevState => ({ isZoom: !prevState.isZoom }))}
//                     label="확대"
//                 />
//                 <LabeledToggle
//                     isOn={this.state.isIsolate}
//                     onChange={() =>
//                         this.setState(prevState => ({ isIsolate: !prevState.isIsolate }))
//                     }
//                     label="분리"
//                 />
//             </div>
//         );
//     }
// }
