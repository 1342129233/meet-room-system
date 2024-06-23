import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import App from './App';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<ConfigProvider locale={zh_CN}>
			<App />
		</ConfigProvider>
	</React.StrictMode>
);
