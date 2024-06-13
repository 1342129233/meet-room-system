import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { Request } from 'express';


// 接口访问记录的 interceptor
@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
	private readonly logger = new Logger(InvokeRecordInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// 上报信息
		// 请求参数 响应结果
		// bad case 查询日志
		// 错误上报 告警
		const request: any = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const userAgent = request.headers['user-agent'];

		// 参数信息
		const { ip, method, path } = request;

		this.logger.debug(
			`${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
				context.getHandler().name
			} invoked...`,
		);
		
		this.logger.debug(
			`user: ${request.user?.userId}, ${request.user?.username}`,
		);
		// 响应时间   
		const now = Date.now();

		return next.handle().pipe(
			tap((res) => {
				// 记录响应时间
				this.logger.debug(
					`${method} ${path} ${ip} ${userAgent}: ${
						response.statusCode
					}: ${Date.now() - now}ms`,
				);
				// 记录响应内容
				this.logger.debug(`Response: ${JSON.stringify(res)}`);
			}),
		);

	}
}
