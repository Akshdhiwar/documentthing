import Link from "@/components/custom/Link"


const sidebarNavItems = [
  {
    title: "Members",
    href: "members",
  }
]

const Sidenav = () => {
  return (
    <div>
      {
        sidebarNavItems.map(nav => (
          <Link key={nav.title} label={nav.title} href={nav.href}></Link>
        ))
      }
    </div>
  )
}

export default Sidenav