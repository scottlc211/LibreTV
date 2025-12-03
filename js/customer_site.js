const CUSTOMER_SITES = {
    // 默认选中的资源站
    yinghua: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
        name: '樱花资源',
    },
    iqiyi: {
        api: 'https://iqiyizyapi.com/api.php/provide/vod',
        name: 'iqiyi资源'
    },
    tyyszy: {
        api: 'https://tyyszy.com/api.php/provide/vod',
        name: '天翼云资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '暴风资源',
    },
    dyttzy: {
        api: 'https://api.dytt8.net/api.php/provide/vod',
        name: '电影天堂资源',
    },
    souni: {
        api: 'https://suoniapi.com/api.php/provide/vod',
        name: '索尼资源',
    },
    qiqi: {
        api: 'https://qiqidys.com/api.php/provide/vod',
        name: '七七资源',
    },
    ffzy: {
        api: 'https://api.ffzyapi.com/api.php/provide/vod',
        detail: 'https://www.ffzy.tv',
        name: '非凡资源',
    },
    lzzy: {
        api: 'https://cj.lziapi.com/api.php/provide/vod',
        name: '量子资源',
    },
    xiaoji: {
        api: 'https://api.xiaojizy.live/provide/vod',
        name: '小鸡资源',
    },
    lb: {
        api: 'https://lbapi9.com/api.php/provide/vod',
        name: '乐播资源',
    },
    douban: {
        api: 'https://caiji.dbzy5.com/api.php/provide/vod',
        name: '豆瓣资源',
    },
    maoyan: {
        api: 'https://api.maoyanapi.top/api.php/provide/vod',
        name: '猫眼资源',
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
    if (typeof initAPICheckboxes === 'function') { initAPICheckboxes(); }
} else {
    console.error("错误：请先加载 config.js！");
}