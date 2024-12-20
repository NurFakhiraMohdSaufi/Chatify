'use client';
import '@/styles/Auth.css';

import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'universal-cookie';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { auth, db, provider } from '@/config/firebase-config';
import logo from '@/images/logo-chatify.png';

import { ForgottenPassword } from '../forgotPassword/ForgottenPassword';

const cookies = new Cookies();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const router = useRouter();

    const checkEmailPassword = () => {
        // Check email & password is not null
        if (!email || !password) {
            setError(
                !email && !password
                    ? 'Please enter both email and password'
                    : !email
                    ? 'Please enter the email'
                    : 'Please enter the password',
            );
            return false;
        }
        setError('');
        return true;
    };

    const signInWithGoogle = async () => {
        setIsGoogleSubmitting(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('user: ', user);

            await setDoc(doc(collection(db, 'users'), user.uid), {
                name: user.displayName,
                email: user.email,
                createdAt: new Date(),
            });

            cookies.set('auth-token', result.user.refreshToken);

            if (!user.emailVerified) {
                setError('Please verify your email before logging in.');
                setIsGoogleSubmitting(false);
                return;
            }

            router.push('/home');
        } catch {
            setError('Failed to sign in with Google');
        } finally {
            setIsGoogleSubmitting(false);
        }
    };

    const signInWithEmailPassword = async () => {
        if (!checkEmailPassword()) return;

        setIsSubmitting(true);
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = result.user;

            if (!user.emailVerified) {
                setError('Please verify your email before logging in.');
                setIsSubmitting(false);
                return;
            }

            cookies.set('auth-token', result.user.refreshToken);

            router.push('/home'); // Redirect to home page after login
            // setIsAuth(true);
            setError('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            setError('Email does not exist. Please register first');
        }
        setIsSubmitting(false);
    };

    const registerButton = () => {
        router.push('/register');
    };

    const homeButton = () => {
        router.push('/');
    };

    return (
        <div className='auth-container'>
            <svg viewBox='0 0 500 150' preserveAspectRatio='none'>
                <defs>
                    <linearGradient
                        id='myGradient'
                        gradientTransform='rotate(90)'
                    >
                        <stop offset='5%' stopColor='#86BC25' />
                        <stop offset='95%' stopColor='#86BC25' />
                    </linearGradient>
                </defs>
                <path
                    d='M208.09,0.00 C152.70,67.10 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z'
                    fill='url(#myGradient)'
                ></path>
            </svg>
            <div className='header-container'>
                <Image
                    className='cursor-pointer responsive-logo'
                    src={logo}
                    width={200}
                    height={200}
                    alt='Chatify Logo'
                    onClick={homeButton}
                />
                <h1 className='header-title '>Chatify</h1>
                {/* <button className='text-white p-2 hover:bg-chatify hover:text-black rounded transition duration-500 ease-in-out font-medium'>
                        Register
                    </button> */}
            </div>
            <div className='form-card'>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        signInWithEmailPassword();
                    }}
                >
                    <h1 className='header-t mb-2'>Log In</h1>
                    {error && (
                        <Alert variant='destructive'>
                            <AlertCircle className='h-4 w-4 mt-2' />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <label htmlFor='email' className='label'>
                        Email
                    </label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input'
                        placeholder='Enter your email'
                    />
                    <label htmlFor='password' className='label'>
                        Password
                    </label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input'
                        placeholder='Enter your password'
                    />
                    <p className='forgot-password-label'>
                        <ForgottenPassword />
                    </p>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='button-submit'
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className='or-area'>
                    <div className='or-text'>OR</div>
                </div>
                <p className='google-text text-white text-center mt-5'>
                    automatically sign up with Google
                </p>
                <div className='flex mt-4 gap-x-2'>
                    <button
                        type='button'
                        onClick={signInWithGoogle}
                        className='button-google'
                        disabled={isGoogleSubmitting}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 32 32'
                            className='icon-google'
                        >
                            <path d='M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z'></path>
                        </svg>
                    </button>
                </div>

                <p className='no-acc-text'>
                    Do not have an account?{' '}
                    <a
                        className='link-text cursor-pointer'
                        onClick={registerButton}
                    >
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
