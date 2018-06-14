const autoprofixer =require('autoprefixer');

// postcss是帮我们后处理css文件

module.exports = {
    plugins: [
        autoprofixer()  //为需要加浏览器前缀的css属性加浏览器前缀
    ]
}