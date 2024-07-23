import { get } from '@/axios';
import { MeetingRoomUsedData, UserBookingData } from '../types';

// 用户预订情况
export function userBookingCount(startTime: string, endTime: string) {
    return get<UserBookingData[]>('/fe-app/statistic/userBookingCount', { startTime, endTime });
}

// 会议室使用情况
export function meetingRoomUsedCount(startTime: string, endTime: string) {
    return get<MeetingRoomUsedData[]>('/fe-app/statistic/meetingRoomUsedCount', { startTime, endTime });
}
