import React from 'react';
import Link from 'next/link';

export default function Custom404(){
    return(
        <div className='h-screen flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-bold text-red-500'>404</h1>
            <p className='text-x1 text-gray-600 mt-4'>Page Not Found</p>
            <Link href="/">
                <a className='mt-6 text-blue-600 underline'>Go Back to Home</a>
            </Link>
        </div>
    )
}