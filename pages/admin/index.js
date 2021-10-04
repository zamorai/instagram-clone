import { collection, getDocs, deleteDoc, doc, getDoc } from "@firebase/firestore"
import { useContext, useEffect, useState } from "react"
import ImageGallery from "../../components/ImageGallery"
import { UserContext } from "../../lib/context"
import { firestore, storage } from "../../lib/firebase"
import toast from 'react-hot-toast';
import AuthCheck from "../../components/AuthCheck"
import { deleteObject, ref } from "@firebase/storage"

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

        // Get path to delete from storage
        const deleteRef = doc(firestore, `users/${user.uid}/posts/${id}`)
        const deleteSnap = await getDoc(deleteRef)

        // Delete the file from firestore
        const confirmDelete = confirm("Do you want to delete this image?");
        if (confirmDelete) {
          await deleteDoc(doc(firestore, `users/${user.uid}/posts/${id}`))
          const deleteRef = ref(storage, deleteSnap.data().path)
          deleteObject(deleteRef).then(() => {
              console.log("Delete Successfull")
          }).catch((error) => {
              console.log(error)
          })
          toast.success('Image successfully deleted', {
            style: {
              padding: '16px',
              fontSize: '1.5rem'
            },
            icon: '🗑️'
          });
        }
      }

    return (
        <AuthCheck>
            <div>
                <ImageGallery match={true} images={images} delete={deleteImage} />
            </div>
        </AuthCheck>
    )
}
