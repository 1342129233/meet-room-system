import { get, Response } from '@/axios';
import { BookingListResult, SearchBooking } from '../types';
import dayjs from 'dayjs';

/**
 * 通过申请
 * @param id 
 * @returns 
 */
export function apply(id: number) {
    return get<Response>('/fe-app/booking/apply/' + id);
}
  
/**
   * 驳回申请
   * @param id 
   * @returns 
   */
export function reject(id: number) {
    return get<Response>('/fe-app/booking/reject/' + id);
}
  
/**
   * 解除申请
   * @param id 
   * @returns 
   */
export function unbind(id: number) {
    return get<Response>('/fe-app/booking/unbind/' + id);
}

export function bookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {
    let bookingTimeRangeStart;
    let bookingTimeRangeEnd;

    if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
        const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
        const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
        bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()
    }

    if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
        const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
        const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
        bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()
    }


    return get<BookingListResult>('/fe-app/booking/list', {
        username: searchBooking.username,
        meetingRoomName: searchBooking.meetingRoomName,
        meetingRoomPosition: searchBooking.meetingRoomPosition,
        bookingTimeRangeStart,
        bookingTimeRangeEnd,
        pageNo: pageNo,
        pageSize: pageSize
    })
}
