import { Response } from '@/axios';

export interface UserInfo {
    id: number;
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
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



