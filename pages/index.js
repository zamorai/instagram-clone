import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../lib/context'
import Loader from '../components/Loader'
import { collectionGroup, query, onSnapshot, getDocs, doc, deleteDoc} from '@firebase/firestore'
import ImageGallery from '../components/ImageGallery'
import { signOut } from '@firebase/auth'
import { auth, firestore } from '../lib/firebase'
import { ref, deleteObject } from 'firebase/storage'


export async function getServerSideProps(context) {

  const imgs = []

  const q = query(collectionGroup(firestore, 'posts'))
  const qSnapshot = await getDocs(q)
  qSnapshot.forEach((doc) => {
    imgs.push(doc.data())
  })

  return {
    props: { imgs }, // will be passed to the page component as props
  }
}

export default function Home({ imgs }) {
  const user = useContext(UserContext)
  const[images, setImages] = useState(imgs)
  const[loading, setLoading] = useState(false)
  const[imagesEnd, setImagesEnd] = useState(false);

  useEffect(() => {
    console.log(images)
  }, [images])


  return (
    <div>
      <Head>
        <title>Instagram Clone</title>
        <meta name="upload your images here and share with your friends!" content="Instagram clone to display nextjs and firebase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ImageGallery match={false} images={images} />
      <SignOutButton />

    </div>
  )
}

const SignOutButton = () => {
  return <button onClick={() => signOut(auth)}>sign out</button>
}