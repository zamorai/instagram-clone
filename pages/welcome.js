import { signInWithPopup } from '@firebase/auth'
import { auth, googleProvider, firestore } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { useRouter } from 'next/router'

export async function getStaticProps(context) {

    const passRef = doc(firestore, `passwords/mainPasswords`)
    const passSnap = await getDoc(passRef)

    let password;

    if (passSnap.exists()) {
        password = passSnap.data().loginPassword
    }

    return {
        props: { password }
    }

}

export default function Welcome(props) {

    const user = useContext(UserContext)
    const router = useRouter();
    const [passwordMatch, setPasswordMatch] = useState(false)

    //console.log(props.password)

    useEffect(() => {
        if(user) {
            router.push('/')
        }
    }, [user])

    const submitPassword = (e) => {
        e.preventDefault();
        setPasswordMatch(true)
    }

    return (
        <div className="welcome-container">
            {passwordMatch ? <SignInButton user={user} /> : <Password password={props.password} submitPassword={submitPassword} />}
        </div>
    )
}

const SignInButton = ({ user }) => {

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider)
    }

    useEffect(() => {
        async function updateFirebase() {
            if(user) {
                const userDoc = doc(firestore, `users/${user.uid}`)
                await setDoc(userDoc, {username: user.displayName, photoUrl: user.photoURL, email: user.email}, {merge: true})
            }
        }
        updateFirebase()
        
    }, [user])

    return (
        <button className="sign-button" onClick={signInWithGoogle}>
            <img className="sign-image" src={'/google.png'} alt="Google logo" /> <span className="sign-button-text">Sign in With Google</span>
        </button>
    )
}

const Password = (props) => {
    const[passwordText, setPasswordText] = useState('')
    const[passwordMatch, setPasswordMatch] = useState(false)
    const[passwordDistance, setPasswordDistance] = useState(null);

    const onChange = (e) => {
        setPasswordText(e.target.value.toLowerCase())
    }

    const minDistance = (actualPassword, tryPassword) => {
        let grid = [];

        for(let i = 0; i < tryPassword.length + 1; i++) {
            let innerGrid = []
            for(let j = 0; j < actualPassword.length + 1; j++) {
                innerGrid.push(0)
            }
            grid.push(innerGrid)
        }
        
        for(let i=0; i < actualPassword.length + 1; i++) {
            grid[0][i] = i
        }
        for(let i=0; i < tryPassword.length + 1; i++) {
            grid[i][0] = i
        }

        for (let row = 1; row < tryPassword.length + 1; row++) {
            for (let col = 1; col < actualPassword.length + 1; col++) {
                if (tryPassword[row - 1] == actualPassword[col - 1]) {
                    grid[row][col] = grid[row - 1][col -1]
                } else {
                   grid[row][col] = Math.min(grid[row - 1][col - 1], grid[row - 1][col], grid[row][col - 1]) + 1 
                }
            }
        }

        return grid[tryPassword.length][actualPassword.length]
    };

    useEffect(() => {
        setPasswordDistance(minDistance(props.password, passwordText))
        if(passwordDistance == 0) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        } 
    },[passwordText, passwordDistance, passwordMatch])
             
    return (
        <div className="password-card">
            <div className='password-description-container'>
                <p className='password-description'>La clave es uno de los muchos nombres que nos decimos, pero pensando un poco out of the box. Piensa en mi mejor amigo que me regalaste :D</p>
            </div>
            <form className="password-form" onSubmit={props.submitPassword}>
                <input className="password-input" autoComplete='off' name='password' placeholder='password' value={passwordText} onChange={onChange} />
                <button className="password-button" disabled={!passwordMatch} type="submit">Enter</button>
                <PasswordHelper text={passwordText} distance={passwordDistance} />
            </form>
        </div>
    )
}

function PasswordHelper({ distance, text }) {
    if (distance == null || text === '') {
      return <p></p>;
    } else if (distance > 4) {
      return <p className='password-description'>Not even close to unlocking</p>;
    } else if (distance <= 4 && distance > 0) {
      return <p className='password-description'>Almost, {distance} letters away</p>;
    } else {
        return <p className='password-description'>Correct!</p>
    }
  }