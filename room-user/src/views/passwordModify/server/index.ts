import { get, post, Response } from '@/axios';
import { UpdatePasswordForm, UserInfoResponse } from '../types';

// 数据回显
export function getUserInfo() {
   return get<UserInfoResponse>(`/user/info`);
}

// 获取验证码
export function registerCaptcha(email: string) {
   return get(`/user/update_password/captcha?address=${email}`);
}

// 更新密码
export function updatePassword(data: UpdatePasswordForm) {
   return post(`/user/admin/update_password`, { ...data }) as unknown as Promise<Response>;
}
