import { ApiProperty } from "@nestjs/swagger";

class MeetingRooms {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string

    @ApiProperty()
    capacity: number

    @ApiProperty()
    location: string

    @ApiProperty()
    equipment: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    isBooked: boolean;

    @ApiProperty()
    createTime: Date;

    @ApiProperty()
    updateTime: Date;
}

export class MeetingRoomListVo {
    @ApiProperty()
    totalCount: number;

    @ApiProperty({
        type: [MeetingRooms]
    })
    meetingRooms: MeetingRooms[];
}