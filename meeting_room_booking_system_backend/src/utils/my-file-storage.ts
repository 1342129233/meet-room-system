import * as multer from 'multer'; // 引入 multer 模块
import * as fs from 'fs'; // 引入 fs 模块用于文件系统操作

// 设置 multer 的磁盘存储选项
const storage = multer.diskStorage({
    // 设定文件存储目录
    destination: function(req, file, cb) {
        try {
            // 尝试创建 'uploads' 目录，如果已存在则捕获异常
            fs.mkdirSync('uploads');
        } catch (e) {}
        // 将文件存储在 'uploads' 目录中
        cb(null, 'uploads');
    },
    // 设定文件名规则
    filename: function (req, file, cb) {
        // 生成唯一的文件名后缀，包括时间戳、随机数和原始文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname;
        // 将生成的文件名传递给回调函数
        cb(null, uniqueSuffix)
    },
});

export {
    storage
}

