import YooptaEditor, { createYooptaEditor, YooptaMark, generateId } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Divider from '@yoopta/divider'
import Blockquote from '@yoopta/blockquote';
import Table from '@yoopta/table';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useFolderStore from '@/store/folderStore';
import useEditorStore from '@/store/editorStore';
import useProjectStore from '@/store/projectStore';
import useEditChangesStore from '@/store/changes';
import FileSetter from './FileSetter';
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler';
import useUserStore from '@/store/userStore';
import { markdown } from '@yoopta/exports';
import Image from '@yoopta/image'
import File from '@yoopta/file'
import Video from '@yoopta/video'

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
  Divider,
  Table,
  Image,
  File,
  Video
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
  const axiosInstance = useAxiosWithToast()
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const [editorID, setEditorID] = useState(generateId())
  const [pageContent, setPageContent] = useState<any>(undefined);
  const selectedFolder = useFolderStore(state => state.selectedFolder)
  const { setContent, setInitialContent, setMarkdown, setEditor } = useEditorStore((state) => state);
  const project = useProjectStore(state => state.project)
  const { user } = useUserStore((state) => state);
  const { isEditing, editedFiles } = useEditChangesStore(state => state)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedFolder?.id) return;
    if (isEditing) {
      const editedFile = editedFiles.find((file) => file.id === selectedFolder.id);
      if (editedFile) {
        setPageContent(editedFile.changedContent);
        setInitialContent(editedFile.changedContent);
        return;
      }
    }

    // Fetch file content if not found in the edited files
    axiosInstance
      .get(`/file/get`, {
        params: {
          proj: project?.Id,
          file: selectedFolder?.id,
          t: user?.Type
        },
      })
      .then((response) => {
        let base64 = response.data;
        if (!base64) {
          setPageContent([]);
          return;
        }
        let content = atob(base64);
        let obj = JSON.parse(content);
        setPageContent(obj);
        setInitialContent(obj)
      })
      .catch((error) => {
        console.error("Error fetching file content:", error);
      });
  }, [selectedFolder])

  useEffect(() => {
    setEditorID(generateId())
    setEditor(editor)
  }, [pageContent, isEditing])

  const onChange = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const data = editor.getEditorValue();
      const markdownString = markdown.serialize(editor, data);
      setEditor(editor);
      setContent(data);
      setMarkdown(markdownString);
    }, 300); // Adjust the delay as needed
  }, [editor])

  return (
    <div
      className={`w-full ${isEditing && "pl-[56px]"}  pb-[40px] flex justify-center`}
      ref={selectionRef}
    >
      <YooptaEditor
        placeholder='Let create your very own document'
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
        readOnly={!isEditing}
        onChange={onChange}
      />
      <FileSetter />
    </div>
  );
}

export default Editor