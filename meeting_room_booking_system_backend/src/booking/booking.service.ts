import { EmailService } from '@/email/email.service';
import { MeetingRoom } from '@/meeting-room/entities/meeting-room.entity';
import { RedisService } from '@/redis/redis.service';
import { User } from '@/user/entities/user.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Between, EntityManager, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
    @InjectEntityManager()
    private entityManager: EntityManager;

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(EmailService)
    private emailService: EmailService;

    // 初始化数据
    async initData() {
        const user1 = await this.entityManager.findOneBy(User, {
            id: 1
        })

        const user2 = await this.entityManager.findOneBy(User, {
            id: 2
        })

        const room1 = await this.entityManager.findOneBy(MeetingRoom, {
            id: 3
        })

        const room2 = await this.entityManager.findOneBy(MeetingRoom, {
            id: 4
        })

        // 数据1
        const booking1 = new Booking();
        booking1.room = room1;
        booking1.user = user1;
        booking1.status = 2;
        booking1.startTime = new Date();
        booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(Booking, booking1);

        // 数据2
        const booking2 = new Booking();
        booking2.room = room2;
        booking2.user = user2;
        booking2.status = 3;
        booking2.startTime = new Date();
        booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(Booking, booking2);

        // 数据3
        const booking3 = new Booking();
        booking3.room = room1;
        booking3.user = user2;
        booking3.status = 4;
        booking3.startTime = new Date();
        booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(Booking, booking3);

        // 数据4
        const booking4 = new Booking();
        booking4.room = room2;
        booking4.user = user1;
        booking4.status = 1;
        booking4.startTime = new Date();
        booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(Booking, booking4);
    }

    async find(
        pageNo: number,
        pageSize: number,
        username: string,
        meetingRoomName: string,
        meetingRoomPosition: string,
        bookingTimeRangeStart: number,
        bookingTimeRangeEnd: number
    ) {
        const skipCount = (pageNo - 1) * pageSize;
        const condition: Record<string, any> = {};

        if(username !== 'undefined' && username) {
			condition.user = {
                username: Like(`%${username}%`)
            };
		}

        if(meetingRoomName !== 'undefined' && meetingRoomName) {
			condition.room = {
                name: Like(`%${meetingRoomName}%`)
            };
		}

        if(meetingRoomPosition !== 'undefined' && meetingRoomPosition) {
            if(!condition.room) {
                condition.room = {}
            }
			condition.room.location = Like(`%${meetingRoomPosition}%`)
		}

        if(bookingTimeRangeStart) {
            if(!bookingTimeRangeEnd) {
                bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
            }
            condition.startTime = Between(
                new Date(bookingTimeRangeStart),
                new Date(bookingTimeRangeEnd)
            )
        }

        const [bookings, totalCount] = await this.entityManager.findAndCount(
            Booking,
            {
                where: condition,
                // 关联将 user 和 room 都查询出来
                relations: {
                    user: true,
                    room: true
                },
                skip: skipCount,
                take: pageSize,
                // 筛选
                // select: {
                //     id: true,
                //     startTime: true,
                //     user: {
                //         id: true,
                //         nickName: true
                //     }
                // }
            }
        )

        bookings.map((item) => {
            delete item.user.password
            return item
        })

        return {
            bookings,
            totalCount
        }
    }

    // 审批通过
    async apply(id: number) {
        await this.entityManager.update(Booking, {
            id
        }, {
            status: 2
        });
        return '审批通过'
    }

    // 审批驳回
    async reject(id: number) {
        await this.entityManager.update(Booking, {
            id
        }, {
            status: 3
        });
        return '审批驳回'
    }

    async unbind(id: number) {
        await this.entityManager.update(Booking, {
            id
        }, {
            status: 4
        });
        return '已解除'
    }

    async urge(id: number) {
        const flag = await this.redisService.get('urge_' + id);

        if(flag) {
            return '半小时内只能催办一次,请耐心等待';
        }

        let email = await this.redisService.get('admin_email');

        if(!email) {
            const admin = await this.entityManager.findOne(User, {
                select: {
                    email: true
                },
                where: {
                    isAdmin: true
                }
            })
            email = admin.email;

            this.redisService.set('admin-email', admin.email)
        }

        this.emailService.sendMail({
            to: email,
            subject: '预定申请催办提醒',
            html: `id 为 ${id} 的预定申请正在等待审批`
        })

        this.redisService.set('urge_' + id, 1, 60 * 30);
    }

    // 预定
    async add(bookingDto: CreateBookingDto, userId: number) {

        const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
            id: bookingDto.meetingRoomId,
        });
      
        if (!meetingRoom) {
            throw new BadRequestException('会议室不存在');
        }
      
        const user = await this.entityManager.findOneBy(User, {
            id: userId,
        });
      
        const booking = new Booking();
        booking.room = meetingRoom;
        booking.user = user;
        booking.startTime = new Date(bookingDto.startTime);
        booking.endTime = new Date(bookingDto.endTime);
      
        const res = await this.entityManager.findOneBy(Booking, {
            room: meetingRoom,
            startTime: LessThanOrEqual(booking.startTime),
            endTime: LessThanOrEqual(booking.endTime),
        });
      
        if (res) {
            throw new BadRequestException('该时间段会议室已被预定');
        }
      
        await this.entityManager.save(Booking, booking);
    }
}
