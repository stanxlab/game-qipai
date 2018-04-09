## 胡牌算法及单元测试框架分享 (mochajs + shouldjs)

### 目录结构描述
- `checkHu` 麻将胡牌算法目录
    - `base.js` 通用胡牌算法
    - `laiziHu.js` 癞子胡牌算法(依赖base.js)
- `checkHu.test.js` 测试用户所在文件
- `node_modules` 安装的模块, npm install mocha should


### 用例执行
```
npm install
npm test
```

> [mochajs官网](https://mochajs.org/)   
> [shouldjs文档](https://github.com/tj/should.js/)

