import { Controller, Inject, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
    @Inject(EmailService)
    private emailService: EmailService;

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(UserService)
    private readonly userService: UserService

    // 注册
    @Post('register')
    async register(@Body() registerUser: RegisterUserDto) {
        return await this.userService.register(registerUser);
    }

    // 发送验证码
    @Get('register-captcha')
    async captcha(@Query('address') address: string) {
        const code = Math.random().toString().slice(2, 8);

        await this.redisService.set(`captcha_${address}`, code, 5 * 60);

        await this.emailService.sendMail({
			to: address,
			subject: '注册验证码',
			html: `<p>您的验证码是：${code}</p>`,
		});
		return { code: 200, message: '验证码发送成功' };
    }

    // 更新验证码
    @Get('update_password/captcha')
	async updatePasswordCaptcha(@Query('address') address: string) {
		const code = Math.random().toString().slice(2, 8);

		await this.redisService.set(
			`update_password_captcha_${address}`,
			code,
			10 * 60,
		);

		await this.emailService.sendMail({
			to: address,
			subject: '更改密码验证码',
			html: `<p>你的更改密码验证码是 ${code}</p>`,
		});
		return '发送成功';
	}


    // 查询用户新
    @Get('info')
    @RequireLogin() // 需要登陆
    async info(@UserInfo('userId') userId: number) {
        const user = await this.userService.findUserDetailById(userId);

        // 返回 vo 的格式
        const vo = new UserDetailVo();

        vo.id = user.id;
		vo.email = user.email;
		vo.username = user.username;
		vo.headPic = user.headPic;
		vo.phoneNumber = user.phoneNumber;
		vo.nickName = user.nickName;
		vo.createTime = user.createTime;
		vo.isFrozen = user.isFrozen;

        return vo;
    }

    // 修改密码(管理员和用户修改密码的页面是一样的,用同一个接口)
    @Post(['update_password', 'admin/update_password'])
    @RequireLogin()
    async updatePassword(
        @UserInfo('userId') userId: number, 
        @Body() passwordDto: UpdateUserPasswordDto,
    ) {
        return await this.userService.updatePassword(userId, passwordDto);
    }

    // 修改用户信息
    @Post(['update', 'admin/update'])
	@RequireLogin()
	async update(
		@UserInfo('userId') userId: number,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return await this.userService.update(userId, updateUserDto);
	}
}
