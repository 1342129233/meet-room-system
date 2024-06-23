import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// 自定义报错异常
@Catch(HttpException)
export class CustomExceptionFilter<T> implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		// 上下文
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		
		response.json({
			code: exception.getStatus(),
			message: 'fail',
			data: exception.message || '服务器异常'
		}).end();
	}
}
