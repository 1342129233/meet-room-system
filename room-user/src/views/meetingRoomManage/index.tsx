import { useRef, useCallback, useState, useEffect } from "react"
import { Button, Form, Image, Input, Table, TableProps, message, Modal, Badge } from 'antd';
import EditMeetingRoomModal from './components/editMeetingRoomModal/index';
import { MeetingRoomSearchResult, SearchMeetingRoom } from "./types";
import { getMeetingRoom, deleteRoom } from './server';
import './style/index.module.less'

export default function MeetingRoomManage() {
    const [form] = Form.useForm();
    const flag = useRef<boolean>(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoomSearchResult>>([]);
    const [isEditMeetingRoomModal, setIsEditMeetingRoomModal] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateId, setUpdateId] = useState<number>(0);
    const columns: TableProps<MeetingRoomSearchResult>['columns'] = [
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
            render: (_, record) => (
                record.isBooked ? <Badge status="error">已被预定</Badge> : <Badge status="success">空闲</Badge>
            )
        },
        {
            title: '操作',
            key: 'config',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record.id)}>编辑</Button>
                    <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                </>
            )
        }
    ];
    function handleEdit(id: number) {
        setUpdateId(id)
        setIsUpdateModalOpen(true);
        setIsEditMeetingRoomModal(true)
    }
    
    async function handleDelete(id: number) {
        try {
            Modal.confirm({ 
                title: '确定删除该会议室吗？',
                onOk: async () => {
                    await deleteRoom(id);
                    message.success('删除成功')
                    await searchMeetingRoom();
                },
                onCancel: () => {
                    message.error('取消删除');
                },
            })
        } catch(err: any) {
            message.error('删除失败')
        }
    }
    const create = () => {
        setUpdateId(0)
        setIsUpdateModalOpen(false);
        setIsEditMeetingRoomModal(true)
    }
    const searchMeetingRoom = useCallback(async (values: SearchMeetingRoom = {
        name: form.getFieldValue('name'),
        capacity: form.getFieldValue('capacity'),
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
        if(flag.current) {
            searchMeetingRoom()
        }
        flag.current = false;
    }, [])
    return (
        <div id="meetingRoomManage-container">
            <div className="meetingRoomManage-form">
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
                    <Form.Item label="设备" name="equipment">
                        <Input placeholder="请输入设备" />
                    </Form.Item>
                    <Form.Item label="">
                        <Button type="primary" htmlType="submit">
                            搜索会议室
                        </Button>
                        <Button type="primary" className="room-button" onClick={() => create()}>
                            添加会议室
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="meetingRoomManage-table">
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
            <EditMeetingRoomModal
                isOPen={isEditMeetingRoomModal}
                isUpdateModalOpen={isUpdateModalOpen}
                id={updateId}
                handleClose={() => {setIsEditMeetingRoomModal(false)}}
                getList={() => searchMeetingRoom()}
            ></EditMeetingRoomModal>
        </div>
    )
}