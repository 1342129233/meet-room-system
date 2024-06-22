import { Response } from '@/axios';

export interface SearchUser {
    username: string;
    nickName: string;
    email: string;
}

export interface UserSearchResult {
    key: string;
    username: string;
    headPic: string;
    nickName: string;
    email: string;
    createTime: Date;
}

export interface SearchRequest extends SearchUser{
    pageNo: number;
    pageSize: number;
}

export interface userResponse extends Response {
    users: UserList[];
    totalCount: number;
}

export interface UserList {
    id: number;
    username: string;
    nickName: string;
    email: string;
    phoneNumber: string;
    isFrozen: boolean;
    headPic: string;
    createTime: Date;
}
