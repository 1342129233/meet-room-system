import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPipe } from '@/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
	constructor(private readonly meetingRoomService: MeetingRoomService) {}

	// 数据初始化
	@Get('init')
	initData() {
		return this.meetingRoomService.initData();
	}

	@Get('list')
	async list (
		@Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
		@Query('pageSize', new DefaultValuePipe(1), generateParseIntPipe('pageSize')) pageSize: number,
		@Query('name') name: string,
		@Query('capacity') capacity: number,
		@Query('equipment') equipment: string,
	) {
		// 会议室列表
		return await this.meetingRoomService.find(pageNo, pageSize, name, capacity, equipment)
	}

	@Post('create')
	async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
		return await this.meetingRoomService.create(meetingRoomDto)
	}

	@Put('update')
	async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
		return await this.meetingRoomService.update(meetingRoomDto)
	}

	@Get(':id')
	async find(@Param('id') id: number) {
		return await this.meetingRoomService.findById(id)
	}

	@Delete(':id')
	async delete(@Param('id') id: number) {
		return await this.meetingRoomService.delete(id)
	}
}
