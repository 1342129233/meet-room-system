import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';
import './style/index.module.less';

const items: MenuProps['items'] = [
    {
        key: '/meeting-room-manage',
        label: '会议室管理'
    },
    {
        key: '/booking-manage',
        label: '预定管理'
    },
    {
        key: '/user-manage',
        label: '用户管理'
    },
    {
        key: '/statistics',
        label: '统计'
    }
];

export default function Menu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
        setSelectedKeys([e.key])
    }

    return (
        <div id="menu-container">
            <div className="menu-area">
                <AntdMenu 
                    defaultSelectedKeys={['/user-manage']}
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