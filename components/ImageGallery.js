import React from 'react'
import Loader from './Loader'
import Link from 'next/link'

export default function ImageGallery(props) {
    
    const buildGallery = () => {
        if(props.images) {
            const gal = props.images.map(image => <ImageSingle match={props.match} delete={props.delete} img={image.downloadURL} key={image.imageId} id={image.imageId} />)
            return gal;
        } else {
            return <Loader />
        }
        
    }

    return (
        <div className="gallery">
           {buildGallery()}
        </div>
    )
}

function ImageSingle(props) {

    const show = props.match ? 'show' : 'hide'

    return (
        
        <div className="gallery-card">  
            <div onClick={() => props.delete(props.id)} className={`gallery-icon-card ${show}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="gallery-icon pointer" fill="black" viewBox="0 0 24 24" stroke="red">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <figure className="pointer">
                <Link href={`/${props.id}`}>
                    <img className="gallery-img" src={props.img} alt="test" />
                </Link>
            </figure>
        </div>
        
    )
}

