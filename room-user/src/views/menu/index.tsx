import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';
import './style/index.module.less';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: '会议室管理'
    },
    {
        key: '2',
        label: '预定管理'
    },
    {
        key: '/user_manage',
        label: '用户管理'
    },
    {
        key: '4',
        label: '统计'
    }
];

export default function Menu() {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState(['/user_manage']);
    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
    }
    return (
        <div id="menu-container">
            <div className="menu-area">
                <AntdMenu 
                    defaultSelectedKeys={['/user_manage']}
                    selectedKeys={selectedKeys}
                    items={items}
                    onClick={onClick}
                />
            </div>
            <div className="content-area">
                <Outlet></Outlet>
            </div>
        </div>
    );
}