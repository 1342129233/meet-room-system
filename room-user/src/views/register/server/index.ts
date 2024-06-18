import { get, post } from '@/axios';
import { RegisterUser } from '../types';

 // 注册邮箱
export function registerCaptcha(email: string) {
   return get(`/user/register-captcha?address=${email}`);
}

// 注册
export function register(value: RegisterUser) {
   return post('/user/register', value)
}
