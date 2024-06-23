import { get, post, Response } from '@/axios';
import { UserInfo, UserInfoResponse } from '../types';

// 数据回显
export function getUserInfo() {
    return get<UserInfoResponse>(`/user/info`);
}

// 修改用户信息
export function updateInfo(id: number, data: UserInfo) {
    return post<Response>(`/user/admin/update`, { ...data, userId: id });
}

// 发送验证码
export function updateUpdateInfoCaptcha(email: string) {
    return get<Response>(`/user/update/captcha?email=${email}`);
}