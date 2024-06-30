import { Button, DatePicker, Form, Input, Popconfirm, Table, TimePicker, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { MeetingRoomSearchResult } from "@/views/meetingRoomManage/types";
import { UserSearchResult } from "@/views/userManage/types";
import { useForm } from "antd/es/form/Form";
import { apply as applyApi, reject as rejectApi, unbind as unbindApi, bookingList } from "./server";
import { BookingSearchResult } from './types';
import './style/index.module.less';
import { ConvertMap, convertMap } from "@/utils";
import { StatusMap } from "./configs";

const options = convertMap(StatusMap);

export default function BookingManage() {
    const flag = useRef<boolean>(true);
	const [pageNo, setPageNo] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
    const [totalCount, setTotalCount] = useState(0);
	const [bookingSearchResult, setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
	async function changeStatus(id: number, status: 'apply' | 'reject' | 'unbind') {
		const methods = {
			apply: applyApi,
			reject: rejectApi,
			unbind: unbindApi,
		}
		try {
            const res = await methods[status](id);
            message.success(res.data as unknown as string)
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
		

	}

	const columns: ColumnsType<BookingSearchResult> = [
		{
			title: '会议室名称',
			dataIndex: 'room',
			render(_, record) {
				return record.room.name
			}
		},
		{
			title: '会议室位置',
			dataIndex: 'room',
			render(_, record) {
				return record.room.location
			}
		},
		{
			title: '预定人',
			dataIndex: 'user',
			render(_, record) {
				return record.user.username
			}
		},
		{
			title: '开始时间',
			dataIndex: 'startTime',
			render(_, record) {
				return dayjs(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		{
			title: '结束时间',
			dataIndex: 'endTime',
			render(_, record) {
				return dayjs(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		{
			title: '审批状态',
			dataIndex: 'status',
			onFilter: (value, record) => String(record.status).startsWith(value as string),
			filters: [
				{
					text: '审批通过',
					value: '1',
				},
				{
					text: '审批驳回',
					value: '2',
				},
				{
					text: '申请中',
					value: '3',
				},
				{
					text: '已解除',
					value: '4'
				},
			],
			render: (_, record) => {
                const value: ConvertMap | undefined = options.find((item: ConvertMap) => item.value === record.status);
                return (
                    <div>{ value?.label }</div>
                )
            }
		},
		{
			title: '预定时间',
			dataIndex: 'createTime',
			render(_, record) {
				return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss')
			}
		},
		{
			title: '备注',
			dataIndex: 'note'
		},
		{
			title: '描述',
			dataIndex: 'description'
		},
		{
			title: '操作',
			render: (_, record) => (
				<div>
					<Popconfirm
						title="通过申请"
						description="确认通过吗？"
						onConfirm={() => changeStatus(record.id, 'apply')}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">通过</a>
					</Popconfirm>
					<br />
					<Popconfirm
						title="驳回申请"
						description="确认驳回吗？"
						onConfirm={() => changeStatus(record.id, 'reject')}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">驳回</a>
					</Popconfirm>
					<br />
					<Popconfirm
						title="解除申请"
						description="确认解除吗？"
						onConfirm={() => changeStatus(record.id, 'unbind')}
						okText="Yes"
						cancelText="No"
					>
						<a href="#">解除</a>
					</Popconfirm>
					<br />
				</div>
			)
		}

	];

	const [form] = useForm();
	const searchBooking = useCallback(async () => {
        try {
            const res = await bookingList({
                username: form.getFieldValue('username'),
                meetingRoomName: form.getFieldValue('meetingRoomName'),
                meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
                rangeStartDate: form.getFieldValue('rangeStartDate'),
                rangeStartTime: form.getFieldValue('rangeStartTime'),
                rangeEndDate: form.getFieldValue('rangeEndDate'),
                rangeEndTime: form.getFieldValue('rangeEndTime')
            }, pageNo, pageSize);
            setBookingSearchResult(res.data.bookings.map((item: BookingSearchResult) => {
                return {
                    key: item.id,
                    ...item
                }
            }))
            setTotalCount(res.data.totalCount)
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
	}, [pageNo, pageSize]);

    useEffect(() => {
        searchBooking()
    }, [pageNo, pageSize])

	const changePage = (pageNo: number, pageSize: number) => {
		setPageNo(pageNo);
		setPageSize(pageSize);
	}

	return (
		<div id="bookingManage-container">
			<div className="bookingManage-form">
				<Form
					form={form}
					onFinish={searchBooking}
					name="search"
					layout='inline'
					colon={false}
				>
					<Form.Item label="预定人" name="username">
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item label="会议室名称" name="meetingRoomName">
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item label="预定开始日期" name="rangeStartDate">
						<DatePicker placeholder="请选择" />
					</Form.Item>

					<Form.Item label="预定开始时间" name="rangeStartTime">
						<TimePicker placeholder="请选择" />
					</Form.Item>

					<Form.Item label="预定结束日期" name="rangeEndDate">
						<DatePicker placeholder="请选择" />
					</Form.Item>

					<Form.Item label="预定结束时间" name="rangeEndTime">
						<TimePicker placeholder="请选择" />
					</Form.Item>

					<Form.Item label="位置" name="meetingRoomPosition">
						<Input placeholder="请输入" />
					</Form.Item>

					<Form.Item label=" ">
						<Button type="primary" htmlType="submit">
							搜索预定申请
						</Button>
					</Form.Item>
				</Form>
			</div>
			<div className="bookingManage-table">
                <Table 
                    columns={columns}
                    dataSource={bookingSearchResult}
                    pagination={{ 
                        pageSizeOptions: ['2', '10', '20', '30', '50'],
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
	);
}
