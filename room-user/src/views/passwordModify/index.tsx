import { Button, Form, Input, message } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCaptcha, updatePassword, getUserInfo } from './server';
import { UpdatePasswordForm } from './types';
import './style/index.module.less'

const layout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

// 修改密码
export default function PasswordModify() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const flag = useRef<boolean>(true);
    const [infoId, setInfoId] = useState<{id: number}>({
        id: 0
    });

    const onFinish = async (value: UpdatePasswordForm) => {
        try {
            const res = await updatePassword(value);
            message.success(res.data)
            navigate('/login')
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }
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
    const query = async () => {
        try {
            const res = await getUserInfo();
            form.setFieldValue('headPic', res.data.headPic);
            form.setFieldValue('nickName', res.data.nickName)
            form.setFieldValue('email', res.data.email)
            setInfoId({
                id: res.data.id
            })
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }
    useEffect(() => {
        if(flag.current) {
            query()
        }
        flag.current = false;
    }, []);
    return (
        <div id="passwordModify-container">
            <Form
                { ...layout1 }
                form={form}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
            >
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '请输入邮箱!' },
                        { type: 'email', message: '请输入合法邮箱地址' }
                    ]}
                >
                    <Input disabled />
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
                    label="新密码"
                    name="password"
                    rules={[{ required: true, message: '请输入新密码!' }]}
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
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Button className="btn" type="primary" htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

