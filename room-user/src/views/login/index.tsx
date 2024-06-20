import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './server';
import './style/index.module.less'
import { LoginUser } from './types';

const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export default function Login() {
    const navigate = useNavigate();
    const onFinish = async (values: LoginUser) => {
        try {
            const { data } = await login(values);
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);
            localStorage.setItem('user_id', JSON.stringify(data.userInfo));
            message.success('登陆成功')
            navigate('/');
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }

    return (
        <div id="login-container">
            <h1>会议室预定系统</h1>
            <Form
                { ...layout1 }
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
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    { ...layout2 }
                >
                    <div className="links">
                        <Link to="/register">创建账号</Link>
                        <Link to="/updatePassword">忘记密码</Link>
                    </div>
                </Form.Item>
                <Form.Item
                    { ...layout2 }
                >
                    <Button className="btn" type="primary" htmlType="submit">
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}