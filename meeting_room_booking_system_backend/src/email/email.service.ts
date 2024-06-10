import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
	transporter: Transporter;

	constructor(private configService: ConfigService) {
		this.transporter = createTransport({
			host: configService.get('nodemailer_host'),
			port: configService.get('nodemailer_port'),
			auth: {
				user: configService.get('nodemailer_auth_user'), // 邮箱账号
				pass: configService.get('nodemailer_auth_pass'), // 邮箱密码
			},
		});
	}

	async sendMail({ to, subject, html }) {
		// 发送邮件
		console.log(222, this.transporter)
		await this.transporter.sendMail({
			from: { // 发送人地址
				name: '会议室预定系统',
				address: this.configService.get('nodemailer_auth_user'),
			},
			to, // 收件人地址
			subject, // 邮件主题
			html, // 邮件内容
		});
	}
}