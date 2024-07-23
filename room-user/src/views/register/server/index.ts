import { get, post } from '@/axios';
import { RegisterUser } from '../types';

 // 获取验证码
export function registerCaptcha(email: string) {
   return get(`/fe-app/user/register-captcha?address=${email}`);
}

// 注册
export function register(value: RegisterUser) {
   return post('/fe-app/user/admin/register', value)
}
