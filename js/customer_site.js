const CUSTOMER_SITES = {
    // 默认选中的资源站
    yinghua: {
        api: 'https://www.yhdm2.com/api.php/provide/vod',
        name: '樱花资源',
    },
    iqiyi: {
        "api": "https://www.iqiyizyapi.com/api.php/provide/vod",
        "name": "iqiyi资源"
    },
    tyyszy: {
        api: 'https://www.tyyszy.com/api.php/provide/vod',
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
    ruyi: {
        api: 'https://www.ruyikan.com/api.php/provide/vod',
        name: '如意影视',
    },

    // 其他常用资源站
    qiqi: {
        api: 'https://www.qiqidys.com/api.php/provide/vod',
        name: '七七资源',
    },
    ffzy: {
        api: 'https://ffzyapi.com/api.php/provide/vod',
        detail: 'https://www.ffzy.tv',
        name: '非凡资源',
    },
    lzzy: {
        api: 'https://api.lzzy.cc/api.php/provide/vod',
        name: '量子资源',
    },
    hhzy: {
        api: 'https://api.hhzyapi.com/api.php/provide/vod',
        name: '红海资源',
    },
    kkzy: {
        api: 'https://api.kukezy.com/api.php/provide/vod',
        name: '酷客资源',
    },
    okzy: {
        api: 'https://api.okzy.tv/api.php/provide/vod',
        name: 'OK资源',
    },
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
    if (typeof initAPICheckboxes === 'function') { initAPICheckboxes(); }
} else {
    console.error("错误：请先加载 config.js！");
}