import { useContext } from "react"
import { UserContext } from "../lib/context"
import Link from 'next/link';
import ImageUploader from "./ImageUploader";


export default function NavBar() {
    const user = useContext(UserContext)

    return (
        <nav className="header-container">

            <div className="pointer">
                <Link href="/">
                    <img className="logo" src={'/logo.png'} alt="photo logo" />
                </Link>
            </div>

            <div className="header-userinfo">
                <div>
                    <ImageUploader />
                </div>
                <div className='pointer'>
                    <Link href='/admin'> 
                        <img className='header-userimage' src={user?.photoURL} />
                    </Link>
                </div>
            </div>
        </nav>
    )
}
