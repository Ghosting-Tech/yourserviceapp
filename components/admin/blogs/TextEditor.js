"use client";
import React, { useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ formData, setFormData }) => {
  const [content, setContent] = useState(formData.content);
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: content || "Start typing...",
      allowResizeX: true,
      allowResizeY: true,
      height: "80vh",
      uploader: {
        insertImageAsBase64URI: true,
      },
      toolbarSticky: false,
    }),
    [content]
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={(newContent) =>
          setFormData({ ...formData, content: newContent })
        }
      />
      {/* <div>{HTMLReactParser(formData.content)}</div> */}
    </>
  );
};

export default TextEditor;
