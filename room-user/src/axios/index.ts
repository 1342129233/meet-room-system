import { message } from 'antd';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/api',
    timeout: 5 * 1000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

export interface AxiosConfig extends AxiosRequestConfig {
    headers?: AxiosRequestHeaders;
}

export {
    instance
};

export interface Response {
    code: string | number;
    data: string;
    message: string;
}

// 定义响应处理器
const responseHandler = <T>(response: AxiosResponse<Response>): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const body = response.data as unknown as { code: number; message: string }
        
        if (response.status !== 200 && response.status !== 201) {
            reject(body); // 非 200/201 状态，直接抛出异常
            return;
        }

        if (body.code === 200 || body.code === 201) {
            resolve(body);
            return;
        }
        reject(body);
    })
};

// 定义错误处理器
const errorHandler = async (error: any) => {
    if (axios.isCancel(error)) { // 检查请求是否被取消
        console.log('Request canceled:', error.message);
        return Promise.reject(error.message);
    } else if (error.response) { // 如果服务器返回错误响应，则输出错误信息
        console.log('Error response:', error.response.data);
        if (error.response.data.code === 401 && !(error.response.config.url!).includes('/user/admin/refresh')) {
            const res = await refreshToken();
            if (res.status === 200) {
                await instance.request(error.config);
                // 重发原先的请求
                const refreshData: { code: number, data: any } = await instance.request(error.response.config);
                if (refreshData.code === 200 || refreshData.code === 201) {
                    return Promise.resolve(refreshData);
                }
            } else {
                // 刷新 token 失败，跳转到登录界面
                setTimeout(() => {
                    window.location.href="/login"
                }, 1000)
            }
        } else {
            return Promise.reject(error.response.data);
        }
    } else if (error.request) { // 如果请求没有收到响应，输出错误信息
        console.log('No response received:', error.request);
        return {
            code: 500,
            data: '服务未响应'
        } 
    } else { // 其他错误情况，输出错误信息
        console.log('Error:', error.message);
        return Promise.reject(error.response.data);
    }

    
};

// 添加请求拦截器
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
        
    }
    return config;
}, (error) => {
    return Promise.reject(error); 
});
  

instance.interceptors.response.use(responseHandler, errorHandler);

export const get = <T, P=Record<string, unknown>>(url: string, params?: P, config?: AxiosConfig) => {
    return instance.get<T>(url, { params, ...config });
};

export const post = <T, P=Record<string, unknown>>(url: string, params?: P, config?: AxiosConfig) => {
    return instance.post<T>(url, params, config);
};

export const put = <T, P=Record<string, unknown>>(url: string, params?: P, config?: AxiosConfig) => {
    return instance.put<T>(url, params, config);
};

export const del = <T, P=Record<string, unknown>>(url: string, params?: P, config?: AxiosConfig) => {
    return instance.delete<T>(url, { params, ...config  });
};












// 刷新token
async function refreshToken () {
    const refresh_token = localStorage.getItem('refresh_token')
    const res: any = await axios.get(`http://localhost:3005/user/admin/refresh?refreshToken=${refresh_token}`)
    localStorage.setItem('access_token', res.data.data.access_token);
    localStorage.setItem('refresh_token', res.data.data.refresh_token);
    return res;
}