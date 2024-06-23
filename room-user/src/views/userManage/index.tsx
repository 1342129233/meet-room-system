import { Button, Form, Input, Table, message  } from 'antd';
import { useRef, useCallback, useState, useEffect } from 'react';
import { SearchRequest, SearchUser, UserList, UserSearchResult } from './types';
import { columns } from './configs';
import { search } from './server';
import './style/index.module.less';


export default function UserManage() {
    const flag = useRef<boolean>(true);
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userResult, setUserResult] = useState<UserSearchResult[]>([]);

    const searchUser = useCallback(async (values: SearchUser) => {
        const params: SearchRequest = {
            ...values,
            pageNo: 1,
            pageSize: 10
        }
        try {
            const res = await search(params);
            console.log('请求成功', res)
            setUserResult(
                res.data.users.map((item: UserList) => {
                    return {
                        key: item.username,
                        username: item.username,
                        headPic: item.headPic,
                        nickName: item.nickName,
                        email: item.email,
                        createTime: item.createTime
                    }
                })
            )
            setTotalCount(res.data.totalCount)
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }, [pageNo, pageSize]);

    const changePage = useCallback(() => {
        setPageNo(pageNo);
        setPageSize(pageSize);
    }, [pageNo, pageSize])

    useEffect(() => {
        if(flag.current) {
            searchUser({
                username: '',
                nickName: '',
                email: ''
            })
        }
        flag.current = false;
    }, [])

    return (
        <div id="userManage-container">
            <div className="userManage-form">
                <Form
                    onFinish={searchUser}
                    name="search"
                    layout="inline"
                    colon={false}
                >
                    <Form.Item 
                        label="用户名" 
                        name="username"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        label="昵称" 
                        name="nickName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        label="邮箱" 
                        name="email" 
                        rules={[
                            { type: 'email', message: '请输入合法邮箱地址' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit">
                            搜索用户
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="userManage-table">
                <Table 
                    columns={columns}
                    dataSource={userResult}
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
    );
}