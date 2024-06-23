import React, { lazy } from 'react';
import { createBrowserRouter} from 'react-router-dom';

const Login = lazy(() => import(/* webpackChunkName: "login" */ '@/views/login/index'));
const Register = lazy(() => import(/* webpackChunkName: "register" */ '@/views/register/index'));
const UpdatePassword = lazy(() => import(/* webpackChunkName: "updatePassword" */ '@/views/updatePassword/index'));
const ErrorPage = lazy(() => import(/* webpackChunkName: "errorPage" */ '@/views/errorPage/index'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/index'));
const UpdateInfo = lazy(() => import(/* webpackChunkName: "updateInfo" */ '@/views/updateInfo/index'));
const UserManage = lazy(() => import(/* webpackChunkName: "userManage" */ '@/views/userManage/index'));
const Menu = lazy(() => import(/* webpackChunkName: "menu" */ '@/views/menu/index'));
const ModifyMenu = lazy(() => import(/* webpackChunkName: "modifyMenu" */ '@/views/modifyMenu/index'));
const InfoModify = lazy(() => import(/* webpackChunkName: "infoModify" */ '@/views/infoModify/index'));
const PasswordModify = lazy(() => import(/* webpackChunkName: "passwordModify" */ '@/views/passwordModify/index'));

export const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Menu />,
                children: [
                    {
                        name: '用户管理',
                        path: 'user_manage',
                        element: <UserManage />
                    }
                ]
            },
            {
                path: 'user',
                element: <ModifyMenu />,
                children: [
                    {
                        path: 'info_modify',
                        element: <InfoModify />,
                    },
                    {
                        path: 'password_modify',
                        element: <PasswordModify />,
                    }
                ]
            },
            {
                path: 'update_info',
                element: <UpdateInfo />
            },
            
        ]
    },
	{
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },
    {
        path: "updatePassword",
        element: <UpdatePassword />
    }
]

export const router = createBrowserRouter(routes);