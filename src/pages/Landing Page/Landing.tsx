import MockAppleBrowser from "./MockAppleBrowser"
import { FeaturesSectionDemo } from "./FeatureSection"
import { GridSmallBackgroundDemo } from "./GridBackground"
import Header from "./Header"

const Landing = () => {
  return (
    <div className="mx-auto w-full border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x">
      <Header></Header>
      <GridSmallBackgroundDemo />
      <div className='p-2'>
        <MockAppleBrowser />
        <FeaturesSectionDemo />
      </div>
    </div>
  )
}

export default Landing