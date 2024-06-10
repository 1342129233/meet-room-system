import { Controller, Inject, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('email')
export class EmailController {
	@Inject()
	private redisService: RedisService;
	constructor(private readonly emailService: EmailService) {}

	@Get('code')
	async sendEmailCode(@Query('address') address) {
		// 是否要先判断 email 的存在？
		// 随机生成验证码, 怎么去做对比？存在 redis 中 ？
		const code = Math.random().toString().slice(2, 8);
		// 以 address 为 key 保存在 redis 中
		await this.redisService.set(`captcha_${address}`, code);
		await this.emailService.sendMail({
			to: address,
			subject: '登陆验证码',
			html: `<p>你的登陆验证码是${code}</p>`,
		});
		return '发送成功';
	}
}
