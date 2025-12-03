# LibreTV 性能优化方案

## 当前性能问题分析

### 1. 搜索性能问题 ⚠️ **严重**

- **问题**: 配置中 `maxPages: 50`，每个 API 源最多请求 50 页数据，导致大量并发请求
- **影响**: 当选中多个 API 源时，会同时发送几十甚至上百个 HTTP 请求
- **现象**: 搜索时页面长时间卡顿，浏览器可能无响应

### 2. DOM 渲染问题 ⚠️ **严重**

- **问题**: 搜索结果通过 innerHTML 一次性渲染大量 DOM 元素
- **影响**: 当结果数量超过几十条时，渲染会阻塞主线程
- **现象**: 搜索结果显示时页面卡顿

### 3. localStorage 性能问题 ⚠️ **中等**

- **问题**: 频繁读写 localStorage，没有内存缓存
- **影响**: 每次操作都会触发同步 I/O
- **现象**: 设置切换、搜索历史等操作响应慢

### 4. 初始化性能问题 ⚠️ **中等**

- **问题**: DOMContentLoaded 时同步执行多个初始化任务
- **影响**: 页面加载完成后仍需一段时间才能交互
- **现象**: 页面白屏或初始加载慢

### 5. 代理请求性能问题 ⚠️ **高**

- **问题**: 所有 API 请求都通过代理，增加了网络延迟
- **影响**: 每个请求都需要额外的服务器转发时间
- **现象**: 搜索、播放等操作响应慢

## 优化方案

### 🔧 立即优化（高优先级）

#### 1. 减少搜索页数限制

**位置**: `js/config.js` 第 58 行

```javascript
// 修改前
maxPages: 50, // 最大获取页数

// 修改后
maxPages: 3, // 最大获取页数 (从50减少到3，大幅减少请求数)
```

**影响**: 将每个 API 源的最大请求数从 50 降低到 3，大幅减少并发请求数量

#### 2. 实现搜索结果分页/懒加载

**位置**: `js/app.js` search 函数和结果渲染部分

**方案 A - 简单分页**:

- 限制每页显示结果数量（如 20-50 条）
- 添加"加载更多"按钮
- 用户主动触发加载下一页

**方案 B - 虚拟滚动**:

- 只渲染可见区域的 DOM 元素
- 滚动时动态更新显示内容
- 适合大量结果的场景

#### 3. 添加请求并发控制

**位置**: `js/search.js` searchByAPIAndKeyWord 函数

```javascript
// 限制同时进行的请求数量
const MAX_CONCURRENT_REQUESTS = 3;
// 使用Promise队列控制并发
```

#### 4. localStorage 缓存优化

创建一个缓存层，减少 localStorage 的直接访问

```javascript
// 创建内存缓存
const localStorageCache = {
  cache: {},
  get(key) {
    if (this.cache[key] !== undefined) return this.cache[key];
    const value = localStorage.getItem(key);
    this.cache[key] = value;
    return value;
  },
  set(key, value) {
    this.cache[key] = value;
    localStorage.setItem(key, value);
  },
};
```

### 🚀 进阶优化（中等优先级）

#### 5. 防抖和节流

对频繁触发的操作添加防抖/节流：

```javascript
// 搜索输入防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 滚动加载节流
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

#### 6. 异步初始化优化

将非关键初始化任务延迟执行：

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // 关键初始化
  initAPICheckboxes();
  setupEventListeners();

  // 延迟非关键初始化
  setTimeout(() => {
    renderSearchHistory();
    renderCustomAPIsList();
    updateSelectedApiCount();
  }, 100);
});
```

#### 7. 图片懒加载优化

已使用`loading="lazy"`，但可以进一步优化：

- 添加 Intersection Observer API
- 设置占位图片
- 优化图片加载优先级

### 📊 长期优化（低优先级但效果好）

#### 8. Web Worker 处理数据

将数据处理逻辑移到 Web Worker：

- API 数据解析
- 搜索结果过滤和排序
- 避免阻塞主线程

#### 9. ServiceWorker 缓存

- 缓存 API 响应
- 离线支持
- 减少网络请求

#### 10. 代码分割

- 按需加载 JS 模块
- 减少初始加载体积
- 使用动态 import

## 推荐的优化实施顺序

1. ✅ **第一步**: 修改`maxPages`从 50 改为 3（立即见效）
2. ✅ **第二步**: 添加搜索结果分页显示（显著改善）
3. ✅ **第三步**: 添加请求并发控制（防止请求过多）
4. ✅ **第四步**: localStorage 缓存层（提升响应速度）
5. ⏰ **第五步**: 添加防抖节流（优化用户体验）
6. ⏰ **第六步**: 异步初始化优化（加快页面加载）

## 性能监控建议

添加性能监控，帮助定位问题：

```javascript
// 监控搜索性能
console.time("search");
await search();
console.timeEnd("search");

// 监控渲染性能
const start = performance.now();
// DOM操作
const end = performance.now();
console.log(`渲染耗时: ${end - start}ms`);
```

## 预期效果

实施前 3 个优化后：

- 搜索响应时间：从 10-30 秒降至 2-5 秒
- 页面卡顿：明显减少
- 浏览器内存占用：降低 50%以上
- 用户体验：显著提升

## 注意事项

1. **maxPages 减少后，搜索结果可能减少**
   - 解决方案：实现"加载更多"功能，让用户按需加载
2. **分页会增加代码复杂度**

   - 解决方案：使用简单的分页方案，不要过度设计

3. **缓存可能导致数据不一致**
   - 解决方案：合理设置缓存失效策略

## 参考资料

- [Web Performance Optimization](https://developers.google.com/web/fundamentals/performance/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
