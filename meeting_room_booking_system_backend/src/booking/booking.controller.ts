import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { generateParseIntPipe } from '@/utils';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Get('init-data')
    async initData() {
        return await this.bookingService.initData();
    }

    //{
    //   "pageNo": 1,
    //   "pageSize": 10,
    //   "username": "wangxin",
    //   "meetingRoomName": "天王星",
    //   "meetingRoomPosition":"三层东"
    // }
    @Get('list')
    async list(
        @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
		@Query('pageSize', new DefaultValuePipe(1), generateParseIntPipe('pageSize')) pageSize: number,
		@Query('username') username: string,
		@Query('meetingRoomName') meetingRoomName: string,
		@Query('meetingRoomPosition') meetingRoomPosition: string,
        @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
        @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number
    ) {
        return this.bookingService.find(
            pageNo,
            pageSize,
            username,
            meetingRoomName,
            meetingRoomPosition,
            bookingTimeRangeStart,
            bookingTimeRangeEnd
        )
    }

    // 通过
    @Get('apply/:id')
    async apply(@Param('id') id: number) {
        return this.bookingService.apply(id)
    }

    // 驳回
    @Get('reject/:id')
    async reject(@Param('id') id: number) {
        return this.bookingService.reject(id)
    }

    // 已解除
    @Get('unbind/:id')
    async unbind(@Param('id') id: number) {
        return this.bookingService.unbind(id)
    }
    
    // 催办(可以做成做成每日提醒,定时任务)
    @Get('urge/:id')
    async urge(@Param('id') id: number) {
        return this.bookingService.urge(id)
    }
}
