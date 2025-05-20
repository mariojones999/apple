// service.js
document.addEventListener("DOMContentLoaded", function() {
    // 查找附近网点
    const findStoresBtn = document.getElementById('find-stores-btn');
    const storeList = document.getElementById('store-list');

    if (findStoresBtn && storeList) {
        findStoresBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            storeList.style.display = 'block';
            storeList.innerHTML = '<p class="loading-text"><i class="fas fa-spinner fa-spin"></i> 正在加载...</p>';

            try {
                console.log('开始获取 IP 位置...');
                const ipResponse = await fetch('https://ipinfo.io/json?token=your_ipinfo_token');
                if (!ipResponse.ok) throw new Error(`IP 请求失败: ${ipResponse.status}`);
                const ipData = await ipResponse.json();
                console.log('IP 数据:', ipData);
                const { loc } = ipData;
                if (!loc) throw new Error('未获取到地理位置');
                const [lat, lng] = loc.split(',');
                console.log('经纬度:', lat, lng);

                console.log('开始查询附近网点...');
                const googleApiKey = 'your_google_api_key';
                const radius = 5000;
                const keyword = 'Apple Store';
                const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${keyword}&key=${googleApiKey}`;
                console.log('API 请求 URL:', placesUrl);

                const placesResponse = await fetch(placesUrl);
                if (!placesResponse.ok) throw new Error(`Places API 请求失败: ${placesResponse.status}`);
                const placesData = await placesResponse.json();
                console.log('Places 数据:', placesData);

                if (placesData.status !== 'OK') {
                    storeList.innerHTML = `<p>API 状态: ${placesData.status}. 请检查 API 配置。</p>`;
                    return;
                }

                const stores = placesData.results.slice(0, 5);
                if (stores.length === 0) {
                    storeList.innerHTML = '<p>附近没有找到 Apple 服务网点。</p>';
                    return;
                }

                storeList.innerHTML = stores.map(store => `
                    <div class="store-item">
                        <h4>${store.name}</h4>
                        <p>${store.vicinity}</p>
                        <p>评分：${store.rating || '暂无'} (${store.user_ratings_total || 0} 条评价)</p>
                    </div>
                `).join('');
            } catch (error) {
                console.error('错误详情:', error);
                storeList.innerHTML = `<p>查询网点失败: ${error.message}</p>`;
            }
        });
    }

    // 服务详情跳转
    const serviceLink = document.getElementById("serviceLink");
    if (serviceLink) {
        serviceLink.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "service.html";
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 导航栏切换
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 搜索框输入效果
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.05)';
        });
    }
});