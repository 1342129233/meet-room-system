import { get, post, del, put, Response } from '@/axios';
import { BookingSearchResponse, SearchBooking } from '../types';
import dayjs from 'dayjs';

// 获取列表
export function bookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {
    let bookingTimeRangeStart
    let bookingTimeRangeEnd
    if(searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
        const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
        const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
        bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf();
    }
    if(searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
        const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
        const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
        bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf();
    }
    return get<BookingSearchResponse>('/booking/list', {
        username: searchBooking.username,
        meetingRoomName: searchBooking.meetingRoomName,
        meetingRoomPosition: searchBooking.meetingRoomPosition,
        bookingTimeRangeStart,
        bookingTimeRangeEnd,
        pageNo: pageNo,
        pageSize: pageSize
    });
}

// 解除预定
export function bookingUnbind(id: number) {
    return get<Response>(`/booking/unbind/${id}`)
}

