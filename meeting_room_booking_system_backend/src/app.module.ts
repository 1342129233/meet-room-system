import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 全局配置
			envFilePath: 'src/.env', // 读取的配置文件
        }),
        TypeOrmModule.forRootAsync({
			useFactory(configService: ConfigService) {
				return {
					type: 'mysql',
					host: configService.get('mysql_server_host'),
					port: configService.get('mysql_server_port'),
					username: configService.get('mysql_server_username'),
					password: configService.get('mysql_server_password'),
					database: configService.get('mysql_server_database'),
					synchronize: true,
					logging: true,
					entities: [User, Role, Permission],
					poolSize: 10,
					connectorPackage: 'mysql2',
					// extra: { // 额外的身份验证插件
					// 	authPlugin: 'sha256_password',
					// },
				};
			},
			inject: [ConfigService],
		}),
        UserModule,
        RedisModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
