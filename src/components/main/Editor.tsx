import YooptaEditor, { createYooptaEditor, YooptaMark } from '@yoopta/editor';
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
import { useContext, useEffect, useMemo, useRef } from 'react';
import { FolderContext } from '@/context/FolderContext';
import axios from 'axios';
import { EditorContext } from '@/context/EditorContext';

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
    axios.get(`http://localhost:3000/api/v1/file/${folder.selected?.fileId}`).then(data => {
      let content = JSON.parse(data.data.content)
      editor.setEditorValue(content)
    })
  }, [folder?.selected])

  return (
    <div
      className="w-full pt-[80px] px-2 pl-[56px] pb-[40px] flex justify-center"
      ref={selectionRef}
    >
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        width={100}
        // value={WITH_BASIC_INIT_VALUE}
        autoFocus
        className="yoopta-editor"
      />
    </div>
  );
}

export default Editor