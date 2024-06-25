import { Form, Input, message, Modal } from 'antd';
import { useCallback, useEffect } from 'react';
import { createRoom, meetingRoom, updateRoom } from '../../server';
import { FormMeetingRoom } from '../../types';

interface EditMeetingRoomModalProps {
    isOPen: boolean;
    isUpdateModalOpen: boolean;
    id: number;
    handleClose: () => void;
    getList: () => void;
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export default function EditMeetingRoomModal(props: EditMeetingRoomModalProps) {
    const [form] = Form.useForm();
    const handleOk = useCallback(async () => {
        const values = form.getFieldsValue();

        values.description = values.description || '';
        
        values.equipment = values.equipment || '';
        const id = props.id;
        try {
            id ? await updateRoom({...values, id }) : await createRoom(values);
            message.success('创建成功')
            form.resetFields(); // 重制
            props.handleClose(); // 关闭
            props.getList();
        } catch(err: any) {
            message.error('删除失败')
        }
    }, [props]);
    async function query() {
        if(!props.id) {
            return;
        }
        try {
            const res = await meetingRoom(props.id);
            form.setFieldValue('id', res.data.id)
            form.setFieldValue('name', res.data.name)
            form.setFieldValue('location', res.data.location)
            form.setFieldValue('capacity', res.data.capacity)
            form.setFieldValue('equipment', res.data.equipment)
            form.setFieldValue('description', res.data.description)
        } catch(err: any) {
            message.error('获取失败')
        }
    }
    useEffect(() => {
        form.resetFields(); // 重制
        query();
    
    }, [props.id])
    return (
        <Modal 
            title="会议室" 
            open={props.isOPen} 
            onOk={handleOk}
            onCancel={() => props.handleClose()}
        >
            <Form
                form={form}
                colon={false}
                {...layout}
            >
                <Form.Item
                    label="会议室名称"
                    name="name"
                    rules={[
                        { required: true, message: '请输入会议室名称!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="位置"
                    name="location"
                    rules={[
                        { required: true, message: '请输入会议室位置!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="容纳人数"
                    name="capacity"
                    rules={[
                        { required: true, message: '请输入容纳量!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="设备"
                    name="equipment"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
