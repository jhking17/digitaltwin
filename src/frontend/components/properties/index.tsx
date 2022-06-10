/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import {
    PresentationPropertyDataProvider,
    usePropertyDataProviderWithUnifiedSelection,
} from "@bentley/presentation-components";
import { FillCentered, Orientation, useDisposable } from "@bentley/ui-core";
import { VirtualizedPropertyGridWithDataProvider } from "@bentley/ui-components";

/** React properties for the property grid component */

export type simplePropertiesProps = {
    /** iModel whose contents should be displayed in the property grid */
    imodel: IModelConnection;
    /** Orientation of the PropertyGrid rows */
    orientation: Orientation;
};
export interface FinalSimplePropertiesProps extends simplePropertiesProps {}

/** Property grid component for the viewer app */
export const SimplePropertiesComponent: React.FunctionComponent<FinalSimplePropertiesProps> =
    props => {
        // eslint-disable-line @typescript-eslint/naming-convention
        const dataProvider = useDisposable(
            React.useCallback(
                () => new PresentationPropertyDataProvider({ imodel: props.imodel }),
                [props.imodel]
            )
        );
        const { isOverLimit } = usePropertyDataProviderWithUnifiedSelection({ dataProvider });
        let content: JSX.Element;
        if (isOverLimit) {
            content = <FillCentered>{"Too many elements."}</FillCentered>;
        } else {
            content = (
                <VirtualizedPropertyGridWithDataProvider
                    dataProvider={dataProvider}
                    isPropertyHoverEnabled={true}
                    orientation={Orientation.Horizontal}
                    horizontalOrientationMinWidth={300}
                />
            );
        }

        return content;
    };
