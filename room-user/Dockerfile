# build stage
FROM node:22 as build-stage

WORKDIR /app

COPY package.json ./

# RUN npm config set rejectry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM nginx:stable as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 

# -p 本地端口号/服务打开的端口号 -name 自己的容器名字 镜像的名字
# RUN docker run -d -p 5170:80 --name my room-user