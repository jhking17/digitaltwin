"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geometry_core_1 = require("@bentley/geometry-core");
exports.deleteSpecialChar2List = (str) => {
    return str.replace(/"/gi, "").replace(/\[/gi, "").replace(/\]/gi, "").split(",");
};
exports.convertToPoint3d = (points) => {
    if (points && points.length > 0) {
        const _pointContainer = exports.deleteSpecialChar2List(points);
        const _list = [];
        if (_pointContainer.length < 3)
            console.error("Error: PointContainer's length is less than 3");
        for (var i = 0; i < _pointContainer.length; i += 3) {
            _list.push(new geometry_core_1.Point3d(parseFloat(_pointContainer[i]), parseFloat(_pointContainer[i + 1]), parseFloat(_pointContainer[i + 2])));
        }
        return _list;
    }
    return [];
};
//# sourceMappingURL=utils.js.map