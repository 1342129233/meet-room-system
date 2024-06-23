import { UserOutlined } from '@ant-design/icons';
import { Outlet, Link } from 'react-router-dom';
import './style/index.module.less';

export default function Home() {
    return (
        <div id="home-container">
            <div className="header">
                <Link to="/user_manage" className="sys_name">
                    <h1>会议室预定系统</h1>
                </Link>
                <Link to="/user/info_modify">
                    <UserOutlined className="icon" />
                </Link>
            </div>
            <div className="body">
                <Outlet></Outlet>
            </div>
        </div>
    );
}