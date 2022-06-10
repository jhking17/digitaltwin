import * as XLSX from "xlsx";

const convertToJson = csv => {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            if (currentline[j]) obj[headers[j]] = currentline[j];
        }
        if (Object.keys(obj).length > 0) result.push(obj);
    }

    return result;
};

export const readFile = async f => {
    var name = f.name;
    return new Promise(r => {
        const reader = new FileReader();
        reader.onload = evt => {
            // evt = on_file_select event
            /* Parse data */
            if (evt.target) {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                /* Update state */

                return r(convertToJson(data));
            }
        };
        reader.readAsBinaryString(f);
    });
};
