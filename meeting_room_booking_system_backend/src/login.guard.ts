import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Inject,
	UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';
// 可以使用元编程方式透明地获得类和方法上的元数据，元数据可以帮助我们在编写一些装饰器、拦截器和守卫时，更多地表达出开发者的意图
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnLoginException, UnloginFilter } from './unlogin.filter';

interface JwtUserData {
	userId: string;
	username: string;
	email: string;
	roles: string[];
	permissions: Permission[];
}

declare module 'express' {
	interface Request {
		user: JwtUserData;
	}
}

// 登录守卫类
@Injectable()
export class LoginGuard implements CanActivate {
	@Inject()
	// 注入“Reflector”依赖对象，用于获取类和方法上的元数据
	private reflector: Reflector;

	@Inject(JwtService)
	// 注入“JwtService”依赖对象，用于校验jwt
	private jwtService: JwtService;

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {

		// 获取当前请求对象：Request
		const request: Request = context.switchToHttp().getRequest();

		// 获取类和方法里的“require-login”元数据。如果没有该元数据，直接返回true
		const requireLogin = this.reflector.getAllAndOverride('require-login', [
			context.getClass(),
			context.getHandler(),
		]);

		if (!requireLogin) return true;

		// 获取请求头中的“authorization”字段
		const authorization = request.headers.authorization;
		// 如果请求头中没有“authorization”，抛出“UnauthorizedException”
		if (!authorization) {
			throw new UnauthorizedException('用户未登录');
			// throw new UnLoginException('用户未登录');
		}
		// 验证token: `bearer 加密`
		try {
			// 如果请求头中有“authorization”，则从中获取jwt令牌并根据令牌获取用户数据
			const token = authorization.split(' ')[1];
			const data = this.jwtService.verify<JwtUserData>(token);
			// 将用户数据设置到Request对象的“user”属性中，以便其他部分（如：控制器）可以使用
			request.user = {
				userId: data.userId,
				username: data.username,
				email: data.email,
				roles: data.roles,
				permissions: data.permissions,
			};
			return true;
		} catch (e) {
			throw new UnloginFilter();
		}
	}
}