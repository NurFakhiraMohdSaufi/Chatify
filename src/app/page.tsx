'use client';

import '@/styles/Dashboard.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import logo from '../images/chatify-logo.png';
import dashImage from '../images/dashImage.png';
import devicesMockup from '../images/device-mockup.jpg';

export default function Dashboard() {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [openAnswers, setOpenAnswers] = useState<{[key: string]: boolean}>({
        1: false,
        2: false,
        3: false,
        4: false,
    });

    const toggleAnswer = (index: number) => {
        setOpenAnswers((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({behavior: 'smooth'});
        }
    };

    return (
        <div className='gradient flex flex-col min-h-screen bg-black'>
            x{' '}
            <nav className='flex items-center justify-between flex-wrap bg-black p-4'>
                <div className='container mx-auto flex justify-between items-center px-6'>
                    <div className='flex items-center space-x-4'>
                        <Image
                            className='cursor-pointer'
                            src={logo}
                            width={100}
                            height={100}
                            alt='Chatify Logo'
                        />
                    </div>
                    <div className='flex space-x-6 bg-black'>
                        <button
                            onClick={() => scrollToSection('hero')}
                            className='text-white text-lg font-semibold hover:text-primary-700 transition duration-300'
                        >
                            Home
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className='text-white text-lg font-semibold hover:text-primary-700 transition duration-300'
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('faq')}
                            className='text-white text-lg font-semibold hover:text-primary-700 transition duration-300'
                        >
                            FAQs
                        </button>
                        <button
                            onClick={() => scrollToSection('help-center')}
                            className='text-white text-lg font-semibold hover:text-primary-700 transition duration-300'
                        >
                            Help Center
                        </button>
                    </div>
                    <div className='space-x-4'>
                        <button
                            onClick={() => navigateTo('/login')}
                            className='px-4 py-2 rounded bg-white text-gray-800 font-semibold hover:bg-gray-200 transition duration-300'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigateTo('/register')}
                            className='px-4 py-2 mt-3 rounded bg-[#86bc25] text-black font-semibold hover:bg-chatify hover:text-black transition duration-300'
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <header
                id='hero'
                className='container mx-auto flex flex-col items-center text-center py-16 px-4 bg-black'
            >
                <h1 className='text-4xl lg:text-5xl font-bold text-white mb-4'>
                    A New Era of Communication
                </h1>
                <p className='text-lg lg:text-xl text-gray-200 mb-8'>
                    Chatify: Where Chats Spark Connections.
                </p>
                <button
                    onClick={() => navigateTo('/register')}
                    className='px-8 py-4 m-6 bg-white text-gray-800 rounded-lg font-bold shadow-lg hover:bg-[#86BC25] hover:text-gray-900 transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none cursor-pointer'
                >
                    Get Started
                </button>

                <div>
                    <Image
                        src={devicesMockup}
                        alt='App in Devices'
                        width={500}
                        height={500}
                        className='transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'
                    />
                </div>

                <div className='flex items-center w-full content-end'>
                    <div className='browser-mockup flex flex-1 m-3 md:px-0 md:m-12 bg-white w-full rounded transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'>
                        <Image
                            src={dashImage}
                            width={1200}
                            height={1000}
                            alt='Dashboard'
                        />
                    </div>
                </div>
            </header>
            {/* Why Choose Chatify Section */}
            <section className='bg-gray-100 py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                        Why Choose Chatify?
                    </h2>
                    <p className='text-lg text-gray-700 mb-8'>
                        Chatify offers cutting-edge features designed to enhance
                        your communication and collaboration experience.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='bg-white p-6 rounded shadow hover:shadow-lg transform transition-all duration-300 hover:scale-105'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                Real-Time Messaging
                            </h3>
                            <p className='text-gray-600'>
                                Enjoy seamless communication with instant,
                                real-time chat powered by advanced technology.
                            </p>
                        </div>
                        <div className='bg-white p-6 rounded shadow hover:shadow-lg transform transition-all duration-300 hover:scale-105'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                User Authentication
                            </h3>
                            <p className='text-gray-600'>
                                Secure login and registration with
                                email/password.
                            </p>
                        </div>
                        <div className='bg-white p-6 rounded shadow hover:shadow-lg transform transition-all duration-300 hover:scale-105'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                Multiple Chat Rooms
                            </h3>
                            <p className='text-gray-600'>
                                Create and join multiple rooms to chat with
                                different groups.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Premium Features Section */}
            <section id='features' className='bg-white py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                        Features
                    </h2>
                    <div className='flex flex-col lg:flex-row justify-around items-center'>
                        <FeatureCard
                            title='Messaging'
                            description='Create or join room chats for instance messaging'
                            iconPath='M10 2a8 8 0 100 16 8 8 0 000-16zM8 4h4v8H8z'
                        />
                        <FeatureCard
                            title='Photo Sharing'
                            description='Preview photos directly within the chat interface without needing to download them'
                            iconPath='M6 2l4 8-4 8V2zM2 6h2v8H2zm14 0h2v8h-2z'
                        />
                        <FeatureCard
                            title='Customization profile'
                            description='Personalize your own profile with picture'
                            iconPath='M8 2l4 8-4 8H4V2z'
                        />
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <section className='bg-white py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-2xl lg:text-3xl font-bold text-gray-800 mb-6'>
                        Trusted By Developers
                    </h2>
                    <div className='flex justify-center items-center space-x-12'>
                        <FeatureCard
                            title='React'
                            description='Modern UI'
                            iconPath='M7 0H6L0 3v6l4-1v12h12V8l4 1V3l-6-3h-1a3 3 0 0 1-6 0z'
                        />
                        <FeatureCard
                            title='Next.js'
                            description='Server-side Power'
                            iconPath='M15.75 8l-3.74-3.75a3.99 3.99 0 0 1 6.82-3.08A4 4 0 0 1 15.75 8zM1.85 15.3l9.2-9.19 2.83 2.83-9.2 9.2-2.82-2.84zm-1.4 2.83l2.11-2.12 1.42 1.42-2.12 2.12-1.42-1.42zM10 15l2-2v7h-2v-5z'
                        />
                        <FeatureCard
                            title='Tailwind CSS'
                            description='Flexible Styling'
                            iconPath='M10 12a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 2.75V20l-4-4-4 4v-8.25a6.97 6.97 0 0 0 8 0z'
                        />
                        <FeatureCard
                            title='ShadCN'
                            description='Flexible Styling'
                            iconPath='M10 12a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 2.75V20l-4-4-4 4v-8.25a6.97 6.97 0 0 0 8 0z'
                        />
                    </div>
                </div>
            </section>
            {/* FAQ Section */}
            <section id='faq' className='py-12 bg-gray-100 sm:py-16 lg:py-24'>
                <div className='px-6 mx-auto sm:px-8 lg:px-10 max-w-7xl'>
                    <div className='max-w-2xl mx-auto text-center'>
                        <h2 className='text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl mb-8'>
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className='max-w-3xl mx-auto mt-8 space-y-4 md:mt-16'>
                        {[
                            {
                                question: 'How can I get started?',
                                answer: 'Getting started is easy! To get started, simply create an account or log in if you already have one. Once logged in, you can start chatting with your friends, family, or colleagues.',
                            },
                            {
                                question:
                                    'I forgot my password. How can I reset it?',
                                answer: 'Click on the “Forgot Password” link on the login page, enter your registered email address, and follow the instructions sent to your inbox to reset your password.',
                            },
                            {
                                question:
                                    'Do I need to install anything to use the app?',
                                answer: 'No, Chatify is entirely web-based, so there’s no need to download or install anything. Simply visit the app URL in your browser to start using it.',
                            },
                            {
                                question: 'How do I start a new conversation?',
                                answer: 'To start a new conversation, click on the add new room icon. You can then send your first message.',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                onClick={() => toggleAnswer(index)}
                                className='cursor-pointer p-4 rounded-xl bg-white shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105'
                            >
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-semibold text-gray-800'>
                                        {item.question}
                                    </h3>
                                    <span className='text-lg font-semibold text-gray-500'>
                                        {openAnswers[index] ? '−' : '+'}
                                    </span>
                                </div>
                                {openAnswers[index] && (
                                    <p className='mt-2 text-gray-600'>
                                        {item.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Help Center Section */}
            <section id='help-center' className='bg-gray-100 py-12'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                        Help Center
                    </h2>
                    <div className='space-y-6'>
                        <div className='text-lg text-gray-700'>
                            <p className='font-semibold'>Email us:</p>
                            <p>
                                Email us for general queries, including
                                marketing and partnership opportunities.
                            </p>
                            <a
                                href='mailto:hello@chatify.com'
                                className='text-green-700 font-semibold hover:text-green-800'
                            >
                                hello@chatify.com
                            </a>
                        </div>
                        <div className='text-lg text-gray-700'>
                            <p className='font-semibold'>Call us:</p>
                            <p>
                                Call us to speak to a member of our team. We are
                                always happy to help.
                            </p>
                            <p className='font-semibold text-green-700'>
                                +1 (646) 786-5060
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Call-to-Action Section */}
            <section className='bg-[#86BC25] text-white py-16'>
                <div className='container mx-auto text-center'>
                    <h2 className='text-4xl font-bold mb-4'>
                        Ready to Get Started?
                    </h2>
                    <p className='text-lg mb-8'>
                        Join thousands of users who trust Chatify for their
                        communication needs.
                    </p>
                    <button
                        onClick={() => navigateTo('/register')}
                        className='px-12 py-4 bg-black text-white rounded-lg font-bold text-lg shadow-mdtransform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none cursor-pointer hover:bg-white hover:text-black'
                    >
                        Create Your Account
                    </button>
                </div>
            </section>
            {/* Footer */}
            <footer className='bg-black text-gray-400 py-6'>
                <div className='container mx-auto text-center'>
                    <p className='text-sm'>
                        © 2024 Chatify App. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

interface card {
    title: string;
    description: string;
    iconPath: string;
}

function FeatureCard({title, description, iconPath}: card) {
    return (
        <div className='flex flex-col items-center'>
            <svg
                className='h-12 w-12 text-gray-500 mb-2'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
            >
                <path d={iconPath} />
            </svg>
            <h3 className='text-lg font-bold'>{title}</h3>
            <p className='text-sm text-gray-600'>{description}</p>
        </div>
    );
}
