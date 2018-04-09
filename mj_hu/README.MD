## 胡牌算法的单元测试及覆盖率测试 (mochajs + shouldjs + istanbul)

### 目录结构描述
- `checkHu` 麻将胡牌算法目录
    - `base.js` 通用胡牌算法
    - `laiziHu.js` 癞子胡牌算法(依赖base.js)
- `checkHu.test.js` 测试用户所在文件
- `node_modules` 安装的模块,  mocha should istanbul

### 安装模块
```
npm install
```

### 测试用例执行
```
npm run test
```

### 代码覆盖率测试
```
npm run coverage
```
生成的测试报告位于 `./coverage/lcov-report/index.html`


## 参考
> [mochajs官网](https://mochajs.org/)   
> [shouldjs文档](https://github.com/tj/should.js/)
> [istanbul入门教程](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)

