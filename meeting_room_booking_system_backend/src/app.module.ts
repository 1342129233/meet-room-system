import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 全局配置
			envFilePath: '.env', // 读取的配置文件
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: "127.0.0.1",
            port: 3306,
            username: 'root',
            password: '123456',
            database: 'myConferencRoom',
            synchronize: true,
            logging: true,
            charset: "utf8mb4",
            timezone: "local",
            entities: [
                User,
                Permission,
                Role,
            ],
            poolSize: 10,
            connectorPackage: 'mysql2',
            // extra: { 额外的身份验证插件
            // 	authPlugin: 'sha256_password'
            // }
        }),
        UserModule,
        RedisModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
