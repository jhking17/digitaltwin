import { Point3d } from "@bentley/geometry-core";

export const deleteSpecialChar2List = (str: string) => {
    return str.replace(/"/gi, "").replace(/\[/gi, "").replace(/\]/gi, "").split(",");
};
export const convertToPoint3d = (points: string | null): Point3d[] => {
    if (points && points.length > 0) {
        const _pointContainer = deleteSpecialChar2List(points);
        const _list = [];
        if (_pointContainer.length < 3)
            console.error("Error: PointContainer's length is less than 3");
        for (var i = 0; i < _pointContainer.length; i += 3) {
            _list.push(
                new Point3d(
                    parseFloat(_pointContainer[i]),
                    parseFloat(_pointContainer[i + 1]),
                    parseFloat(_pointContainer[i + 2])
                )
            );
        }
        return _list;
    }
    return [];
};
