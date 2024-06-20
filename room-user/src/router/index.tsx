import React, { lazy } from 'react';
import { createBrowserRouter} from 'react-router-dom';

const Login = lazy(() => import(/* webpackChunkName: "login" */ '@/views/login/index'));
const Register = lazy(() => import(/* webpackChunkName: "register" */ '@/views/register/index'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ '@/views/updatePassword/index'));
const ErrorPage = lazy(() => import(/* webpackChunkName: "login" */ '@/views/errorPage/index'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/index'));
const UpdateInfo = lazy(() => import(/* webpackChunkName: "home" */ '@/views/updateInfo/index'));

export const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'update_info',
                element: <UpdateInfo />
            },
            {
                path: 'bbb',
                element: <div>bbb</div>
            }
        ]
    },
	{
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/updatePassword",
        element: <UpdatePassword />
    }
]

export const router = createBrowserRouter(routes);