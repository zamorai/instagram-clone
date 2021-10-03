import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'
import { doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../lib/firebase';
import { UserContext } from '../lib/context'
import { storage } from '../lib/firebase'
import toast from 'react-hot-toast';

export default function ImageUploader() {
    const user = useContext(UserContext)
    const[uploading, setUploading] = useState(false)
    const[progress, setProgress] = useState(0)
    const[theDownloadURL, setTheDownloadURL] = useState(null)
    const[fileName, setFileName] = useState('')

    function makeid() {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 24; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    const uploadImage = async (e) => {
        // Get image
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];
        const identifier = makeid()
        const fileIdent = `${identifier}.${extension}`

        setFileName(identifier)

        // Make reference to storage bucket location
        const storageRef = ref(storage, `uploads/${user.uid}/${fileIdent}`);
        setUploading(true)

        // Starts the upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const pgs = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
                setProgress(pgs)
            }, 
            (error) => {
                console.log(error)
            }, 
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setTheDownloadURL(downloadURL)
                    setUploading(false)
                    toast.success("Image successfully uploaded",  {
                        style: {
                          padding: '16px',
                          fontSize: '1.5rem'
                        },
                    
                      })
                });
            }
        )
    }

    useEffect(() => {
        async function updateFirebase() {
            if(user){
                const userDoc = doc(firestore, `users/${user.uid}/posts/${fileName}`)
                await setDoc(userDoc, {imageId: fileName, downloadURL: theDownloadURL, user:user.uid, ready: true}, {merge: true})
            }
        }
        updateFirebase()
        
    }, [theDownloadURL])

    return (
        <div>
            {uploading && <h3>{progress}%</h3>}
            {!uploading && (

                <input type="file" onChange={uploadImage} accept="image/x-png,image/gif,image/jpeg" />

            )}
        </div>
    )
}
