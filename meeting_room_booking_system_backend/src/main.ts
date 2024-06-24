import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnloginFilter } from './unlogin.filter';
import { CustomExceptionFilter } from './custom-exception.filter';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 配置 CORS 选项
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000', // 允许的源，可以是字符串、数组或函数
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的方法
        allowedHeaders: 'Content-Type, Accept, Authorization, x-requested-with', // 允许的请求头
        credentials: true, // 是否允许发送凭据（如 cookies）
    };
    // 启用 CORS
    app.enableCors(corsOptions);

    // 全局引入
    app.useGlobalPipes(new ValidationPipe());
    // 全局引入成功拦截器
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    // 全局引入失败拦截器
    app.useGlobalInterceptors(new InvokeRecordInterceptor());
    // 全局注册异常过滤器
    // app.useGlobalFilters(new UnloginFilter());
    // 自定义报错异常
    app.useGlobalFilters(new CustomExceptionFilter());
    // 静态文件根目录
    app.useStaticAssets('uploads', {
        prefix: '/uploads'
    })

    // swagger 文档插件的使用
    const config = new DocumentBuilder()
        .setTitle('会议室预定系统')
        .setDescription('api 接口文档')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            description: '基于 jwt 的认证'
        }) // 加一下 bearser 的认证
        .build();
        
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-doc', app, document);
    
    const configService = app.get(ConfigService);
    await app.listen(configService.get('nest_server_port'));
}
bootstrap();
