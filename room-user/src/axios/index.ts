import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9000',
    timeout: 10 * 1000,
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
    msg?: string;
}

// 定义响应处理器
const responseHandler = (response: any) => {
    // 在这里可以处理成功响应
    if (response.status === 200 || response.status === 201) {
        // 可以在这里进行一些全局处理，比如日志记录或数据格式化
        if(response.data.code === 200 || response.data.code === 201) {
            return Promise.resolve(response.data); // 直接返回响应数据
        }
        return Promise.reject(response.data);
    } else {
      // 如果状态码不是200，可以在这里处理其他情况
      const { data } = response;
      return Promise.reject(data);
    }
};

// 定义错误处理器
const errorHandler = (error: any) => {
    // 在这里可以处理错误响应
    if (error.response) {
      // 服务器响应了一个状态码在2xx之外的范围
      console.error('Error response:', error.response);
      return Promise.reject(error.response.data);
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