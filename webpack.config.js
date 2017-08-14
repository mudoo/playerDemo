const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const es3ifyPlugin = require('es3ify-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const PROD = !DEBUG;

const PATH_CONF = {
    src: './src',
    dist: './dist',

    entry: 'scripts/page',
    script: 'scripts',
    style: 'styles',
    image: 'images',
    font: 'fonts',
    page: 'views',
}
const CND_URL = DEBUG ? '/' : '/';

const DEV_HOST = 'localhost';
const DEV_PORT = 8090;

const CSS_CONF = DEBUG ? '' : '?minimize';

const entries = getEntry(`${PATH_CONF.src}/${PATH_CONF.entry}/**.js`, `${PATH_CONF.src}/${PATH_CONF.entry}/`);
const chunks = Object.keys(entries);

let config = {
    entry: entries,
    output: {
        path: path.join(__dirname, PATH_CONF.dist),
        publicPath: CND_URL,
        filename: `${PATH_CONF.script}/[name].js`,
        chunkFilename: `${PATH_CONF.script}/[id].chunk.js`
    },
    module: {
        //加载器
        rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, PATH_CONF.src),
                use: 'babel-loader'
            }
            /* , {
                        test: /videojs-flash\.js$/,
                        use: 'script-loader'
                    } */
            , {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: `css-loader${CSS_CONF}`
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [`css-loader${CSS_CONF}`, "less-loader"]
                })
            }, {
                test: /\.json$/,
                use: 'json-loader'
            }, {
                test: /\.html?$/,
                use: "html-loader?attrs=img:src img:data-src -minimize" //避免压缩html,https://github.com/webpack/html-loader/issues/50
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: `file-loader?name=${PATH_CONF.font}/[name].[ext]`
            }, {
                test: /\.(png|jpe?g|gif)$/,
                // use: 'url-loader?limit=8192&name=${PATH_CONF.image}/[name]-[hash:8].[ext]'
                use: `file-loader?name=${PATH_CONF.image}/[name]-[hash:8].[ext]`
            }, {
                test: /\.swf$/,
                use: `file-loader?name=swf/[name].[ext]`
            }
        ],

        // 无需解析的库
        noParse: /node_modules\/(jquey|zepto|videojs-contrib-hls|chart\.js)/
    },
    plugins: [
        // for videojs
        new webpack.ProvidePlugin({
            // $: 'jquery',
            videojs: "video.js",
            "window.videojs": "video.js"
        }),
        // new webpack.DefinePlugin({
        //     'typeof global': JSON.stringify('undefined')
        // }),

        // new CommonsChunkPlugin({
        //     name: ['vendors'], // 将公共模块提取，生成名为`vendors`的chunk
        //     chunks: chunks,
        //     minChunks: chunks.length // 提取所有entry共同依赖的模块
        // }),
        new ExtractTextPlugin(`${PATH_CONF.style}/[name].css`), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        // for ie8
        // new es3ifyPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        mainFields: ['jsnext:main', 'browser', 'main'],
        alias: {
            'videojs-contrib-hls': path.join(
                __dirname,
                'node_modules',
                'videojs-contrib-hls',
                'dist',
                'videojs-contrib-hls.js'
            ),
            'videojs': path.join(
                __dirname,
                'node_modules',
                'video.js',
                'dist'
            )
        }
    },

    //使用webpack-dev-server
    devServer: {
        contentBase: PATH_CONF.dist,
        host: DEV_HOST,
        port: DEV_PORT, //默认8080
        inline: true, //可以监控js变化
        hot: true, //热启动
    }
};

// js压缩代码
if (PROD) {
    config.plugins.push(new UglifyJsPlugin({
        // 最紧凑的输出
        beautify: false,
        output: {
            comments: /@preserve|@license|@cc_on|^!/i,
            ascii_only: true
        },
        compress: {
            // hoist_vars: true,
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
        },
        sourceMap: false,
        except: ['$super', '$', 'exports', 'require'] //排除关键字
    }));
}

// 构建页面
const pages = Object.keys(getEntry(`${PATH_CONF.src}/${PATH_CONF.page}/**/*.html`, `${PATH_CONF.src}/${PATH_CONF.page}/`));
pages.forEach(page => {
    let conf = {
        // filename: `${PATH_CONF.page}/${page}.html`, //生成的html存放路径，相对于path
        filename: `${page}.html`, //生成的html存放路径，相对于path
        template: `${PATH_CONF.src}/${PATH_CONF.page}/${page}.html`, //html模板路径
        inject: false, //js插入的位置，true/'head'/'body'/false
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: { //压缩HTML文件
        //     removeComments: true, //移除HTML中的注释
        //     collapseWhitespace: false //删除空白符与换行符
        // }
    };
    if (page in config.entry) {
        // conf.favicon = `${PATH_CONF.src}/${PATH_CONF.image}/favicon.ico`;
        conf.inject = 'body';
        conf.chunks = ['vendors', page];
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;

function getEntry(globPath, pathDir) {
    let files = glob.sync(globPath);
    let entries = {},
        dirname, basename, pathname, extname;

    files.forEach(entry => {
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);

        pathname = path.join(path.relative(dirname, pathDir), basename);
        entries[pathname] = [entry];
    })
    return entries;
}