export interface LoginUser {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    userInfo: UserInfo;
}

export interface UserInfo {
    createTime: string;
    email: string;
    headPic: string;
    id: number;
    isAdmin: boolean;
    isFrozen: boolean;
    nickName: string;
    permissions: string[];
    phoneNumber: number;
    roles: number[];
    username: string;
}