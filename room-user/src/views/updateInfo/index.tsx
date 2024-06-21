import { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '@/components/image-uploader';
import { getUserInfo, updateUpdateInfoCaptcha, updateInfo } from './server';
import { UserInfo } from './types';
import './style/index.module.less'

const layout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

export default function UpdateInfo() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const flag = useRef<boolean>(true);
    const [infoId, setInfoId] = useState<{id: number}>({
        id: 0
    });

    const onFinish = async (value: UserInfo) => {
        try {
            await updateInfo(infoId.id, value);
            message.success('修改成功')
            navigate('/')
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    };

    // 发送验证码
    const send = async () => {
        const address = form.getFieldValue('email');
        try {
            await updateUpdateInfoCaptcha(address);
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    };

    const sendCaptcha = () => {
        form
            .validateFields(['email'])
            .then(() => {
                send()
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };
    const query = async () => {
        const res = await getUserInfo();
        form.setFieldValue('headPic', res.data.headPic);
        form.setFieldValue('nickName', res.data.nickName)
        form.setFieldValue('email', res.data.email)
        setInfoId({
            id: res.data.id
        })
    }
    useEffect(() => {
        if(flag.current) {
            flag.current = false;
            query()
          }
    }, [])
    const normFile = (e: string) => {
        console.log(222, e)
        return e;
    };
    return (
        <div id="updateInfo-container">
            <Form
                form={form}
                {...layout1}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
            >
                <Form.Item name="headPic" label="头像" valuePropName="fileList" getValueFromEvent={normFile}>
                    <ImageUploader></ImageUploader>
                </Form.Item>
                <Form.Item
                    label="昵称"
                    name="nickName"
                    rules={[{ required: true, message: '请输入昵称!' }]}
                >
                    <Input />
                </Form.Item>
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
                    <Button type="primary" className="send-verification" onClick={() => sendCaptcha()}>发送验证码</Button>
                </div>
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
