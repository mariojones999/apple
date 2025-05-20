document.addEventListener('DOMContentLoaded', () => {
  // 购物车功能
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartModalClose = document.querySelector('.cart-modal-close');
  const cartCheckoutBtn = document.querySelector('.cart-checkout-btn');

  function updateCartCount() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartCount.style.transform = 'scale(1)';
    }, 200);
  }

  function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>购物袋为空</p>';
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="cart-item-details">
            <p>${item.model} ${item.storage} ${item.color}</p>
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
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCartModal();
  }

  function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelector('.cart-icon .nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    openCartModal();
  });

  cartModalClose.addEventListener('click', closeCartModal);

  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeCartModal();
    }
  });

  cartCheckoutBtn.addEventListener('click', () => {
    alert('跳转到结算页面（功能待实现）');
  });

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

  // 导航下拉菜单
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const hasDropdowns = document.querySelectorAll('.has-dropdown');

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
    navToggle.querySelector('i').classList.toggle('fa-bars');
    navToggle.querySelector('i').classList.toggle('fa-times');
  });

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

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 通用点击处理函数
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

  // 颜色选择功能
  const colorOptions = document.querySelectorAll('.color-option');
  const mainProductImage = document.getElementById('mainProductImage');

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

  function updateProductImage(color) {
    const imageMap = {
      black: 'https://via.placeholder.com/400x600.png?text=iPhone+16+Black',
      white: 'https://via.placeholder.com/400x600.png?text=iPhone+16+White',
      blue: 'https://via.placeholder.com/400x600.png?text=iPhone+16+Blue',
      green: 'https://via.placeholder.com/400x600.png?text=iPhone+16+Green',
      red: 'https://via.placeholder.com/400x600.png?text=iPhone+16+Red'
    };

    mainProductImage.classList.add('fade');
    setTimeout(() => {
      mainProductImage.src = imageMap[color] || imageMap.black;
      mainProductImage.alt = `iPhone 16 ${color}`;
      mainProductImage.classList.remove('fade');
    }, 300);
  }

  // 产品特性切换
  const features = document.querySelectorAll('.feature');
  const showcaseImage = document.getElementById('showcaseImage');

  features.forEach(feature => {
    const handleFeatureClick = debounce(() => {
      handleOptionClick(features, feature, () => {
        const imageUrl = feature.getAttribute('data-image');
        const img = showcaseImage.querySelector('img');
        img.classList.add('fade');
        setTimeout(() => {
          img.src = imageUrl;
          img.alt = `iPhone 16 ${feature.getAttribute('data-feature')}`;
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

  // 机型选择
  const modelOptions = document.querySelectorAll('.model-option');

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

  // 存储容量选择
  const storageOptions = document.querySelectorAll('.storage-option');

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

  // 送货方式选择
  const deliveryOptions = document.querySelectorAll('.delivery-option');

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

  // 支付方式选择
  const paymentOptions = document.querySelectorAll('.payment-option');

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

  function updatePrice() {
    const selectedModel = document.querySelector('.model-option.active').getAttribute('data-model');
    const selectedStorage = document.querySelector('.storage-option.active').getAttribute('data-storage');

    let basePrice;
    if (selectedModel === 'iphone16') {
      switch(selectedStorage) {
        case '128': basePrice = 5499; break;
        case '256': basePrice = 6199; break;
        case '512': basePrice = 7599; break;
      }
    } else { // iPhone 16 Pro
      switch(selectedStorage) {
        case '128': basePrice = 7999; break;
        case '256': basePrice = 8799; break;
        case '512': basePrice = 10399; break;
      }
    }

    const priceElement = document.querySelector('.total-price');
    priceElement.textContent = `RMB ${basePrice}`;
    priceElement.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
      priceElement.style.animation = '';
    }, 300);
  }

  function updateSummaryModel() {
    const selectedModel = document.querySelector('.model-option.active h3').textContent;
    document.getElementById('selectedModel').textContent = selectedModel;
  }

  function updateSummaryColor(color) {
    const colorNames = {
      black: '黑色',
      white: '白色',
      blue: '蓝色',
      green: '绿色',
      red: '红色'
    };

    const summary = document.getElementById('selectedConfig');
    const storageText = summary.textContent.split(' - ')[0];
    summary.textContent = `${storageText} - ${colorNames[color]}`;
  }

  function updateSummaryStorage() {
    const storage = document.querySelector('.storage-option.active h4').textContent;
    const summary = document.getElementById('selectedConfig');
    const parts = summary.textContent.split(' - ');
    const colorText = parts.length > 1 ? parts[1] : '蓝色';
    summary.textContent = `${storage} - ${colorText}`;
  }

  // 添加到购物袋
  const addToBagBtn = document.querySelector('.add-to-bag-btn');

  addToBagBtn.addEventListener('click', () => {
    const model = document.querySelector('.model-option.active h3').textContent;
    const storage = document.querySelector('.storage-option.active h4').textContent;
    const color = document.querySelector('.color-option.active span').textContent;
    const price = parseInt(document.querySelector('.total-price').textContent.replace('RMB ', ''));

    if (!model || !storage || !color) {
      alert('请确保已选择机型、存储容量和颜色');
      return;
    }

    addToBagBtn.classList.add('loading');
    setTimeout(() => {
      const item = {
        model,
        storage,
        color,
        price,
        quantity: 1
      };

      const existingItem = cart.find(cartItem =>
        cartItem.model === item.model &&
        cartItem.storage === item.storage &&
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
      alert(`${model} ${storage} ${color} 已添加到购物袋，价格: RMB ${price}`);
    }, 1000);
  });

  addToBagBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addToBagBtn.click();
    }
  });

  // 滚动触发动画
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
});