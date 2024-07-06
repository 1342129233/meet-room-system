import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {

    @IsNotEmpty({
        message: '用户名不能为空',
    })
    @ApiProperty()
    username: string;

    @IsNotEmpty({
        message: '昵称不能为空',
    })
    @ApiProperty()
    nickName: string;

    @IsNotEmpty({
        message: '密码不能为空',
    })
    @MinLength(6, {
        message: '密码不能少于 6 位',
    })
    @ApiProperty()
    password: string;

    @IsNotEmpty({
        message: '邮箱不能为空',
    })
    @IsEmail({}, {
        message: '不是合法的邮箱格式',
    })
    @ApiProperty()
    email: string;

    @IsNotEmpty({
        message: '手机号不能为空',
    })
    @IsMobilePhone('zh-CN')
    @ApiProperty()
    phoneNumber: string;

    @IsNotEmpty({
        message: '验证码不能为空',
    })
    @ApiProperty()
    captcha: string;
}
