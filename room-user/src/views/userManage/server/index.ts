import { post } from '@/axios';
import { SearchRequest, userResponse } from '../types';

export function search(value: SearchRequest) {
    return post<userResponse>('/user/list', { ...value });
}
