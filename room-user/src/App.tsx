import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import './type/index.css';


export default function App() {
    return (
        <Suspense>
            <RouterProvider router={router} />
        </Suspense>
    )
}
