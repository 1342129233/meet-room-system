import React, { lazy } from 'react';
import { createBrowserRouter} from 'react-router-dom';

const Login = lazy(() => import(/* webpackChunkName: "login" */ '@/views/login/index'));
const Register = lazy(() => import(/* webpackChunkName: "register" */ '@/views/register/index'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ '@/views/updatePassword/index'));
const ErrorPage = lazy(() => import(/* webpackChunkName: "login" */ '@/views/errorPage/index'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/index'));

export const routes = [
    {
        path: "/",
        element: <div>index</div>,
        errorElement: <ErrorPage />
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
    },
    {
        path: "/home",
        element: <Home />
    }
]

export const router = createBrowserRouter(routes);