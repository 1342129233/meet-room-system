import { Button, Form, Input, Table, message  } from 'antd';
import { useCallback, useState } from 'react';
import { SearchRequest, SearchUser, UserList, UserSearchResult } from './types';
import { columns } from './configs';
import { search } from './server';
import './style/index.module.less';


export default function UserManage() {

    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(1);
    const [userResult, setUserResult] = useState<UserSearchResult[]>([]);

    const searchUser = useCallback(async (values: SearchUser) => {
        console.log(values);
        const params: SearchRequest = {
            ...values,
            pageNo: 1,
            pageSize: 10
        }
        try {
            const res = await search(params);
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
        } catch(err: any) {
            message.error(err.data || '系统繁忙,请稍后再试')
        }
    }, [pageNo, pageSize]);

    const changePage = useCallback(() => {
        setPageNo(pageNo);
        setPageSize(pageSize);
    }, [pageNo, pageSize])

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
                        current: pageNo,
                        pageSize: pageSize,
                        onChange: changePage
                    }}
                />
            </div>
        </div>
    );
}