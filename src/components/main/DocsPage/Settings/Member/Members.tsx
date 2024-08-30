import { Outlet } from "react-router-dom"

const Members = () => {
  return (
    <main className="pt-10 h-full">
      <Outlet></Outlet>
    </main>
  )
}

export default Members