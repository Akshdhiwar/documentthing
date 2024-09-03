import YooptaEditor, { createYooptaEditor, YooptaMark, generateId, YooptaContentValue } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '@/shared/axios intercepter/axioshandler';
import useFolderStore from '@/store/folderStore';
import useEditorStore from '@/store/editorStore';
import useProjectStore from '@/store/projectStore';

const plugins: any = [
  Paragraph,
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS: YooptaMark<any>[] = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
const Editor = () => {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const [editorID, setEditorID] = useState(generateId())
  const [pageContent, setPageContent] = useState<YooptaContentValue | undefined>(undefined);
  const selectedFolder = useFolderStore(state => state.selectedFolder)
  const setEditor = useEditorStore(state => state.setEditor)
  const project = useProjectStore(state => state.project)

  useEffect(() => {
    function handleChange() {
      // console.log('value', value);
    }
    setEditor(editor)
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor]);

  useEffect(() => {
    if (selectedFolder?.id === undefined) return
    axiosInstance.get(`/file/get`, {
      params: {
        proj: project?.Id,
        file: selectedFolder?.id
      }
    }).then(data => {
      let base64 = data.data
      if (base64 === "") {
        setPageContent({})
        return
      }
      let content = atob(base64)
      let obj = JSON.parse(content)
      setPageContent(JSON.parse(obj))
    })
  }, [selectedFolder])

  useEffect(() => {
    setEditorID(generateId)
  }, [pageContent])

  return (
    <div
      className="w-full pt-[80px] px-2 pl-[56px] pb-[40px] flex justify-center"
      ref={selectionRef}
    >
      <YooptaEditor
        key={editorID}
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        width={100}
        value={pageContent}
        autoFocus
        className="yoopta-editor"
      />
    </div>
  );
}

export default Editor