// 使用 repl 的模式来跑(也就是初始化数据)
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const replServer = await repl(AppModule);
    replServer.setupHistory(".nestjs_repl_hostory", (err) => {
        if(err) {
            console.error(err);
        }
    });
}
bootstrap();
