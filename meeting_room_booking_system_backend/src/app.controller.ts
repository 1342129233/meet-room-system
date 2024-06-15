import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, requirePermission } from './custom.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

	@Get('aaa')
	@RequireLogin() // 登陆限制
	@requirePermission('ddd')
	aaaa() {
		return 'aaa';
	}

	@Get('bbb')
	bbb() {
		return 'bbb';
	}
}
