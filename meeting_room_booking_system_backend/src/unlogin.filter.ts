import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException {
	message: string;

	constructor(message?) {
		this.message = message;
	}
}

// 自定义的统一响应式格式
@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
    // exception：当前正在处理的异常对象
    // host: 传递给原始处理程序的一个包装(Response/Request)引用参数
	catch(exception: UnLoginException, host: ArgumentsHost) {
        // 获取上下文
        const ctx = host.switchToHttp();
        // 响应对象,跟接口中的 @Request @Req 取到的一样
		const response = ctx.getResponse<Response>();
		
		response
			.json({
				code: 401, // 异常状态
				message: '用户未登录',
				data: exception.message || '用户未登录',
			})
			.end();
	}
}

