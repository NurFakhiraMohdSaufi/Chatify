'use client';

import '@/styles/Dashboard.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import logo from '@/images/chatify-logo.png';
import dashImage from '@/images/dashImage.png';
import devicesMockup from '@/images/device-mockup.jpg';

export default function Dashboard() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openAnswers, setOpenAnswers] = useState<{[key: string]: boolean}>(
        {},
    );

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const navigateTo = (path: string) => router.push(path);
    const scrollToSection = (sectionId: string) =>
        document
            .getElementById(sectionId)
            ?.scrollIntoView({behavior: 'smooth'});

    const toggleAnswer = (index: number) => {
        setOpenAnswers((prev) => ({...prev, [index]: !prev[index]}));
    };

    return (
        <div className='gradient flex flex-col min-h-screen bg-black'>
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
                    <div className='hidden md:flex space-x-6'>
                        {['home', 'features', 'faq', 'help-center'].map(
                            (section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className='text-white text-lg font-semibold hover:text-primary-700 transition duration-300'
                                >
                                    {section.charAt(0).toUpperCase() +
                                        section.slice(1)}
                                </button>
                            ),
                        )}
                    </div>
                    <div className='md:hidden'>
                        <button
                            onClick={toggleMenu}
                            className='text-white text-2xl'
                        >
                            {isMenuOpen ? '✖' : '☰'}
                        </button>
                    </div>
                    {isMenuOpen && (
                        <div className='absolute top-16 right-0 w-full bg-black p-4 md:hidden'>
                            {['home', 'features', 'faq', 'help-center'].map(
                                (section) => (
                                    <button
                                        key={section}
                                        onClick={() => scrollToSection(section)}
                                        className='text-white text-lg font-semibold block py-2'
                                    >
                                        {section.charAt(0).toUpperCase() +
                                            section.slice(1)}
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                    <div className='space-x-4 flex justify-center'>
                        <button
                            onClick={() => navigateTo('/login')}
                            className='w-full md:w-auto px-6 py-3 rounded bg-white text-gray-800 font-semibold hover:bg-gray-200 transition duration-300'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigateTo('/register')}
                            className='w-full md:w-auto px-6 py-3 rounded bg-chatify text-black font-semibold hover:bg-white transition duration-300'
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

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
                    className='px-8 py-4 m-6 bg-white text-gray-800 rounded-lg font-bold shadow-lg hover:bg-[#86BC25] hover:text-gray-900 transition-all'
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
                <div className='browser-mockup flex m-3 md:m-12 bg-white w-full rounded transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'>
                    <Image
                        src={dashImage}
                        width={1200}
                        height={1000}
                        alt='Dashboard Mockup'
                    />
                </div>
            </header>

            <section className='bg-gray-100 py-12 text-center'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                    Why Choose Chatify?
                </h2>
                <p className='text-lg text-gray-700 mb-8'>
                    Chatify offers cutting-edge features designed to enhance
                    your communication experience.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {[
                        'Real-Time Messaging',
                        'User Authentication',
                        'Multiple Chat Rooms',
                    ].map((title, index) => (
                        <div
                            key={index}
                            className='bg-white p-6 rounded shadow hover:shadow-lg transform transition-all duration-300 hover:scale-105'
                        >
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>
                                {title}
                            </h3>
                            <p className='text-gray-600'>
                                Description for {title.toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id='faq' className='py-12 bg-gray-100'>
                <div className='max-w-3xl mx-auto mt-8 space-y-4'>
                    {[
                        {
                            question: 'How can I get started?',
                            answer: 'Getting started is easy! Create an account or log in to start chatting.',
                        },
                        {
                            question:
                                'I forgot my password. How can I reset it?',
                            answer: 'Click “Forgot Password” to reset your password.',
                        },
                        {
                            question:
                                'Do I need to install anything to use the app?',
                            answer: 'No, Chatify is web-based.',
                        },
                        {
                            question: 'How do I start a new conversation?',
                            answer: 'Click the add new room icon to start a chat.',
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => toggleAnswer(index)}
                            className='cursor-pointer p-4 rounded-xl bg-white shadow-md hover:bg-gray-100 transition-all'
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
            </section>

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
                        className='px-10 py-4 bg-black text-white rounded-lg font-bold text-lg shadow-mdtransform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none cursor-pointer hover:bg-white hover:text-black'
                    >
                        Create Your Account
                    </button>
                </div>
            </section>

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
