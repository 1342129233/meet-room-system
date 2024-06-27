import { BadRequestException, Injectable } from '@nestjs/common';
import { MeetingRoom } from './entities/meeting-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MeetingRoomListVo } from './vo/meeting-room.vo';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
	@InjectRepository(MeetingRoom)
	private repository: Repository<MeetingRoom>;

	async initData() {
		// 将数据保存在表中
		const room1 = new MeetingRoom();
		room1.name = '木星';
		room1.capacity = 10;
		room1.equipment = '白版';
		room1.location = '一层西';

		const room2 = new MeetingRoom();
		room2.name = '金星';
		room2.capacity = 5;
		room2.equipment = '';
		room2.location = '二层东';

		const room3 = new MeetingRoom();
		room3.name = '天王星';
		room3.capacity = 30;
		room3.equipment = '白版,电视';
		room3.location = '三层东';
		// 将数据保存在这个表中
		// this.repository.save([room1, room2, room3]);
		// 这里可以明确的是插入,就不用 save 了
		this.repository.insert([room1, room2, room3]);
	}

	// 查询列表
	async find(pageNo: number, pageSize: number, name: string, capacity: number, equipment: string) {
		if(pageNo < 1) {
			throw new BadRequestException('pageNo 不能小于 1');
		}
		const skipCount = (pageNo - 1) * pageSize;

		const condition: Record<string, any> = {}

		if(name !== 'undefined' && name) {
			condition.name = Like(`%${name}%`);
		}

		if(equipment !== 'undefined' && equipment) {
			condition.equipment = Like(`%${equipment}%`);
		}

		if(capacity) {
			condition.capacity = capacity;
		}

		const [meetingRooms, totalCount] = await this.repository.findAndCount({
			skip: skipCount,
			take: pageSize,
			where: condition
		})

		const vo = new MeetingRoomListVo();
		vo.meetingRooms = meetingRooms;
		vo.totalCount = totalCount;
		return vo;
	}

	// 创建
	async create(meetingRoomDto: CreateMeetingRoomDto) {
		// 插入数据 save 先查
		const room = await this.repository.findOneBy({
			name: meetingRoomDto.name
		})
		if(room) {
			throw new BadRequestException('会议室名称已存在');
		}
		// 插入数据
		return await this.repository.insert(meetingRoomDto);
	}

	// 更新
	async update(meetingRoomDto: UpdateMeetingRoomDto) {
		// 查询数据
		const meetingRoom = await this.repository.findOneBy({
			id: meetingRoomDto.id
		})
		if(!meetingRoom) {
			throw new BadRequestException('会议室不存在');
		}

		meetingRoom.capacity = meetingRoomDto.capacity;
		meetingRoom.location = meetingRoomDto.location;
		meetingRoom.name = meetingRoomDto.name;

		if(meetingRoomDto.description) {
			meetingRoom.description = meetingRoomDto.description;
		}
		if(meetingRoomDto.equipment) {
			meetingRoom.equipment = meetingRoomDto.equipment;
		}
		await this.repository.update({
			id: meetingRoomDto.id
		}, meetingRoom);

		return 'success'
	}

	// 数据的回显
	async findById(id: number) {
		return await this.repository.findOneBy({
			id
		})
	}

	// 删除
	async delete(id: number) {
		await this.repository.delete({
			id
		})
		return 'success'
	}
}
