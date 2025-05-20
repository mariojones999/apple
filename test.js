document.addEventListener('DOMContentLoaded', () => {
  // 产品配置
  const productConfig = {
    iphone: {
      models: {
        'iphone-16': { name: 'iPhone 16', basePrice: { '128': 5499, '256': 6499, '512': 8499 } },
        'iphone-16-plus': { name: 'iPhone 16 Plus', basePrice: { '128': 6499, '256': 7499, '512': 9499 } }
      },
      colors: {
        black: '黑色',
        white: '白色',
        blue: '蓝色',
        green: '绿色',
        red: '红色'
      },
      storages: ['128GB', '256GB', '512GB'],
      imageMap: {
        black: './image/黑.webp',
        white: './image/白.webp',
        blue: './image/蓝.webp',
        green: './image/绿.webp',
        red: './image/红.webp'
      },
      featureImages: {
        camera: 'E:\\Web前端\\苹果16商品详情页面\\image\\camera.jpg',
        chip: 'E:\\Web前端\\苹果16商品详情页面\\image\\A18.png',
        battery: 'E:\\Web前端\\苹果16商品详情页面\\image\\battary.png'
      }
    },
    mac: {
      models: {
        'macbook-air': { name: 'MacBook Air', basePrice: { '256': 7999, '512': 9499 } }
      },
      colors: {
        'space-gray': '深空灰',
        silver: '银色',
        starlight: '星光色'
      },
      storages: ['256GB', '512GB'],
      imageMap: {
        'space-gray': 'E:\\Web前端\\苹果16商品详情页面\\image\\Black.jpg',
        silver: 'E:\\Web前端\\苹果16商品详情页面\\image\\Macbook_yin.jpg',
        starlight: 'E:\\Web前端\\苹果16商品详情页面\\image\\Gold.jpg'
      },
      featureImages: {
        display: 'E:\\Web前端\\苹果16商品详情页面\\image\\Black.jpg',
        chip: 'E:\\Web前端\\苹果16商品详情页面\\image\\M3.jpg',
        battery: 'E:\\Web前端\\苹果16商品详情页面\\image\\battary.png'
      }
    },
    ipad: {
      models: {
        'ipad-pro': { name: 'iPad Pro', basePrice: { '128': 6799, '256': 7499, '512': 8899 } }
      },
      colors: {
        'space-gray': '深空灰',
        silver: '银色'
      },
      storages: ['128GB', '256GB', '512GB'],
      imageMap: {
        'space-gray': 'E:\\Web前端\\苹果16商品详情页面\\image\\iPad黑.webp',
        silver: 'E:\\Web前端\\苹果16商品详情页面\\image\\iPad白.webp'
      },
      featureImages: {
        display: 'E:\\Web前端\\苹果16商品详情页面\\image\\iPad黑.webp',
        chip: './image/M3.jpg',
        pencil: 'E:\\Web前端\\苹果16商品详情页面\\image\\Appelpencil.jpg'
      }
    },
    watch: {
      models: {
        'watch-series10': { name: 'Apple Watch Series 10', basePrice: { '42': 3199, '46': 3499 } }
      },
      colors: {
        titanium: '钛金属',
        'black-titanium': '黑色钛金属'
      },
      sizes: ['42mm', '46mm'],
      imageMap: {
        titanium: 'E:\\Web前端\\苹果16商品详情页面\\image\\watch2.png',
        'black-titanium': 'E:\\Web前端\\苹果16商品详情页面\\image\\watch 1.png'
      },
      featureImages: {
        display: 'E:\\Web前端\\苹果16商品详情页面\\image\\watch2.png',
        health: 'E:\\Web前端\\苹果16商品详情页面\\image\\health.jpg',
        charging: 'E:\\Web前端\\苹果16商品详情页面\\image\\battary.png'
      }
    },

    airpods: {
    models: {
      'airpods-pro2': { name: 'AirPods Pro 2', basePrice: { 'magsafe': 1999, 'usb-c': 1999 } }
    },
    colors: {
      white: '白色'
    },
    accessories: ['magsafe', 'usb-c'], // 使用 accessories 代替 sizes
    imageMap: {
      white: 'E:\\Web前端\\苹果16商品详情页面\\image\\air.jpg' // 颜色图片路径
    },
    featureImages: {
      anc: './image/H2.png', // 主动降噪
      'adaptive-audio': './image/airpods_left.png', // 自适应音频
      spatial: './image/airpodsblack.png' // 个性化空间音频
    }
  }
  };

  // 检测当前产品类型
  const currentPath = window.location.pathname.split('/').pop() || 'home.html';
  let productType;
  switch (currentPath) {
    case 'index.html': productType = 'iphone'; break;
    case 'macbook-air.html': productType = 'mac'; break;
    case 'ipad-pro.html': productType = 'ipad'; break;
    case 'apple-watch.html': productType = 'watch'; break;
    case 'airpods-pro.html': productType = 'airpods'; break;
    default: productType = 'home';
  }

  // 购物车功能
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartModalClose = document.querySelector('.cart-modal-close');
  const cartCheckoutBtn = document.querySelector('.cart-checkout-btn');

  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
      }, 200);
    }
  }

  function updateCartModal() {
    if (!cartItemsContainer || !cartTotal) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>购物袋为空</p>';
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const sizeOrStorage = item.product === 'watch' ? item.size : item.storage;
        cartItem.innerHTML = `
          <div class="cart-item-details">
            <p>${item.model} ${sizeOrStorage} ${item.color}</p>
            <p>RMB ${item.price} x ${item.quantity}</p>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <button class="quantity-decrease" data-index="${index}" aria-label="减少数量">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-increase" data-index="${index}" aria-label="增加数量">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}" aria-label="移除商品">移除</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }

    cartTotal.textContent = `RMB ${total}`;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  function openCartModal() {
    if (cartModal) {
      cartModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateCartModal();
    }
  }

  function closeCartModal() {
    if (cartModal) {
      cartModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (document.querySelector('.cart-icon .nav-link')) {
    document.querySelector('.cart-icon .nav-link').addEventListener('click', (e) => {
      e.preventDefault();
      openCartModal();
    });
  }

  if (cartModalClose) {
    cartModalClose.addEventListener('click', closeCartModal);
  }

  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      alert('跳转到结算页面（功能待实现）');
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (e.target.classList.contains('quantity-increase')) {
        cart[index].quantity += 1;
        updateCartModal();
      } else if (e.target.classList.contains('quantity-decrease')) {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          updateCartModal();
        }
      } else if (e.target.classList.contains('cart-item-remove')) {
        cart.splice(index, 1);
        updateCartModal();
      }
    });
  }

  // 导航栏功能
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const hasDropdowns = document.querySelectorAll('.has-dropdown');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('active');
      navToggle.querySelector('i').classList.toggle('fa-bars');
      navToggle.querySelector('i').classList.toggle('fa-times');
    });
  }

  hasDropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const isActive = dropdown.classList.contains('active');
        hasDropdowns.forEach(d => d.classList.remove('active'));
        if (!isActive) {
          dropdown.classList.add('active');
          link.setAttribute('aria-expanded', 'true');
        } else {
          link.setAttribute('aria-expanded', 'false');
        }
      }
    });

    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });

  // 导航栏高亮
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 通用选择处理
  function handleOptionClick(options, option, callback) {
    options.forEach(opt => {
      opt.classList.remove('active', 'clicked');
      opt.setAttribute('aria-selected', 'false');
    });
    option.classList.add('active', 'clicked');
    option.setAttribute('aria-selected', 'true');
    setTimeout(() => option.classList.remove('clicked'), 300);
    if (callback) callback(option);
  }

  // 颜色选择
  const colorOptions = document.querySelectorAll('.color-option');
  const mainProductImage = document.getElementById('mainProductImage');

  if (colorOptions.length && mainProductImage && productType !== 'home') {
    colorOptions.forEach(option => {
      const handleColorClick = debounce(() => {
        handleOptionClick(colorOptions, option, () => {
          const color = option.getAttribute('data-color');
          updateProductImage(color);
          updateSummaryColor(color);
        });
      }, 50);

      option.addEventListener('click', handleColorClick);
      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleColorClick();
        }
      });
    });
  }

  function updateProductImage(color) {
    if (!mainProductImage || productType === 'home') return;
    const config = productConfig[productType];
    mainProductImage.classList.add('fade');
    setTimeout(() => {
      mainProductImage.src = config.imageMap[color] || config.imageMap[Object.keys(config.imageMap)[0]];
      mainProductImage.alt = `${config.models[Object.keys(config.models)[0]].name} ${config.colors[color]}`;
      mainProductImage.classList.remove('fade');
    }, 300);
  }

  // 特性切换
  const features = document.querySelectorAll('.feature');
  const showcaseImage = document.getElementById('showcaseImage');

  if (features.length && showcaseImage && productType !== 'home') {
    features.forEach(feature => {
      const handleFeatureClick = debounce(() => {
        handleOptionClick(features, feature, () => {
          const imageUrl = feature.getAttribute('data-image');
          const img = showcaseImage.querySelector('img');
          img.classList.add('fade');
          setTimeout(() => {
            img.src = imageUrl;
            img.alt = `${productConfig[productType].models[Object.keys(productConfig[productType].models)[0]].name} ${feature.getAttribute('data-feature')}`;
            img.classList.remove('fade');
          }, 300);
        });
      }, 50);

      feature.addEventListener('click', handleFeatureClick);
      feature.addEventListener('touchstart', handleFeatureClick, { passive: true });
      feature.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFeatureClick();
        }
      });
    });
  }

  // 机型选择
  const modelOptions = document.querySelectorAll('.model-option');

  if (modelOptions.length && productType !== 'home') {
    modelOptions.forEach(option => {
      const handleModelClick = debounce(() => {
        handleOptionClick(modelOptions, option, () => {
          updatePrice();
          updateSummaryModel();
        });
      }, 50);

      option.addEventListener('click', handleModelClick);
      option.addEventListener('touchstart', handleModelClick, { passive: true });
      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleModelClick();
        }
      });
    });
  }

  // 存储/尺寸选择
  const storageOptions = document.querySelectorAll('.storage-option');

  if (storageOptions.length && productType !== 'home') {
    storageOptions.forEach(option => {
      const handleStorageClick = debounce(() => {
        handleOptionClick(storageOptions, option, () => {
          updatePrice();
          updateSummaryStorage();
        });
      }, 50);

      option.addEventListener('click', handleStorageClick);
      option.addEventListener('touchstart', handleStorageClick, { passive: true });
      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStorageClick();
        }
      });
    });
  }

  // 送货方式选择
  const deliveryOptions = document.querySelectorAll('.delivery-option');

  if (deliveryOptions.length && productType !== 'home') {
    deliveryOptions.forEach(option => {
      const handleDeliveryClick = debounce(() => {
        handleOptionClick(deliveryOptions, option);
      }, 50);

      option.addEventListener('click', handleDeliveryClick);
      option.addEventListener('touchstart', handleDeliveryClick, { passive: true });
      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDeliveryClick();
        }
      });
    });
  }

  // 支付方式选择
  const paymentOptions = document.querySelectorAll('.payment-option');

  if (paymentOptions.length && productType !== 'home') {
    paymentOptions.forEach(option => {
      const handlePaymentClick = debounce(() => {
        handleOptionClick(paymentOptions, option);
      }, 50);

      option.addEventListener('click', handlePaymentClick);
      option.addEventListener('touchstart', handlePaymentClick, { passive: true });
      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePaymentClick();
        }
      });
    });
  }

  // 价格更新
  function updatePrice() {
    if (productType === 'home') return;
    const selectedModel = document.querySelector('.model-option.active')?.getAttribute('data-model');
    const selectedStorage = document.querySelector('.storage-option.active')?.getAttribute('data-storage');
    if (!selectedModel || !selectedStorage) return;

    const config = productConfig[productType];
    const basePrice = config.models[selectedModel]?.basePrice[selectedStorage];
    const priceElement = document.querySelector('.total-price');
    if (priceElement && basePrice) {
      priceElement.textContent = `RMB ${basePrice}`;
      priceElement.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        priceElement.style.animation = '';
      }, 300);
    }
  }

  // 更新型号摘要
  function updateSummaryModel() {
    const selectedModel = document.querySelector('.model-option.active h3')?.textContent;
    const selectedModelElement = document.getElementById('selectedModel');
    if (selectedModel && selectedModelElement) {
      selectedModelElement.textContent = selectedModel;
    }
  }

  // 更新颜色摘要
  function updateSummaryColor(color) {
    if (productType === 'home') return;
    const config = productConfig[productType];
    const summary = document.getElementById('selectedConfig');
    if (!summary) return;
    const sizeOrStorage = productType === 'watch' ? 'size' : 'storage';
    const currentSizeOrStorage = summary.textContent.split(' - ')[0] || config[sizeOrStorage === 'size' ? 'sizes' : 'storages'][0];
    summary.textContent = `${currentSizeOrStorage} - ${config.colors[color]}`;
  }

  // 更新存储/尺寸摘要
  function updateSummaryStorage() {
    const summary = document.getElementById('selectedConfig');
    if (!summary) return;
    const storageOrSize = document.querySelector('.storage-option.active h4')?.textContent;
    const parts = summary.textContent.split(' - ');
    const colorText = parts.length > 1 ? parts[1] : productConfig[productType].colors[Object.keys(productConfig[productType].colors)[0]];
    if (storageOrSize) {
      summary.textContent = `${storageOrSize} - ${colorText}`;
    }
  }

  // 添加到购物袋
  const addToBagBtn = document.querySelector('.add-to-bag-btn');

  if (addToBagBtn && productType !== 'home') {
    addToBagBtn.addEventListener('click', () => {
      const model = document.querySelector('.model-option.active h3')?.textContent;
      const storageOrSize = document.querySelector('.storage-option.active h4')?.textContent;
      const color = document.querySelector('.color-option.active span')?.textContent;
      const price = parseInt(document.querySelector('.total-price')?.textContent.replace('RMB ', ''));

      if (!model || !storageOrSize || !color) {
        alert('请确保已选择机型、存储/尺寸和颜色');
        return;
      }

      addToBagBtn.classList.add('loading');
      setTimeout(() => {
        const item = {
          product: productType,
          model,
          [productType === 'watch' ? 'size' : 'storage']: storageOrSize,
          color,
          price,
          quantity: 1
        };

        const existingItem = cart.find(cartItem =>
          cartItem.product === item.product &&
          cartItem.model === item.model &&
          cartItem[productType === 'watch' ? 'size' : 'storage'] === item[productType === 'watch' ? 'size' : 'storage'] &&
          cartItem.color === item.color
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push(item);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        addToBagBtn.classList.remove('loading');
        alert(`${model} ${storageOrSize} ${color} 已添加到购物袋，价格: RMB ${price}`);
      }, 1000);
    });

    addToBagBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        addToBagBtn.click();
      }
    });
  }

  // 滚动动画
  const sections = document.querySelectorAll('.section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
  });

  // 初始化
  updateCartCount();
  updateCartModal();
  if (productType !== 'home') {
    updatePrice();
    updateSummaryModel();
    updateSummaryStorage();
    updateProductImage(document.querySelector('.color-option.active')?.getAttribute('data-color') || Object.keys(productConfig[productType].colors)[0]);
  }
});


const colorInputs = document.querySelectorAll('input[name="color"]');
const mainProductImage = document.getElementById('mainProductImage');

if (colorInputs.length && mainProductImage && productType !== 'home') {
  colorInputs.forEach(input => {
    const handleColorChange = debounce(() => {
      if (input.checked) {
        const color = input.id;
        console.log('Selected color:', color); // 调试日志
        updateProductImage(color);
        updateSummaryColor(color);

        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(opt => {
          opt.classList.remove('active', 'clicked');
          opt.setAttribute('aria-selected', 'false');
          if (opt.getAttribute('data-color') === color) {
            opt.classList.add('active');
            opt.setAttribute('aria-selected', 'true');
          }
        });
      }
    }, 50);

    input.addEventListener('change', handleColorChange);
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      label.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          input.checked = true;
          handleColorChange();
        }
      });
    }
  });

  const defaultColor = document.querySelector('input[name="color"]:checked')?.id;
  if (defaultColor) {
    updateProductImage(defaultColor);
    updateSummaryColor(defaultColor);
  }
}

function updateProductImage(color) {
  if (!mainProductImage || productType === 'home') return;
  const config = productConfig[productType];
  console.log('Updating image for color:', color);
  mainProductImage.classList.add('fade');
  setTimeout(() => {
    const imageUrl = config.imageMap[color] || config.imageMap[Object.keys(config.imageMap)[0]];
    console.log('Image URL:', imageUrl);
    mainProductImage.src = imageUrl;
    mainProductImage.alt = `${config.models[Object.keys(config.models)[0]].name} ${config.colors[color]}`;
    mainProductImage.classList.remove('fade');

    mainProductImage.onerror = () => {
      console.log(`Failed to load image: ${imageUrl}`);
      mainProductImage.src = config.imageMap[Object.keys(config.imageMap)[0]];
      mainProductImage.alt = `${config.models[Object.keys(config.models)[0]].name} 默认图片`;
    };
  }, 300);
}