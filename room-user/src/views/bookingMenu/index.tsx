import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, Button, MenuProps } from 'antd';
import { useState } from "react";
import './style/index.module.less'

const items: MenuProps['items'] = [
    {
        key: '/booking/room-list',
        label: '会议室列表'
    },
    {
        key: '/booking/room-history',
        label: '预定历史'
    }
];

export default function BookingMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
        setSelectedKeys([e.key])
    }
    
    return (
        <div id="booking-menu-container">
            <div className="menu-area">
                <AntdMenu 
                    defaultSelectedKeys={['/booking/room-list']}
                    selectedKeys={selectedKeys}
                    items={items}
                    onClick={onClick}
                />
            </div>
            <div className="content-area">
                <Outlet></Outlet>
            </div>
        </div>
    )
}