2.4.19 / 2025-01-24
==================
* 性能优化

2.4.18 / 2024-02-26
==================
* 一键创建小程序组件问题修复

2.4.17 / 2024-02-15
==================
* wxml 变量补全
* 属性提示
* Bind 事件名补全
* Template wxml 中相关提示
* Props 部分情况下无提示问题修复

2.4.13 / 2023-11-29
==================
* 功能: 支持高亮带下划线的wxml标签名 [#177](https://github.com/wx-minapp/minapp-vscode/pull/177)

2.4.10 / 2023-04-26
==================
* 功能: wxml 格式化添加 js-beautify 支持

2.4.9 / 2023-04-05
==================

* 解决项目安全依赖问题 [#155](https://github.com/wx-minapp/minapp-vscode/pull/155),[#152](https://github.com/wx-minapp/minapp-vscode/pull/152),[#149](https://github.com/wx-minapp/minapp-vscode/pull/149)
* 更新github actions配置
* 更新vsce为@vscode/vsce

2.4.8 / 2022-07-02
==================

* 更新发布CI插件`HaaLeo/publish-vscode-extension`到`v1`

2.4.7 / 2022-07-02
==================

* 增加赞助链接
* 更新依赖，将主分支`master`重命名为`main`

2.4.6 / 2022-01-05
==================

* Fix [#133](https://github.com/wx-minapp/minapp-vscode/issues/133), [v2.4.2](https://github.com/wx-minapp/minapp-vscode/compare/v2.4.1...v2.4.2) delete `WxmlDocumentHighlightProvider` unexpectedly

2.4.5 / 2021-12-08
==================

* Fix [#129](https://github.com/wx-minapp/minapp-vscode/issues/129)

2.4.4 / 2021-12-04
==================

* 更改`prettyHtml`源代码以提高与wxml的兼容性，修复一些与之相关的format错误

2.4.3 / 2021-11-16
==================

* 增加`minapp-vscode:init`context标志位，非小程序项目不展示`New Miniprogram Component`功能

2.4.2 / 2021-11-16
==================

* 新增`New Miniprogram Component`文件右键选项，快速创建一个小程序组件文件，支持配置
* 新增`minapp-vscode.cssExtname`配置
* 新增`minapp-vscode.jsExtname`配置
* 新增`minapp-vscode.wxmlExtname`配置
* 优化`跳转到定义`功能，支持style属性内插值的跳转
* 优化插件启动条件,加入`"workspaceContains:**/project.config.json"`和`"workspaceContains:**/app.wxss"`

2.4.1 / 2021-11-07
==================

* 插件名字从`WXML - Language Services`改为`WXML - Language Service`
* 优化`跳转到定义`功能，兜底为文字搜索尽可能提供有效的定义跳转

2.4.0 / 2021-11-03
==================

* 新增配置`minapp-vscode.disableFormat`,解决[#83 (comment)](https://github.com/wx-minapp/minapp-vscode/issues/83#issuecomment-958626391)
* 更新同步微信小程序组件元数据至基础库版本v2.20.1

2.3.7 / 2021-10-13
==================

* 更改配置webpack#resolve.resolvemainfields修复JSON5导入的问题
* 支持ObjectProperty形式申明的函数跳转，Fix [#99](https://github.com/wx-minapp/minapp-vscode/issues/99)
* wxml内函数跳转支持`mut-bind`,`capture-catch`and`capture-bind`

2.3.6 / 2021-10-13
==================

* 支持wxml中tag跳转到自定义的组件

2.3.5 / 2021-10-11
==================

* 更新同步微信小程序WXML标签元数据
* 增加无障碍访问a11y相关标签属性自动补全提示

2.3.4 / 2021-09-01
==================

* 添加钉钉用户交流群二维码
* 删除不再使用的travis-ci配置文件

2.3.3 / 2021-08-31
==================

* 参考vscode-eslint处理webpack打包时`require`语句失效的问题

2.3.2 / 2021-08-31
==================

* 将prettier打包进vsix文件，修复#103

2.3.1 / 2021-08-30
==================

* 插件更名
* 增加deploy状态badge

2.3.0 / 2021-08-30
==================

* 优化插件vsix文件体积(2.88mb -> 261kb)
* 插件更名&更换icon
* 更新代码提示中的微信官方文档链接/wepy文档链接
* 增加Github Actions CI
* 增加issue和PR模板
* 优化wxml语法高亮tmLanguage配置

2.1.0 / 2019-08-01
==================

* 组件独有的事件不出现在 `bind:` 中

2.1.0 / 2019-07-06
==================

* 添加 `showSuggestionOnEnter` 配置，按 Enter 键默认不出现补全，需要将 `showSuggestionOnEnter` 设置成 true

2.0.0 / 2019-07-01
==================

* 优化 wxml 的自动补全机制 [#40](https://github.com/wx-minapp/minapp-vscode/pull/40)
* 优化函数自动补全 [#39](https://github.com/wx-minapp/minapp-vscode/pull/39) [#42](https://github.com/wx-minapp/minapp-vscode/pull/42)
* `{{` 和 `}}` 在属性值中可以自动配对 [#20](https://github.com/wx-minapp/minapp-vscode/issues/20)
* 优化语法高亮，参考 handlebars 的高亮语法 [#44](https://github.com/wx-minapp/minapp-vscode/pull/44)

1.16.0 / 2019-06-21
==================

* 标签多行写法可补全
* tagName 和 tagAttr 可以随时补全

1.15.0 / 2019-06-09
==================

* 支持解析 sass/scss 文件，方便样式名自动补全

1.14.0 / 2019-06-03
==================

* wxmlFormatter 配置支持热更新
* prettyHtml 不会移除自闭合标签的 `/` 符号； [#11](https://github.com/wx-minapp/minapp-vscode/issues/11)

1.13.0 / 2019-04-23
==================

wxml格式增强 [#23](https://github.com/wx-minapp/minapp-vscode/pull/23)

* [x] 支持 `prettyHtml` 格式化
* [x] 支持 `prettier` 格式 wxml
* [x] 支持 选择自定义其他语言 `documentSelector`
* [x] 自动读取项目中的配置文件 (仅针对`prettyHtml`,和`prettier`)
    1. [Prettier configuration file](https://prettier.io/docs/en/configuration.html)
    2. `.editorconfig`

新增配置

* `minapp-vscode.wxmlFormatter` `string `三种(`wxml`,`prettyHtml`,`prettier`) 可选，默认`wxml` (注,目前切换后需要重启vscode)
* `minapp-vscode.documentSelector` `string[]` 自定义关联文件类型，
* `minapp-vscode.prettyHtml`  `{}` [prettyhtml配置项](https://github.com/Prettyhtml/prettyhtml#prettyhtmldoc-string-options-vfile)
* `minapp-vscode.prettier` `{}` [prettier配置项](https://prettier.io/docs/en/configuration.html)


1.12.1 / 2019-01-14
==================

* 修复组件自带的事件不支持 bind:xxx 的写法的问题，见 [issues/15](https://github.com/wx-minapp/minapp-vscode/issues/15)

1.12.0 / 2019-01-05
==================

* 支持 [mpx 小程序框架](https://github.com/didi/mpx)


1.11.1 / 2018-12-03
==================

* bind/catch 不需要带 : 也可以高亮后面的函数


1.11.0 / 2018-11-21
==================

* 可以点击模板文件中的函数或属性跳转到 js/ts 定义的地方


1.10.2 / 2018-11-19
==================

* 修复样式文件解析缓存冲突问题

1.10.1 / 2018-11-19
==================

* 优化样式自动补全
  - 显示相对根目录的文件路径
  - 不再补全已经存在的样式
  - wxml 中的 class 属性支持 “查找所有引用”

* 升级 ts 到 3.1

1.10.0 / 2018-11-15
==================

* 添加样式名自动补全功能

1.9.2 / 2018-11-13
==================

* [vscode 1.29 在格式化时换行符全变成了 auto](https://github.com/wx-minapp/minapp-vscode/issues/6)

1.9.1 / 2018-11-06
==================

* [修复自闭合的 wxs 标签会导致高亮问题的 BUG](https://github.com/wx-minapp/minapp-vscode/issues/4)

1.9.0 / 2018-10-07
==================

* 同步官方组件的最新数据

1.8.0 / 2018-09-02
==================

* 同步官方组件的最新数据

1.7.2 / 2018-08-06
==================

* 添加配置项 `reserveTags`，一般 "text" 标签中的内容如果过长，格式化后会在行首和行尾添加换行符，如果不需要，可以将 reserveTags 设置成 `["text"]`

1.7.1 / 2018-07-29
==================

* 添加配置项 `wxmlQuoteStyle` 和 `pugQuoteStyle`，可以配置自动生成的引号是 `"` 还是 `'`，并且 snippet 中的引号也会使用配置的引号

1.7.0 / 2018-07-07
==================

* 优化自动补全体验，不再需要输入空格触发自动补全，自动会在合适的时机触发
* 修复 wxs 标签在格式化时前后添加换行符的问题 [#84](https://github.com/qiu8310/minapp/issues/84)
* 修复 wxml `{{'a' + foo + 'b'}}` 中的表达式不高亮的问题

1.6.1 / 2018-06-28
==================

* 更新项目 @minapp/wxml-parser，旧版处理多余的结束标签会报错

1.6.0 / 2018-06-23
==================

* wxml 中支持 [emmet 语法](https://docs.emmet.io/cheat-sheet/)，[详情见下文](#emmet)
* 自动关联文件类型
  - *.wxs => javascript
  - *.cjson => jsonc
  - *.wxss => css
* wxml 文件在格式化时，标签属性值上的引号会保留原有的风格（即如果原来是双引号，格式化后也会是双引号；原来是单引号，格式化后也会是单引号）


1.5.1 / 2018-06-15
==================

* 同步微信官方发布的 [2.1.0](https://developers.weixin.qq.com/miniprogram/dev/devtools/uplog.html#20180614-%E5%9F%BA%E7%A1%80%E5%BA%93%E6%9B%B4%E6%96%B0%EF%BC%88210%EF%BC%89) 的组件数据


1.5.0 / 2018-06-10
==================

* 纯 wxml 文件中支持 [wxs 标签](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/01wxs-module.html)

1.4.0 / 2018-06-05
==================

* 在自动补全中支持生成 self close tag

  可以在配置项 `minapp-vscode.selfCloseTags` 中配置这些 self close tag

* 格式化选项 `minapp-vscode.formatMaxLineCharacters` 支持设置成 0 来表示无限大

  如果为 0 时，在格式化时所有的直接含有文本的标签都会格式在一行中


1.3.1 / 2018-06-03
==================

* wxml 语言中高亮匹配的标签 [#72](https://github.com/qiu8310/minapp/issues/72)

1.3.0 / 2018-05-26
==================

* 添加 snippets 功能 [详情查看](./README.md#snippets)

* 优化变量高亮（切换文件时，会有些延迟），见 [#68](https://github.com/qiu8310/minapp/issues/68)
* 标签的属性值是布尔值时，会自动弹出 true/false 来让你选择
* 修复自动补全中默认值无法在编辑时选中的问题


1.2.0 / 2018-05-07
==================

* 模板文件中 js 变量高亮（纯 wxml 文件才支持，vue 文件不支持），[详情查看](./README.md#highlight)

1.1.1 / 2018-05-03
==================

* 更新小程序组件数据，主要添加了 [ad 组件](https://developers.weixin.qq.com/miniprogram/dev/component/ad.html)

1.1.0 / 2018-04-28
==================

* wxml / pug 文件中的 src 标签支持 link 功能（另外可以通过配置 `minapp-vscode.linkAttributeNames` 来支持更多的标签）
* 添加新配置 `minapp-vscode.formatMaxLineCharacters` 可以指定格式化时每行最长的字符数`, close [61](https://github.com/qiu8310/minapp/issues/61)
* 更新官方组件数据

1.0.14 / 2018-04-09
==================

* 修复 pug 语言中，在单行的标签中，写 text 的时候也会触发属性补全

1.0.12 / 2018-04-05
==================

* 支持 pug 语言

  现在需要在 vue 的 template 上指定 `lang` 和 `minapp` 两个选项，如果不指定 `minapp`，默认为 `minapp="mpvue"`

  如:

  1. `<template lang="wxml" minapp="native">`   表示使用 wxml 语言，不使用任何框架
  2. `<template lang="pug" minapp="mpvue">`     表示使用 pug 语言，并使用 mpvue 框架

1.0.10 / 2018-03-31
==================

* 支持 wxml/wepy/mpvue 三类语言的补全
* 补全信息可配置

1.0.6 / 2018-03-23
==================

* 支持格式化 wxml 格式的文件（使用系统的格式化命令即可）
* 插件的分类改成了 `languages`

1.0.4 / 2018-03-17
==================

* 在 vue 模板文件中也能自动补全
