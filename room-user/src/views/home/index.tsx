import { UserOutlined } from '@ant-design/icons';
import { Outlet, Link } from 'react-router-dom';
import './style/index.module.less';

export default function Home() {
    return (
        <div id="home-container">
            <div className="header">
                <h1>会议室预定系统</h1>
                <Link to={'/update_info'}>
                    <UserOutlined className="icon" />
                </Link>
            </div>
            <div className="body">
                <Outlet></Outlet>
            </div>
        </div>
    );
}