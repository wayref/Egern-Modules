/**
 * 抖音去广告脚本
 * 过滤信息流中的推广视频（带广告标识）
 */

(function() {
    try {
        let body = $response.body;
        if (!body) {
            $done({});
            return;
        }
        
        let data = JSON.parse(body);
        
        // 检查单个视频是否为广告
        function isAd(item) {
            if (!item || typeof item !== 'object') return false;
            
            // 广告标识字段
            if (item.is_ad === true) return true;
            if (item.isAd === true) return true;
            if (item.ad_info) return true;
            if (item.raw_ad_data) return true;
            
            // aweme 结构
            if (item.aweme) {
                if (item.aweme.is_ad === true) return true;
                if (item.aweme.raw_ad_data) return true;
            }
            
            // 商业推广标识
            if (item.commerce_info) return true;
            if (item.promotion_info) return true;
            
            return false;
        }
        
        // 过滤视频列表
        if (data.aweme_list && Array.isArray(data.aweme_list)) {
            data.aweme_list = data.aweme_list.filter(item => !isAd(item));
        }
        
        if (data.data && Array.isArray(data.data)) {
            data.data = data.data.filter(item => !isAd(item));
        }
        
        $done({ body: JSON.stringify(data) });
    } catch (e) {
        $done({});
    }
})();
