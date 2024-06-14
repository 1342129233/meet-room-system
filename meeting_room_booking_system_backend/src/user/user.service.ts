import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    private logger = new Logger();

    @Inject(RedisService)
    redisService: RedisService;
    @InjectRepository(User)
    private userRepository: Repository<User>;

    async register(user: RegisterUserDto) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);
        // 1.如果没有
        if (!captcha) {
            throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
        }
        // 2.验证码不正确
        if (user.captcha !== captcha) {
            throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
        }
        // 3.mysql中去查
        const foundUser = await this.userRepository.findOneBy({
            username: user.username,
        });
        // 4.存在
        if (foundUser) {
            throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
        }
        // 5. 不存在 保存save
        const newUser = new User();
        newUser.username = user.username;
        newUser.password = md5(user.password);
        newUser.email = user.email;
        newUser.nickName = user.nickName;

        try {
            await this.userRepository.save(newUser);
            return { code: 200, message: '注册成功' };
        } catch (e) {
            this.logger.error(e, UserService);
            return { code: 0, message: '注册失败' };
        }
    }

    // 查询用户
    async findUserDetailById(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            }
        })

        return user;
    }

    // 修改密码
    async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
        const captcha = await this.redisService.get(
			`update_password_captcha_${passwordDto.email}`,
		);

        if (passwordDto.captcha !== captcha) {
			throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
		}

        if (!captcha) {
			throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
		}
        
        // 查找用户信息
        const foundUser = await this.userRepository.findOneBy({
			id: userId,
		});
        // 新密码
        foundUser.password = md5(passwordDto.password);

		try {
            // save 前可以先查询一次
			await this.userRepository.save(foundUser);
            // 可以让 token 失效，让用户重新登陆一次
			return '密碼修改成功';
		} catch (e) {
			this.logger.error(e, UserService);
			return '密码修改失败';
		}
    }

    // 更新
    async update(userId: number, updateUserDto: UpdateUserDto) {
        const captcha = await this.redisService.get(
			`update_user_captcha_${updateUserDto.email}`,
		);

		if (!captcha) {
			throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
		}

		if (updateUserDto.captcha !== captcha) {
			throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
		}

        const foundUser = await this.userRepository.findOneBy({
			id: userId,
		});

		if (updateUserDto.nickName) {
			foundUser.nickName = updateUserDto.nickName;
		}
		if (updateUserDto.headPic) {
			foundUser.headPic = updateUserDto.headPic;
		}

        try {
			await this.userRepository.save(foundUser);
			return '用户信息修改成功';
		} catch (e) {
			this.logger.error(e, UserService);
			return '用户信息修改成功';
		}
    }
}

