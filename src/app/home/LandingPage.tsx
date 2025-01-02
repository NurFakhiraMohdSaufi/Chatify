import Image from 'next/image';

import logo from '@/images/logo-chatify.png';

export default function LandingPage() {
    return (
        <div className='bg-black w-full h-screen flex items-center justify-center relative overflow-hidden'>
            {/* Background Overlay */}
            <div
                className='absolute inset-0 bg-cover bg-center bg-opacity-50'
                style={{backgroundImage: 'url(/path-to-your-image.jpg)'}}
            ></div>

            {/* Content */}
            <div className='z-10 text-center text-white px-4 md:px-8'>
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate__animated animate__fadeIn animate__delay-1s'>
                    Welcome to <span className='text-chatify'>Chatify</span>
                </h1>
                <div className='place-items-center m-7'>
                    <Image
                        src={logo}
                        width={300}
                        height={300}
                        alt='Chat App Logo'
                    />
                </div>
                <p className='text-2xl text-white opacity-80 animate__animated animate__fadeIn animate__delay-2s'>
                    Start a conversation now!
                </p>
            </div>
        </div>
    );
}
