import { MeetingRoom } from '@/meeting-room/entities/meeting-room.entity';
import { User } from '@/user/entities/user.entity';
import { 
    Column, 
    CreateDateColumn,
    Entity,
    // JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '会议开始时间'
    })
    startTime: Date

    @Column({
        comment: '会议结束时间'
    })
    endTime: Date

    @Column({
        comment: '状态(1.申请中,2.审批通过,3.审批驳回,4.已解除)'
    })
    status: number

    @Column({
        length: 100,
        comment: '备注',
        default: ''
    })
    note: string

    // 预定的这个会议邀请了哪些用户
    @ManyToOne(() => User)
    user: User

    // 预定的 room 是哪个会议室
    @ManyToOne(() => MeetingRoom)
    room: MeetingRoom

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date
}
