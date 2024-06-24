import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MeetingRoom {
    @PrimaryGeneratedColumn({
        comment: '会议室ID'
    })
    id: number;

    @Column({
        length: 50,
        comment: '会议室名字'
    })
    name: string

    // 会议室有的打有的小，预定会议室的时候需要邀请人员 20 个参加会议
    // 线上开会
    @Column({
        comment: '会议室容量'
    })
    capacity: number

    // 分不同的办公点
    // wh-work-8-xxx 会议室
    @Column({
        length: 50,
        comment: '会议室位置'
    })
    location: string

    @Column({
        length: 50,
        comment: '设备',
        default: ''
    })
    equipment: string;

    @Column({
        length: 100,
        comment: '描述',
        default: ''
    })
    description: string;

    @Column({
        comment: '是否被预定',
        default: false
    })
    isBooked: boolean;

    @CreateDateColumn({
        comment: '创建时间'
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: '更新时间'
    })
    updateTime: Date;
}
