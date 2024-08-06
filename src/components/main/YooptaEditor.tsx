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
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FolderContext } from '@/Context&Providers/context/FolderContext';
import { EditorContext } from '@/Context&Providers/context/EditorContext';
import axiosInstance from '@/shared/axios intercepter/axioshandler';

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
  const folder = useContext(FolderContext)
  const editorContext = useContext(EditorContext)
  const [editorID, setEditorID] = useState(generateId())
  const [pageContent, setPageContent] = useState<YooptaContentValue | undefined>(undefined);

  

  useEffect(() => {
    function handleChange(value: any) {
      console.log('value', value);
    }
    editorContext?.setEditor(editor)
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor]);

  useEffect(() => {
    if (folder?.selected?.fileId === undefined) return
    axiosInstance.get(`/file/${folder.selected?.fileId}`).then(data => {
      let content = JSON.parse(data.data.content)
      setPageContent(content)
    })
  }, [folder?.selected])

  useEffect(()=>{
    setEditorID(generateId)
  },[pageContent])

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