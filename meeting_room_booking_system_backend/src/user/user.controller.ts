import { Controller, Inject, Get, Post, Body, Query, UnauthorizedException, ParseIntPipe, BadRequestException, DefaultValuePipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { generateParseIntPipe } from '@/utils';


@Controller('user')
export class UserController {
    @Inject(EmailService)
    private emailService: EmailService;

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(UserService)
    private readonly userService: UserService

    @Inject(ConfigService)
	private configService: ConfigService;

    @Inject(JwtService)
	private jwtService: JwtService;

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

    // 初始化数据
    @Get('init-data')
	async initData() {
		await this.userService.initData();
		return 'done';
	}

    // 登陆
    @Post('login')
	async userLogin(@Body() loginUser: LoginUserDto) {
		const vo = await this.userService.login(loginUser, false);

		vo.accessToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id,
				username: vo.userInfo.username,
				roles: vo.userInfo.roles,
				permissions: vo.userInfo.permissions,
			},
			{
				expiresIn:
					this.configService.get('jwt_access_token_expires_time') ||
					'30m',
			},
		);
		vo.refreshToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id,
			},
			{
				expiresIn:
					this.configService.get('jwt_refresh_token_expres_time') ||
					'7d',
			},
		);
		return vo;
	}

    // admin 登陆
    @Post('admin/login')
	async adminLogin(@Body() loginUser: LoginUserDto) {
		const vo = await this.userService.login(loginUser, true);

		vo.accessToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id,
				username: vo.userInfo.username,
				roles: vo.userInfo.roles,
				permissions: vo.userInfo.permissions,
			},
			{
				expiresIn:
					this.configService.get('jwt_access_token_expires_time') ||
					'30m',
			},
		);
		vo.refreshToken = this.jwtService.sign(
			{
				userId: vo.userInfo.id,
			},
			{
				expiresIn:
					this.configService.get('jwt_refresh_token_expres_time') ||
					'7d',
			},
		);
		return vo;
	}

    // 刷新
    @Get('refresh')
	async refresh(@Query('refreshToken') refreshToken: string) {
		const data = this.jwtService.verify(refreshToken);

		const user = await this.userService.findUserById(data.userId, false);

		const access_token = this.jwtService.sign(
			{
				userId: user.id,
				username: user.username,
				roles: user.roles,
				permissions: user.permissions,
			},
			{
				expiresIn:
					this.configService.get('jwt_refresh_token_expres_time') ||
					'7d',
			},
		);

		const refresh_token = this.jwtService.sign(
			{
				userId: user.id,
			},
			{
				expiresIn:
					this.configService.get('jwt_refresh_token_expres_time') ||
					'7d',
			},
		);

		return {
			access_token,
			refresh_token,
		};
	}

    // adin 刷新
    @Get('admin/refresh')
	async adminRefresh(@Query('refreshToken') refreshToken: string) {
		try {
			const data = this.jwtService.verify(refreshToken);

			const user = await this.userService.findUserById(data.userId, true);

			const access_token = this.jwtService.sign(
				{
					userId: user.id,
					username: user.username,
					roles: user.roles,
					permissions: user.permissions,
				},
				{
					expiresIn:
						this.configService.get(
							'jwt_access_token_expires_time',
						) || '30m',
				},
			);

			const refresh_token = this.jwtService.sign(
				{
					userId: user.id,
				},
				{
					expiresIn:
						this.configService.get(
							'jwt_refresh_token_expres_time',
						) || '7d',
				},
			);

			return {
				access_token,
				refresh_token,
			};
		} catch (e) {
			throw new UnauthorizedException('token 已失效，请重新登录');
		}
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

	// 修改字段
	@Get('freeze')
	async freeze(@Query('id') userId: number) {
		await this.userService.freezeUserById(userId);
		return 'success'
	}

	// 获取用户列表
	@Get('list')
	async list(
		@Query('pageNo',new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
		@Query('pageSize',new DefaultValuePipe(2), generateParseIntPipe('pageSize')) pageSize: number,
		@Query('username',) username: string,
		@Query('nickName',) nickName: string,
		@Query('email',) email: string
	) {
		return this.userService.findUsersByPage(username, nickName, email, pageNo, pageSize)
	}
}
