import { Outlet } from "react-router-dom"

const Members = () => {
  return (
    <div className='flex flex-col'>
      <header>
        <h3 className="text-xl font-bold">Members</h3>
        <p className="text-muted-foreground">
          Manage your members for this particular project according to your preference.
        </p>
      </header>
      <main className="mt-10">
        <Outlet></Outlet>
      </main>

    </div>
  )
}

export default Members