import { Button, DatePicker, Form, Input, message, Modal, TimePicker } from "antd";
import { useCallback, useEffect } from "react";
import { bookingAdd } from '../../server';
import { MeetingRoomSearchResult } from '../../types';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

interface BookMeetingRoomModalProps {
    isOPen: boolean;
    meetingRoom?: MeetingRoomSearchResult;
    handleClose: () => void;
    getList: () => void;
}

function getUserInfo() {
    const userInfoStr = localStorage.getItem('user_info');
    if(userInfoStr) {
        return JSON.parse(userInfoStr);
    }
    return '';
}

export default function BookMeetingRoom(props: BookMeetingRoomModalProps) {
    const [form] = Form.useForm();
    const handleOk = async () => {
        if(!props.meetingRoom?.id) {
            message.error('请选择会议室');
            return;
        }
        try {
            await bookingAdd({
                meetingRoomId: props.meetingRoom?.id,
                rangeStartDate: form.getFieldValue('rangeStartDate'),
                rangeStartTime: form.getFieldValue('rangeStartTime'),
                rangeEndDate: form.getFieldValue('rangeEndDate'),
                rangeEndTime: form.getFieldValue('rangeEndTime'),
                note: form.getFieldValue('note'),
                userId: getUserInfo()?.userId || 1
            });
            message.success('已发出申请！');
            props.getList();
            props.handleClose();
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }
    useEffect(() => {
        form.resetFields(); // 重制
    }, [props.isOPen])
    
    return (
        <Modal 
            title="预定会议室" 
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
                    name="meetingRoomName"
                >
                    <div></div>
                </Form.Item>
                <Form.Item
                    label="预定开始日期"
                    name="rangeStartDate"
                    rules={[
                        { required: true, message: '请输入预定开始日期!' }
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="预定开始时间"
                    name="rangeStartTime"
                    rules={[
                        { required: true, message: '请输入预定开始时间!' }
                    ]}
                >
                    <TimePicker />
                </Form.Item>
                <Form.Item
                    label="预定结束日期"
                    name="rangeEndDate"
                    rules={[
                        { required: true, message: '请输入预定结束时间!' }
                    ]}
                >
                    <TimePicker />
                </Form.Item>
                <Form.Item
                    label="备注"
                    name="note"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
