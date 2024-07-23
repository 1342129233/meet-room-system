const path = require('path');
const CracoLessPlugin = require("craco-less");
const { loaderByName } = require("@craco/craco");
 
module.exports = {
    webpack:{
        alias:{
            "@": path.resolve(__dirname, "src")
        },
        // 更改build打包文件名称
        // configure: (webpackConfig, { env, paths }) => {
        //     webpackConfig.output.path = path.resolve(__dirname, 'Hello')
        //     paths.appBuild = path.resolve(__dirname, 'Hello')
        //     return webpackConfig
        // }
    },
	//配置代理解决跨域
	devServer: {
		proxy: {
			"/fe-app": {
				target: 'http://127.0.0.1:80',
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			}
		}
	},
    // 插件
    plugins: [
        {
          	plugin: CracoLessPlugin,
          	options: {
				modifyLessRule(lessRule, context) {
					// You have to exclude these file suffixes first,
					// if you want to modify the less module's suffix
					lessRule.exclude = /\.m\.less$/;
					return lessRule;
				},
				modifyLessModuleRule(lessModuleRule, context) {
					// Configure the file suffix
					lessModuleRule.test = /\.m\.less$/;
		
					// Configure the generated local ident name.
					const cssLoader = lessModuleRule.use.find(loaderByName("css-loader"));
					cssLoader.options.modules = {
						localIdentName: "[local]_[hash:base64:5]",
					};
			
					return lessModuleRule;
				},
          	},
        },
    ],
    // 如果没有安装,可以删除
    babel: {
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
    }
}