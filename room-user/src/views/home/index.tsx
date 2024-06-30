import { UserOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './style/index.module.less';
import { Button, Radio } from 'antd';

export default function Home() {
    const navigate = useNavigate();
    return (
        <div id="home-container">
            <div className="header">
                <Link to="/user-manage" className="sys_name">
                    <h1>会议室预定系统</h1>
                </Link>
                <div>
                    <Radio.Group onChange={(e) => navigate(e.target.value)}>
                        <Radio.Button value="/meeting-room-manage">管理端</Radio.Button>
                        <Radio.Button value="/booking/room-list">用户端</Radio.Button>
                    </Radio.Group>
                    <Link to="/user/info-modify">
                        <UserOutlined className="icon" />
                    </Link>
                </div>
            </div>
            <div className="body">
                <Outlet></Outlet>
            </div>
        </div>
    );
}