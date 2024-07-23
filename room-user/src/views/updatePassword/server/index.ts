import { get, post, Response } from '@/axios';
import { UpdatePasswordForm } from '../types';

 // 获取验证码
export function registerCaptcha(email: string) {
   return get(`/fe-app/user/update_password/captcha?address=${email}`);
}

// 更新密码
export function updatePassword(data: UpdatePasswordForm) {
   return post(`/fe-app/user/update_password`, { ...data }) as unknown as Promise<Response>;
}
