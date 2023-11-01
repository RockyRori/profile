# 罗粟海的个人网站

[https://rockyrori.github.io/](https://rockyrori.github.io/)
你可以访问我的网站来了解我。

# Astro

这个网站使用纯前端Astro框架搭建，你可以看看教程。
https://docs.astro.build/zh-cn/getting-started/

# 本地部署

git clone git@github.com:RockyRori/profile.git

npm install

npm run dev

http://127.0.0.1:3000/

# 项目结构

以防失效在空闲时间把本教程引用的链接亲自试一遍写到技术博客中再替换成站内链接。

rockyrori
├─.astro
├─.github
├─.vscode
├─node_modules
├─public
│  └─...
├─src
│  └─...
├─.gitignore
├─astro.config.mjs
├─package.json
├─package-lock.json
├─README.md
└─tsconfig.json

.astro Astro项目的内置文件夹，本地运行时生成，不会上传至GitHub。

.github GitHub部署任务，每次提交时触发构建。可以在Actions中看到详细过程，目标是构建静态页面并发布到GitHub Pages上。当前为仅主线分支提交时即合主线时触发构建。
https://github.com/RockyRori/rockyrori.github.io/actions

.vscode VSCODE项目自带初始化文件。可忽略。

node_modules npm依赖包存放地址，不会上传至GitHub。从前辈那里复制一份，或者执行`npm install`，只不过耗时很久。

.gitignore git提交要忽略的文件或文件夹。

astro.config.mjs Astro项目的内置文件，创建项目时生成，记录了网站的访问地址。可忽略。

package.json 项目描述，定义了项目的版本，每次提交时修改版本号。

package-lock.json 项目依赖文件管理，每次提交时修改版本号。

版本首位正数对应发行版，0对应开发板。第二位对应分支号，第三位对应提交号。
例如"version": "0.11.4"表示开发版lambda分支第4次提交。

README.md 项目介绍。

tsconfig.json TypeScript的配置文件。可忽略。

## public
public
├─CNAME
├─favicon.svg
└─assets
   ├─index
   ├─backgrounds
   ├─picture
   └─technique

CNAME 结合GitHub Pages的自定义域名使用，首先注册一个域名，接下来配置DNS解析规则将域名解析到本项目对应的GitHub Pages地址，再把域名写到`CNAME`文件中并且合主线，最后在项目的settings中开启自定义域名选项并且填写域名地址。完成以上步骤即可使用自定义域名访问项目网站，步骤顺序并非严格准确。
https://github.com/RockyRori/rockyrori.github.io/settings/pages

favicon.svg 是网站的小图标，选一张自己喜欢的图片，找一个svg生成网站把图片转成矢量图代码，复制并替换到`favicon.svg`文件中即可更新网站图标。
https://www.logosc.cn/logo/favicon

index 包含现在正在使用的网站背景图片，backgrounds包含曾经使用的网站背景图片。

picture~technique 存放文章中使用的图片，结构是以文章名称为文件夹名称管理，固定包含`封面.jpg`在网站中展示。如果制作文章过程中没有封面，需要去AI绘图网站生成。可选包含8张图片`1.jpg`~`8.jpg`。

## src
src
├─components
├─layouts
├─pages
├─styles
├─env.d.ts
├─README.md
└─content
   ├─picture
   ├─technique
   └─模板

components 定义了网页的组件，整个网页的所有布局都由这些组件拼接而成。

layouts 定义了网站最重要的组成部分————文章，的基础结构。

pages 继承自layouts，每新增一个分类就要在此处新建一个文件夹并在顶部导航栏中添加导航。

styles 定义了HTML标签在本项目中的默认样式。

env.d.ts 在本地运行时生成，可忽略。

README.md 介绍了项目的结构和原理。

content 填充文章实际内容，使用Markdown组织。