import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, Put, HttpStatus } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { generateParseIntPipe } from '@/utils';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('会议室模块')
@Controller('meeting-room')
export class MeetingRoomController {
	constructor(private readonly meetingRoomService: MeetingRoomService) {}

	// 数据初始化
	@Get('init')
	initData() {
		return this.meetingRoomService.initData();
	}
	
	@ApiBearerAuth() // 需要登陆
	@ApiQuery({
		name: 'pageNo',
		description: '页码',
		type: Number
	})
	@ApiQuery({
		name: 'pageSize',
		description: '每页多少条',
		type: Number
	})
	@ApiQuery({
		name: 'username',
		description: '用户名',
		type: String
	})
	@ApiQuery({
		name: 'nickName',
		description: '昵称',
		type: String
	})
	@ApiQuery({
		name: 'email',
		description: '邮箱地址',
		type: String
	})
	@ApiResponse({
		type: String,
		description: '用户列表'
	})
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

	@ApiBody({ type: CreateMeetingRoomDto })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: '获取失败',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: '获取成功'
	})
	@Post('create')
	async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
		return await this.meetingRoomService.create(meetingRoomDto)
	}

	@ApiBody({ type: UpdateMeetingRoomDto })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: '请求失败',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: '请求成功'
	})
	@Put('update')
	async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
		return await this.meetingRoomService.update(meetingRoomDto)
	}

	@ApiParam({
		name: 'id',
		type: Number,
		description: 'id'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: '获取失败',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: '获取成功'
	})
	@Get(':id')
	async find(@Param('id') id: number) {
		return await this.meetingRoomService.findById(id)
	}

	@ApiParam({
		name: 'id',
		type: Number,
		description: 'id'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: '删除失败',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: '删除成功'
	})
	@Delete(':id')
	async delete(@Param('id') id: number) {
		return await this.meetingRoomService.delete(id)
	}
}


