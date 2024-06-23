import { get } from '@/axios';
import { SearchRequest, userResponse } from '../types';

export function search(value: SearchRequest) {
    return get<userResponse>(`/user/list?username=${value.username}&nickName=${value.nickName}&email=${value.email}&pageNo=${value.pageNo}&pageSize=${value.pageSize}`);
}
