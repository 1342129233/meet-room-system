import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUser } from './types';
import './style/index.module.less'
import { registerCaptcha, register } from './server';

const layout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export default function Register() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    // 提交
    const onFinish = async (values: RegisterUser) => {
        try {
            await register(values); 
            message.success('注册成功');
            setTimeout(() => {
                setTimeout(() => {
                    navigate('/login');
                })
            }, 1000);
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试');
        }
    };
    // 发送验证码
    const send = async () => {
        const address = form.getFieldValue('email');
        try {
            await registerCaptcha(address);
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }
    const sendCaptcha = () => {
        form
            .validateFields(['email'])
            .then(() => {
                send()
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    }
    // 再次密码重复判断
    const validatePassword = ({ getFieldValue }: any) => ({
        validator(_: any, value: any) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('两次输入的密码不一致!'));
        },
    });
    return (
        <div id="register-container">
            <h1>会议室预定系统</h1>
            <Form
                { ...layout1 }
                form={form}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="昵称"
                    name="nickName"
                    rules={[{ required: true, message: '请输入昵称!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: '请输入确认密码!' },
                        ({ getFieldValue }) => validatePassword({ getFieldValue })
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱!' }]}
                >
                    <Input />
                </Form.Item>
                <div className="captcha-wrapper">
                    <Form.Item
                        label="验证码"
                        name="captcha"
                        rules={[{ required: true, message: '请输入验证码!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Button type="primary" className="send-verification" onClick={sendCaptcha}>发送验证码</Button>
                </div>
                <Form.Item
                    { ...layout2 }
                >
                    <div className="links">
                        已有账号?去<Link to="/login">登陆</Link>
                    </div>
                </Form.Item>
                <Form.Item
                    { ...layout2 }
                >
                    <Button className="btn" type="primary" htmlType="submit">
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}