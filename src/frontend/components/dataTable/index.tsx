import React, { useState, useEffect, useRef } from "react";
import Handsontable from "handsontable";
import { Button } from "@material-ui/core";
import "./DataTable.css";
import { StateContext } from "../../context";

interface needed {
    data: any;
    style?: any;
    id: number;
}

export const DataTableComp = (props: needed) => {
    const { iModelFileName } = React.useContext(StateContext);
    const conRef = useRef<HTMLDivElement>(null);
    const data = props.data;
    const [id, setId] = useState(props.id);
    const [hotty, setHotty] = useState();
    var columns = Object.keys(data[id][0]);
    // only have to do it once honestly

    useEffect(() => {
        if (props.data.length != 0) {
            setId(props.id);
        }
    }, [id]);

    useEffect(() => {
        if (conRef.current != null) {
            var hotty = new Handsontable(conRef.current, {
                data: data[id],
                colHeaders: columns,
                filters: true,
                licenseKey: "non-commercial-and-evaluation",
            });
            var x = JSON.stringify({ data: hotty.getData() });
            var c = JSON.parse(x);
        }
    }, [conRef]);

    // var hot:any = new Handsontable(container!,{
    //     data: data[id],
    //     colHeaders: true,
    //     rowHeaders: true,
    //     filters: true,
    //     licenseKey: 'non-commercial-and-evaluation'
    // });

    function saveData() {
        // var res = JSON.stringify({data:hot.getData()});
        if (conRef.current != null) {
            var hotty = new Handsontable(conRef.current, {
                data: data[id],
                colHeaders: columns,
                filters: true,
                width: "100%",
                height: "100%",
                licenseKey: "non-commercial-and-evaluation",
                stretchH: "all",
            });
        }
        var z = hotty!.getData();
        var counter = z[0].length;
        var x = JSON.stringify({ data: hotty!.getData() });
        localStorage.setItem(`datas-${iModelFileName}`, JSON.stringify(x));
        var fresh = [];
        for (var i = 0; i < z.length; i++) {
            let _obj = {};
            for (var v = 0; v < counter; v++) {
                Object.assign(_obj, { [columns[v]]: z[i][v] });
            }
            fresh.push(_obj);
        }
        data[id] = fresh;
        localStorage.setItem(`datas-${iModelFileName}`, JSON.stringify(data));
    }

    return (
        <div id="example1" ref={conRef}>
            <div className="hello">
                <button
                    onClick={() => {
                        saveData();
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
