import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/user/entities/user.entity';

@ApiTags('统计管理模块')
@Controller('statistic')
export class StatisticController {
     @Inject(StatisticService)
    private statisticService: StatisticService;

    @ApiBearerAuth()
    @ApiQuery({
        name: 'startTime',
        type: String,
        description: '开始时间'
    })
    @ApiQuery({
        name: 'endTime',
        type: String,
        description: '结束时间'
    })
    @ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
        type: String
	})
    @Get('userBookingCount')
    async userBookignCount(
        @Query('startTime') startTime: string,
        @Query('endTime') endTime,
    ) {
        return this.statisticService.userBookingCount(startTime, endTime);
    }

    // 统计次数
    @ApiBearerAuth()
    @ApiQuery({
        name: 'startTime',
        type: String,
        description: '开始时间'
    })
    @ApiQuery({
        name: 'endTime',
        type: String,
        description: '结束时间'
    })
    @ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		type: String
	})
	@ApiResponse({
		status: HttpStatus.OK,
        type: String
	})
    @Get('meetingRoomUsedCount')
    async meetingRoomUsedCount(
        @Query('startTime') startTime: string,
        @Query('endTime') endTime,
    ) {
        return this.statisticService.meetingRoomUsedCount(startTime, endTime);
    }
}