meeting_room_booking_system_frontend

nginx 配置
```JS
upstream nest-server {
    // server 192.168.31.56:3005;
    server nest-app:3005;
}

server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    location ^~ /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://nest-server;
    }

    location / {
        root    /usr/share/nginx/html;
        index   index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root    /usr/share/nginx/html;
    }
}
```

在 build 下镜像
```JS
docker build -t fe-container:first .

// 跑起来
npm run start:dev
```

docker
```JS
// 构建镜像
docker build -t <名字> .

// 运行容器
docker run -d -p 5170:80 --name room-user room-user
```