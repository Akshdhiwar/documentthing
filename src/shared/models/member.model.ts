interface Member {
    id : string
    avatar : string
    name : string 
    role : string
    isActive : string
}

interface UserDetails extends Member {
    email : string
    githubName : string
    twitter : string
    company : string
}