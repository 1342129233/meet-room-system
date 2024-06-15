import {
	ExecutionContext,
	SetMetadata,
	createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('require-login', true);

export const requirePermission = (...permissions: string[]) =>{
	return SetMetadata('require-permission', permissions);
}
	

export const UserInfo = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const request: any = ctx.switchToHttp().getRequest<Request>();

		if (!request.user) return null;

		return data ? request.user[data] : request.user;
	},
);