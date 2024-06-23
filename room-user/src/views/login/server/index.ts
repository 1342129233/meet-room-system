import { post } from '@/axios/index';
import { LoginUser, LoginResponse } from '../types';

export function login(value: LoginUser) {
    return post<LoginResponse>('/user/admin/login', { ...value })
}
