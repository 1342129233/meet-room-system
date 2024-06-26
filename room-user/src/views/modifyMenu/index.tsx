import { Outlet, useNavigate } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';
import { useState } from 'react';
import './style/index.module.less'

const items: MenuProps['items'] = [
    {
        key: '/user/info-modify',
        label: '修改信息'
    },
    {
        key: '/user/password-modify',
        label: '修改密码'
    }
]


export default function modifyMenu() {
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState(['/user/info-modify']);
    const handleMenuItemClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
    }
    return (
        <div id="menu-container">
            <div className="menu-area">
                <AntdMenu
                    defaultSelectedKeys={['/user/info-modify']}
                    selectedKeys={selectedKeys}
                    items={items}
                    onClick={handleMenuItemClick}
                />
            </div>
            <div className="content-area">
                <Outlet />
            </div>
        </div>
    )
}