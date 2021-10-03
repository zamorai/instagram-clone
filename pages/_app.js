import '../styles/globals.css'
import { UserContext } from '../lib/context';
import { useAuthState } from'react-firebase-hooks/auth';
import { auth } from '../lib/firebase'
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {

  const [user] = useAuthState(auth)
  const router = useRouter()

  const showHeader = router.pathname === '/welcome' ? false : true;

  return (
    <UserContext.Provider value={user}>
      {showHeader && <NavBar />}
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
