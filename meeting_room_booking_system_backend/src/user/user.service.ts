import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UserListVo } from './vo/user-list.vo';

@Injectable()
export class UserService {
    private logger = new Logger();

    @Inject(RedisService)
    redisService: RedisService;

    @InjectRepository(User)
    private userRepository: Repository<User>;

    @InjectRepository(Role)
    private roleRepository: Repository<User>;

    @InjectRepository(Permission)
    private permissionRepository: Repository<User>;

    async register(user: RegisterUserDto, isAdmin: boolean) {
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
		newUser.phoneNumber = user.phoneNumber;

		if(isAdmin) {
			// 创建管理员

			const role = new Role();
			role.name = '管理员';

			const permission = new Permission();
			permission.code = '0';
			permission.description = '管理员创建的备注';

			newUser.roles = [role]
			role.permissions = [permission]
			try {
				await this.userRepository.save(newUser);
				return '注册成功';
			} catch (e) {
				this.logger.error(e, UserService);
				return '注册失败';
			}
		} else {
			// 创建普通用户

			const role = new Role();
			role.name = '普通用户';

			const permission = new Permission();
			permission.code = '6';
			permission.description = '普通用户创建的备注';

			newUser.roles = [role]
			role.permissions = [permission]
			try {
				await this.userRepository.save(newUser);
				return '注册成功';
			} catch (e) {
				this.logger.error(e, UserService);
				return '注册失败';
			}
		}

        
    }

    // 初始化数据
    async initData() {
		const user1 = new User();
		user1.username = 'zhangsan';
		user1.password = md5('111111');
		user1.email = 'xxx@xx.com';
		user1.isAdmin = true;
		user1.nickName = '张三';
		user1.phoneNumber = '13233323333';

		const user2 = new User();
		user2.username = 'lisi';
		user2.password = md5('222222');
		user2.email = 'yy@yy.com';
		user2.nickName = '李四';

		const role1 = new Role();
		role1.name = '管理员';

		const role2 = new Role();
		role2.name = '普通用户';

		const permission1 = new Permission();
		permission1.code = 'ccc';
		permission1.description = '访问 ccc 接口';

		const permission2 = new Permission();
		permission2.code = 'ddd';
		permission2.description = '访问 ddd 接口';

		user1.roles = [role1];
		user2.roles = [role2];

		role1.permissions = [permission1, permission2];
		role2.permissions = [permission1];

		await this.permissionRepository.save([permission1, permission2]);
		await this.roleRepository.save([role1, role2]);
		await this.userRepository.save([user1, user2]);
	}

    // 登陆
    async login(loginUserDto: LoginUserDto, isAdmin: boolean) {

		const user = await this.userRepository.findOne({
			where: {
				username: loginUserDto.username,
				isAdmin,
			},
			relations: ['roles', 'roles.permissions'],
		});

		if (!user) {
			throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
		}
		
		if (user.password !== md5(loginUserDto.password)) {
			throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
		}

		const vo = new LoginUserVo();

		vo.userInfo = {
			id: user.id,
			username: user.username,
			nickName: user.nickName,
			email: user.email,
			phoneNumber: user.phoneNumber,
			headPic: user.headPic,
			createTime: user.createTime,
			isFrozen: user.isFrozen,
			isAdmin: user.isAdmin,
			roles: user.roles.map((item) => item.name),
			permissions: user.roles.reduce((arr, item) => {
				item.permissions.forEach((permission) => {
					if (arr.indexOf(permission) === -1) {
						arr.push(permission);
					}
				});
				return arr;
			}, []),
		};

		return vo;
	}

    // 查找权限
    async findUserById(userId: number, isAdmin: boolean) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId,
				isAdmin,
			},
			relations: ['roles', 'roles.permissions'],
		});
		return {
			id: user.id,
			username: user.username,
			isAdmin: user.isAdmin,
			email: user.email,
			roles: user.roles.map((item) => item.name),
			permissions: user.roles.reduce((arr, item) => {
				item.permissions.forEach((permission) => {
					if (arr.indexOf(permission) === -1) {
						arr.push(permission);
					}
				});
				return arr;
			}, []),
		};
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
    async updatePassword(passwordDto: UpdateUserPasswordDto) {
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
			username: passwordDto.email,
		});
		// 用户不存在
		if(!foundUser) {
			throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
		}
		// 判断邮箱是否正确
		if(foundUser?.email !== passwordDto.email) {
			throw new HttpException('邮箱不正确', HttpStatus.BAD_REQUEST);
		}
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

	// 修改字段
	async freezeUserById(id: number) {
		const user = await this.userRepository.findOneBy({
			id
		})
		// 是否冻结字段
		user.isFrozen = true;

		await this.userRepository.save(user)
	}

	// 获取用户列表
	async findUsersByPage(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
		const skipCount = (pageNo - 1) * pageSize;
		
		// 添加一些查询条件
		const condition: Record<string, any> = {}
		// 模糊匹配
		if(username !== 'undefined' && username) {
			condition.username = Like(`%${username}%`);
		}
		if(nickName !== 'undefined' && nickName) {
			condition.nickName = Like(`%${nickName}%`);
		}
		if(email !== 'undefined' && email) {
			condition.email = Like(`%${email}%`);
		}

		const [users, totalCount] = await this.userRepository.findAndCount({
			// 指定需要查询的参数
			select: [
				'id',
				'username',
				'nickName',
				'email',
				'phoneNumber',
				'isFrozen',
				'headPic',
				'createTime'
			],
			skip: skipCount,
			take: pageSize,
			where: condition
		});
		const vo = new UserListVo();
		vo.users = users;
		vo.totalCount = totalCount;
		return vo;
	}
}

