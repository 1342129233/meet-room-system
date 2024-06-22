import axios, { AxiosResponse, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9000',
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
const responseHandler = <T>(response: AxiosResponse<Response>): Promise<T> => {
    
    return new Promise((resolve, reject) => {
        const body: T = response.data as T;
        if(response.status === 200 || response.status === 201) {
            if(response.data.code === 200 || response.data.code === 201) {
                resolve(body); // 直接返回响应数据
            }
            reject(body);
        } else {
            reject(body);
        }
    })
};

// 定义错误处理器
const errorHandler = async (error: any) => {
    const { data, config } = error.response;
    // 在这里可以处理错误响应
    if (error.response) {
        // 服务器响应了一个状态码在2xx之外的范围
        //   console.error('Error response:', error.response);
        //   return Promise.reject(error.response.data);
        if(data.code === 401 && !(config.url!).includes('/user/admin/refresh')) {
            // const res = await refreshToken()
            // if(res.status === 200) {
            //     return axios(config)
            // } else {
            //     setTimeout(() => {
            //         window.location.href="/login"
            //     }, 1000)
            // }
        }
    } else if (error.request) {
        // 请求已经发出，但没有收到响应
        console.error('No response received:', error.request);
        return Promise.reject(new Error('No response received'));
    } else {
        // 其他错误
        console.error('Error:', error.message);
        return Promise.reject(error);
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
    console.log('error', error)
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