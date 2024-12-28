import useAxiosWithToast from "@/shared/axios intercepter/axioshandler";
import useProjectStore from "@/store/projectStore";
import { exportToSvg, MainMenu } from "@excalidraw/excalidraw"
import { ChevronsLeft, Github } from "lucide-react"
import React from "react";
import { useNavigate, useParams } from "react-router-dom"

type CustomMenuInterface = {
    excalidrawApi: any;
}

const CustomMainMenu: React.FC<CustomMenuInterface> = ({ excalidrawApi }) => {
     const { folderID } = useParams()
    const axiosInstance = useAxiosWithToast();
    const navigate = useNavigate()
    const {project} = useProjectStore(state => state);

    const goToDashboard = () => {
        navigate("/dashboard")
    }

    async function saveDrawing(){
        if (!excalidrawApi) {
            return
        }

        let response = await axiosInstance.post("/commit/edits", {
            project_id: project?.Id,
            content: [{
                type : "folder",
                path : `${folderID}/${folderID}.json`,
                changedContent: JSON.stringify(excalidrawApi.getSceneElements())
            }],
            message: "updated" ,
            branch_name: "main",
            pr: false
        })

        console.log(response)
    }

    return (
        <MainMenu>
            <MainMenu.Item onSelect={() => { goToDashboard() }} icon={<ChevronsLeft></ChevronsLeft>}>
                Go to dashboard
            </MainMenu.Item>
            <MainMenu.Group title="File">
                <MainMenu.DefaultItems.LoadScene />
            </MainMenu.Group>
            <MainMenu.Separator></MainMenu.Separator>
            <MainMenu.Group title="Save">
                <MainMenu.Item onSelect={() => {
                    saveDrawing()
                }} icon={<Github></Github>}>
                    Save to Github
                </MainMenu.Item>
                <MainMenu.DefaultItems.Export />
                <MainMenu.DefaultItems.SaveAsImage />
            </MainMenu.Group>
            <MainMenu.Separator></MainMenu.Separator>
            <MainMenu.Group title="Others">
                {/* <MainMenu.DefaultItems.SaveToActiveFile /> */}
                <MainMenu.DefaultItems.Help />
                <MainMenu.DefaultItems.ClearCanvas />
                <MainMenu.DefaultItems.ToggleTheme />
            </MainMenu.Group>
            <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
    )
}

export default CustomMainMenu