import Link from "@/components/custom/Link"


const sidebarNavItems = [
    {
      title: "Members",
      href: "members",
    },
    {
      title: "Account",
      href: "account",
    },
    {
      title: "Appearance",
      href: "appearance",
    },
    {
      title: "Notifications",
      href: "notifications",
    },
    {
      title: "Display",
      href: "display",
    },
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