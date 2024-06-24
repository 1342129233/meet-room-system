import { PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './create-meeting-room.dto';
import { IsNotEmpty } from 'class-validator';

// 参数必须都是可选的,必须要有id
export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
    @IsNotEmpty({
        message: 'id 不能为空'
    })
    id: number;
}
