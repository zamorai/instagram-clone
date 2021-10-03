import { useContext } from "react"
import { UserContext } from "../lib/context"
import Link from 'next/link'

export default function AuthCheck(props) {
    const user = useContext(UserContext)
    return user ? props.children : props.fallback || <Link href="/welcome">Enter the password</Link>;
}
