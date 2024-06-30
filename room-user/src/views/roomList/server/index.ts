import { get, post, Response } from '@/axios';
import { createBooking, MeetingRoomRequest } from '../types';
import { MeetingRoomResponse } from '@/views/meetingRoomManage/types';
import dayjs from 'dayjs';

// 获取列表
export function getMeetingRoom(value: MeetingRoomRequest ) {
    return get<MeetingRoomResponse>('/meeting-room/list', {
        ...value
    });
}

// 预定
export function bookingAdd(booking: createBooking) {
    const rangeStartDateStr = dayjs(booking.rangeStartDate).format('YYYY-MM-DD');
    const rangeStartTimeStr = dayjs(booking.rangeStartTime).format('HH:mm');
    const startTime = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf();

    const rangeEndDateStr = dayjs(booking.rangeEndDate).format('YYYY-MM-DD');
    const rangeEndTimeStr = dayjs(booking.rangeEndTime).format('HH:mm');
    const endTime = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf();

    return post<Response>('/booking/add', {
        meetingRoomId: booking.meetingRoomId,
        startTime,
        endTime,
        note: booking.note,
        userId: booking.userId
    });
}
