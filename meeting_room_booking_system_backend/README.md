docker - docker启动文件
src
    - app 根目录
    - user 用户模块
    - redis 分装 redis 模块
    - utils 工具类

### 关于数据库
要将MySQL中的所有表导出到一个init.sql文件中，你可以使用mysqldump命令行工具。以下是一个基本的命令示例：
```Bash
mysqldump -u 用户名 -p 数据库名 > init.sql
```
替换 用户名 和 数据库名 为你的实际信息
运行这个命令后,系统会提示你输入密码

如果你想要导出特定的数据库,可以直接指定数据库名,如果你想要导出所有数据库,可以使用 --all-databases 选项
导出所有数据库的命令示例
```Bash
mysqldump -u 用户名 -p --all-databases > init.sql
```
记得替换 用户名 为你的MySQL用户名。运行这个命令后，系统会提示你输入密码。
这些命令会将所有表的结构和数据导出到init.sql文件中，你可以使用这个文件来重新创建数据库结构和数据
```Bash
services:
  mysql:  # 定义一个名为 mysql 的服务
    image: mysql:8.0  # 使用 mysql:8.0 镜像作为容器的基础镜像
    command: --default-authentication-plugin=mysql_native_password  # 在容器启动时执行的命令，设置默认身份验证插件为 mysql_native_password
    environment:  # 定义容器的环境变量
      MYSQL_ROOT_PASSWORD: link_manage_dev+1?  # 设置 MySQL 的 root 用户密码
      MYSQL_DATABASE: link-manag-test  # 创建一个名为 link-manag-test 的数据库
      MYSQL_USER: link_manage_dev  # 创建一个名为 link_manage_dev 的用户
      MYSQL_PASSWORD: link_manage_dev+1?  # 设置 link_manage_dev 用户的密码
    ports:  # 将容器的端口映射到宿主机的端口
      - "3306:3306"  # 将容器的 3306 端口映射到宿主机的 3306 端口
    volumes:  # 定义容器的数据卷
      - my-mysql-volume:/var/lib/mysql  # 将 my-mysql-volume 数据卷挂载到容器的 /var/lib/mysql 目录
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # 将当前目录下的 init.sql 文件挂载到容器的 /docker-entrypoint-initdb.d/init.sql 文件
    networks:  # 将容器连接到指定的网络
      - my-network  # 将容器连接到名为 my-network 的网络

```

查看ip
```Bash
docker network inspect 项目名称
案例
docker network inspect meeting_room_booking_system_backend_common-network
```

docker
```Bash
# 查看容器是否启动
docker ps 

# 生成镜像
docker compose up

# 删除镜像
docker compose dowm

# 启动镜像
docker run -d --name <容器名字> <镜像名字>
```