import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useAxiosWithToast from '@/shared/axios intercepter/axioshandler'
import useProjectStore from '@/store/projectStore'
import { useState } from 'react'

const PublishVisit = () => {
  const axiosInstance = useAxiosWithToast()
  const project = useProjectStore(state => state.project)
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function publish() {
    setLoading(true)
    try {
      await axiosInstance.post("/public/publish", {
        project_id: project?.Id
      }).then(() => {
        setIsPublished(true);
        setLoading(false)
      })
    } catch (error) {
      console.error("Failed to publish:", error)
      setLoading(false)

    }
  }

  return project?.Published || isPublished ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={`https://${project?.Name?.toLowerCase() || "your-project"}.documentthing.com`} target='_blank' className='text-sm'>
          Visit docs
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{project?.Name?.toLowerCase() || "your-project"}.documentthing.com</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" disabled={loading} onClick={publish}>Publish</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Publish your documentation to the internet.</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default PublishVisit
