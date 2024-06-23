import { Response } from '@/axios';

export interface UpdatePasswordForm {
    username: string;
    email: string;
    captcha: string;
    password: string;
    confirmPassword: string;
}

export interface UserInfoResponse extends Response {
    createTime: string;
    email: string;
    headPic: string;
    id: number;
    isFrozen: boolean;
    nickName: string;
    phoneNumber: string | number;
    username: string;
}