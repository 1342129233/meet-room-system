import { get, post, del, put } from '@/axios';
import { MeetingRoomResponse, MeetingRoomRequest, FormMeetingRoom, MeetingRoomSearchResult } from '../types';

// 获取列表
export function getMeetingRoom(value: MeetingRoomRequest ) {
    return get<MeetingRoomResponse>('/fe-app/meeting-room/list', {
        ...value
    });
}

// 创建
export function createRoom(value: FormMeetingRoom) {
    return post('/fe-app/meeting-room/create', { ...value })
}

// 更新
export function updateRoom(value: FormMeetingRoom) {
    return put('/fe-app/meeting-room/update', { ...value })
}

// 获取单个
export function meetingRoom(id: number) {
    return get<MeetingRoomSearchResult>(`/fe-app/meeting-room/${id}`)
}

// 删除
export function deleteRoom(id: number) {
    return del(`/fe-app/meeting-room/${id}`)
}
