import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class StatisticService {
    @InjectEntityManager()
    private entityManager: EntityManager;

    async userBookingCount(startTime: string, endTime: string) {
        const res = await this.entityManager
            .createQueryBuilder(Booking, 'b')
            .select('u.id', '用户id')
            .addSelect('u.username', '用户名')
            .leftJoin(User, 'u', 'b.userId = u.id')
            .addSelect('count(1)', '预定次数')
            .where('b.startTime between :startTime and :endTime', {
                startTime: startTime,
                endTime: endTime,
            })
            .addGroupBy('b.user')
            .getRawMany();

        return res;
    }

  async meetingRoomUsedCount(startTime: string, endTime: string) {
    return await this.entityManager
        .createQueryBuilder(Booking, 'b')
        .select('m.id', 'meetingRoomId')
        .addSelect('m.name', 'meetingRoomName')
        .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
        .addSelect('count(1)', '预定次数')
        .where('b.startTime between :startTime and :endTime', {
            startTime: startTime,
            endTime: endTime,
        })
        .addGroupBy('b.roomId')
        .getRawMany();
    }
}