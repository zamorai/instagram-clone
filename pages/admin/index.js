import { collection, getDocs, deleteDoc, doc } from "@firebase/firestore"
import { useContext, useEffect, useState } from "react"
import ImageGallery from "../../components/ImageGallery"
import { UserContext } from "../../lib/context"
import { firestore } from "../../lib/firebase"
import toast from 'react-hot-toast';
import AuthCheck from "../../components/AuthCheck"

export default function Admin() {
    const user = useContext(UserContext);
    const [images, setImages] = useState([])

    useEffect(() => {
        const getImages = async () => {
            const tempImages = []
            if(user) {
                const imageRef = await getDocs(collection(firestore, `users/${user.uid}/posts`));
                imageRef.forEach(doc => {
                    tempImages.push(doc.data())
                })
                setImages(tempImages)
            }
        }
        getImages()
        
    }, [images])

    const deleteImage = async (id) => {
        // Delete the file from firestore
        const confirmDelete = confirm("Do you want to delete this image?");
        if (confirmDelete) {
          await deleteDoc(doc(firestore, `users/${user.uid}/posts/${id}`))
          toast.success('Image successfully deleted', {
            style: {
              padding: '16px',
              fontSize: '1.5rem'
            },
            icon: '🗑️'
          });
        }
        
        // Delete the file from storage
        // TODO: create another field in firestore to upload with the path to the storage, 
        // then query the path here and use it to delete the file in storage. 
        //const deleteRef = ref(storage, `uploads/${user.uid}/${id}.*`)
      }

    return (
        <AuthCheck>
            <div>
                <ImageGallery match={true} images={images} delete={deleteImage} />
            </div>
        </AuthCheck>
    )
}
