import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

import { AlertDescription } from '@/components/ui/alert';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { auth } from '@/config/firebase-config';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';

export function ForgottenPassword() {
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState(false);

    const forgotPassword = async () => {
        if (!email.trim()) {
            setError(true);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email.trim());
            setOpen(false);
            setShowAlert(true);
            setError(false);
        } catch (error) {
            console.log(error);
            setError(true);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <a
                        onClick={() => setOpen(true)}
                        className='forgot-password-button'
                    >
                        Forgot Password?
                    </a>
                </DialogTrigger>
                <DialogContent className='w-96 bg-black p-6 rounded-xl shadow-lg transition-all duration-500 transform hover:scale-105'>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-semibold text-[#86BC25]'>
                            Forgot Password
                        </DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-1 gap-6'>
                        <Input
                            className={`p-3 border-2 rounded-md focus:outline-none transition-all duration-300 transform hover:scale-105 text-white bg-transparent ${
                                error
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-white focus:border-[#86BC25]'
                            }`}
                            placeholder='Enter email'
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(false); // Clear error on input change
                            }}
                        />
                        {error && (
                            <p className='text-red-500 text-sm'>
                                Email is required. Please enter a valid email.
                            </p>
                        )}
                    </div>

                    <DialogFooter className='flex justify-between'>
                        <Button
                            type='button'
                            className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transition-all duration-300 transform hover:scale-105'
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>

                        <Button
                            type='submit'
                            className='bg-[#86BC25] text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transition-all duration-300 transform hover:scale-105'
                            onClick={forgotPassword}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-white font-bold'>
                            Email Sent
                        </AlertDialogTitle>
                        <AlertDescription className='text-white'>
                            Please check your email inbox to reset the password
                        </AlertDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            className='bg-chatify text-black px-6 py-3 rounded-md hover:bg-white hover:text-black focus:ring-2 focus:ring-[#86BC25] transform hover:scale-105 transition-all duration-300'
                            onClick={() => setShowAlert(false)}
                        >
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
