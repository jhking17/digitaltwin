import React, { useState, useEffect } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import "./index.css";

export type EditorProps = {
    edit: boolean;
    onChangeContent: (content: string) => void;
    content?: any;
};

interface FinalEditorProps extends EditorProps {}
export const EditorComp: React.FunctionComponent<FinalEditorProps> = props => {
    const [content, setContent] = useState<any>(props.content);

    const onHandleModel = (model: any) => {
        setContent(model);
        if (props.edit) {
            console.log(model);
            props.onChangeContent(model);
        }
    };

    if (props.edit)
        return (
            <FroalaEditor
                config={{
                    key: process.env.REACT_APP_FROALA_LICENSE_KEY,
                    toobarBottom: false,
                    height: "30vh",
                }}
                tag="textarea"
                model={content}
                onModelChange={onHandleModel}
            />
        );
    else return <FroalaEditorView model={props.content} />;
};
