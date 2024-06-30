import { Badge, Button, Form, Input, message, Table, TableProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import BookMeetingRoom from './components/bookMeetingRoom';
import { SearchRoom, RoomResult, MeetingRoomSearchResult } from './types';
import './style/index.module.less';
import { getMeetingRoom } from "./server";

export default function RoomList() {
    const [form] = Form.useForm();
    const flag = useRef<boolean>(true);
    const [isBookMeetingRoomModalOpen, setIsBookMeetingRoomModalOpen] = useState(false);
    const [bookMeetingRoom, setBookMeetingRoom] = useState<MeetingRoomSearchResult>();
    const [meetingRoomResult, setMeetingRoomResult] = useState<Array<RoomResult>>([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const columns: TableProps<RoomResult>['columns'] = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '容纳人数',
            dataIndex: 'capacity',
            key: 'capacity'
        },
        {
            title: '位置',
            dataIndex: 'location',
            key: 'location'
        },
        {
            title: '设备',
            dataIndex: 'equipment',
            key: 'equipment'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '添加时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '上次更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        },
        {
            title: '预定状态',
            dataIndex: 'isBooked',
            key: 'isBooked',
            render: (_, record) => {
                return (record.isBooked ? <Badge status="error">已被预定</Badge> : <Badge status="success">可预定</Badge>)
            }
        },
        {
            title: '操作',
            key: 'config',
            render: (_, record) => (
                <>
                    <Button 
                        type="link"
                        onClick={() => {
                            setIsBookMeetingRoomModalOpen(true);
                            setBookMeetingRoom(record)
                        }}
                    >
                        预定
                    </Button>
                </>
            )
        }
    ];

    const searchMeetingRoom = useCallback(async (values: SearchRoom = {
        name: form.getFieldValue('name'),
        capacity: form.getFieldValue('capacity'),
        location: form.getFieldValue('location'),
        equipment: form.getFieldValue('equipment')
    }) => {
        try {
            const res = await getMeetingRoom({
                ...values,
                pageNo,
                pageSize
            });
            setMeetingRoomResult(
                res.data.meetingRooms.map((item: MeetingRoomSearchResult) => {
                    return {
                        key: item.name,
                        id: item.id,
                        name: item.name,
                        capacity: item.capacity,
                        location: item.location,
                        equipment: item.equipment,
                        description: item.description,
                        isBooked: item.isBooked,
                        createTime: item.createTime,
                        updateTime: item.updateTime
                    }
                })
            )
            setTotalCount(res.data.totalCount)
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }, [pageNo, pageSize]);

    const changePage = useCallback((pageNo: number, pageSize: number) => {
        setPageNo(pageNo)
        setPageSize(pageSize)
    }, []);

    useEffect(() => {
        searchMeetingRoom()
    }, [pageNo, pageSize])
    
    return (
        <div id="roomList-container">
            <div className="roomList-form">
                <Form
                    form={form}
                    onFinish={searchMeetingRoom}
                    name="search"
                    layout="inline"
                    colon={false}
                >
                    <Form.Item label="会议室名称" name="name">
                        <Input placeholder="请输入会议室名称" />
                    </Form.Item>
                    <Form.Item label="容纳人数" name="capacity">
                        <Input placeholder="请输入会议室容纳人数" />
                    </Form.Item>
                    <Form.Item label="位置" name="location">
                        <Input placeholder="请输入位置" />
                    </Form.Item>
                    <Form.Item label="设备" name="equipment">
                        <Input placeholder="请输入设备" />
                    </Form.Item>
                    <Form.Item label="">
                        <Button type="primary" htmlType="submit">
                            搜索会议室
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="meetingRoom-table">
                <Table 
                    columns={columns}
                    dataSource={meetingRoomResult}
                    pagination={{ 
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        total: totalCount,
                        showTotal: (total, range) => `共${total}条`,
                        current: pageNo,
                        pageSize: pageSize,
                        onChange: changePage
                    }}
                />
            </div>
            <BookMeetingRoom 
                isOPen={isBookMeetingRoomModalOpen}
                meetingRoom={bookMeetingRoom}
                handleClose={() => setIsBookMeetingRoomModalOpen(false)}
                getList={() => searchMeetingRoom()}
            />
        </div>
    )
}