import { useForm } from 'antd/es/form/Form';
import { Button, DatePicker, Form, Input, message, Modal, Table, TableProps, TimePicker } from "antd";
import { useCallback, useEffect, useRef, useState } from 'react';
import { convertMap, ConvertMap } from '@/utils';
import { bookingList, bookingUnbind } from './server';
import { StatusMap } from './configs';
import { BookingSearchResult, SearchBooking } from './types';
import './style/index.module.less';


function getUserInfo() {
    const userInfoStr = localStorage.getItem('user_info');
    if(userInfoStr) {
        return JSON.parse(userInfoStr);
    }
    return '';
}

const options = convertMap(StatusMap);

export default function RoomHistory() {
    const [form] = useForm();
    const flag = useRef<boolean>(true);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [bookingSearchResult, setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
    const columns: TableProps<BookingSearchResult>['columns'] = [
        {
            title: '会议室名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <div>{ record.room.name }</div>
            )
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime'
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime'
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                const value: ConvertMap | undefined = options.find((item: ConvertMap) => item.value === record.status);
                return (
                    <div>{ value?.label }</div>
                )
            }
        },
        {
            title: '预定时间',
            dataIndex: 'startTime',
            key: 'startTime'
        },
        {
            title: '备注',
            dataIndex: 'note',
            key: 'note'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => (
                <div>{ record.room.description }</div>
            )
        },
        {
            title: '操作',
            dataIndex: 'config',
            key: 'config',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleUnbind(record.id)}>解除预定</Button>
                </>
            )
        }
    ];
    
    const searchBooking = useCallback(async () => {
        try {
            const res = await bookingList({
                meetingRoomName: form.getFieldValue('meetingRoomName'),
                meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
                rangeStartDate: form.getFieldValue('rangeStartDate'),
                rangeStartTime: form.getFieldValue('rangeStartTime'),
                rangeEndDate: form.getFieldValue('rangeEndDate'),
                rangeEndTime: form.getFieldValue('rangeEndTime'),
                username: getUserInfo()?.username || 'wangxin'
            }, pageNo, pageSize);
            setBookingSearchResult(
                res.data.bookings.map((item: BookingSearchResult) => {
                    return {
                        key: item.id,
                        ...item
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

    // 解除预定
async function handleUnbind(id: number) {
    try {
        Modal.confirm({ 
            title: '确定解除该会议室吗？',
            onOk: async () => {
                await bookingUnbind(id);
                message.success('解除成功')
                await searchBooking();
            },
            onCancel: () => {
                message.error('取消删除');
            },
        })
    } catch(err: any) {
        message.error(err.data || '系统繁忙,请稍后再试')
    }
}

    useEffect(() => {
        if(flag.current) {
            searchBooking()
        }
        flag.current = false;
    }, [])
    return (
        <div id="bookingHistory-container">
            <div className="bookingHistory-form">
                <Form
                    form={form}
                    onFinish={searchBooking}
                    name="search"
                    layout="inline"
                    colon={false}
                >
                    <Form.Item label="会议室名称" name="meetingRoomName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="预定开始日期" name="rangeStartDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="预定开始时间" name="rangeStartTime">
                        <TimePicker />
                    </Form.Item>
                    <Form.Item label="预结束始日期" name="rangeEndDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="预定结束时间" name="rangeEndTime">
                        <TimePicker />
                    </Form.Item>
                    <Form.Item label="位置" name="meetingRoomPosition">
                        <Input />
                    </Form.Item>
                    <Form.Item label="">
                        <Button type="primary" htmlType="submit">
                            搜索预定历史
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="bookingHistory-table">
                <Table 
                    columns={columns}
                    dataSource={bookingSearchResult}
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
        </div>
    )
}

