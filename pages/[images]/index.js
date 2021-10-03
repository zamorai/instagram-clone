import React, { useContext, useEffect, useState } from 'react'
import { firestore} from '../../lib/firebase';
import {query, collectionGroup, where, getDocs, doc, getDoc } from '@firebase/firestore';
import { useRouter } from 'next/router';
import { UserContext } from '../../lib/context';

export default function index() {
    const user = useContext(UserContext)
    const[image, setImage] = useState(null)
    const router = useRouter();

    useEffect(() => {
        const getImage = async () => {
            if (user) {
                const q = query(collectionGroup(firestore, 'posts'))
                const qSnapshot = await getDocs(q)
                qSnapshot.forEach((doc) => {
                    if (`/${doc.data().imageId}` === router.asPath) {
                        setImage(doc.data())
                    }
                  })
            }
        }
        getImage()
    }, [])

    

    return (
        <div>
            {image ? <img className="single-img" src={image.downloadURL} /> : ''}
        </div>
    )
}
