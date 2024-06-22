import { ColumnsType } from "antd/es/table";
import { Image } from 'antd';
import type { TableProps } from 'antd';
import { UserSearchResult } from "../types";

export const columns: TableProps<UserSearchResult>['columns'] = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
    },
    {
        title: '头像',
        dataIndex: 'headPic',
        key: 'headPic',
        render: value => {
            return value ? (<Image width={50} src={`http://localhost:9000/${value}`} />) : ("")
        }
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }
];

