import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';

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
}

