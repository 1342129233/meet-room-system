import { get, post, Response } from '@/axios';
import { UserInfo, UserInfoResponse } from '../types';

// 数据回显
export function getUserInfo() {
    return get<UserInfoResponse>(`/fe-app/user/info`);
}

// 修改用户信息
export function updateInfo(id: number, data: UserInfo) {
    return post<Response>(`/fe-app/user/update?userId=${id}`, { ...data });
}

// 发送验证码
export function updateUpdateInfoCaptcha(email: string) {
    return get<Response>(`/fe-app/user/update/captcha?email=${email}`);
}