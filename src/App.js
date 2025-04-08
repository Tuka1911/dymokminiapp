import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

// Создаем свои UI компоненты, чтобы не зависеть от внешних
const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-0 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50';
  
  const variants = {
    default: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'bg-transparent border border-gray-600 hover:bg-gray-700',
    ghost: 'bg-transparent hover:bg-gray-700',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const PRODUCTS = [
    {
        id: 'waka-10000',
        name: 'Waka 10000',
        price: 15000,
        image: 'https://cis.wakavaping.com/cdn/shop/articles/10-000_300x.png?v=1713928939',
        puffs: 10000,
        flavors: [
            'Малиновый арбуз', 'Свежая мята', 'Арбуз холодный', 'Клубника Киви',
            'Клубничный взрыв', 'Личи Взрыв', 'Клубника Банан', 'Клубника и манго', 'Мягкий капучино'
        ]
    },
    {
        id: 'waka-8000',
        name: 'Waka 8000',
        price: 12000,
        image: 'https://cis.wakavaping.com/cdn/shop/files/DM8000_300x.png?v=1713171516',
        puffs: 8000,
        flavors: ['Арбуз', 'Манго', 'Клубника', 'Виноград', 'Мята', 'Личи', 'Персик', 'Ананас', 'Кокос']
    },
    {
        id: 'waka-6000',
        name: 'Waka 6000',
        price: 9000,
        image: 'https://cis.wakavaping.com/cdn/shop/files/SMASH-_Red_0f291a25-5fc6-40a3-81d7-ce95651015ce.png?v=1713170708&width=1920',
        puffs: 6000,
        flavors: ['Вишня', 'Арбуз', 'Манго', 'Клубника', 'Личи', 'Персик', 'Ананас', 'Кокос']
    },
    {
        id: 'waka-20000',
        name: 'Waka 20000',
        price: 19000,
        image: 'https://cis.wakavaping.com/cdn/shop/files/3179fe9063be492760799fb3f4865c01_825304fa-4b9c-45c3-81f4-3d331dbdbe25.png?v=1716887989&width=960',
        puffs: 20000,
        flavors: ['Арбуз', 'Манго', 'Клубника', 'Личи', 'Персик', 'Ананас', 'Малина', 'Виноград', 'Грейпфрут', 'Черника', 'Мята']
    },
    {
        id: 'waka-solo-2',
        name: 'Waka Solo 2',
        price: 6000,
        image: 'https://cis.wakavaping.com/cdn/shop/files/Solo2_300x.png?v=1713171679',
        puffs: 2000,
        flavors: ['Арбуз', 'Манго', 'Клубника', 'Личи', 'Персик', 'Малина', 'Черника']
    },
    {
        id: 'elfbar-ice-king',
        name: 'Elfbar Ice King',
        price: 22000,
        image: 'https://static.insales-cdn.com/r/hoW-8JdxY_0/rs:fit:1000:1000:1/plain/images/products/1/1297/961430801/blue_razz_ice.png@png',
        puffs: 30000,
        flavors: ['Киви', 'Арбуз', 'Манго', 'Личи', 'Черника', 'Малина', 'Персик', 'Грейпфрут', 'Мята', 'Тропические фрукты']
    },
    {
        id: 'elfbar-bc-5000',
        name: 'Elfbar BC 5000',
        price: 8000,
        image: 'https://elfbarsvape.com.ua/wp-content/uploads/2023/01/BC5000U_Watermelon_Ice.webp',
        puffs: 5000,
        flavors: ['Личи', 'Манго', 'Черника', 'Грейпфрут', 'Арбуз', 'Клубника']
    },
    {
        id: 'elfbar-planet',
        name: 'Elfbar Planet',
        price: 20000,
        image: 'https://static.insales-cdn.com/r/TasO8i_JS5k/rs:fit:440:0:1/q:100/plain/images/products/1/5693/939439677/large_Elfbar_Planet_StrawberryPeach.webp@webp',
        puffs: 20000,
        flavors: ['Тропические фрукты', 'Манго', 'Арбуз', 'Малина', 'Клубника']
    },
];

export default function DymokApp() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [checkDevice, setCheckDevice] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('square');
  const [orderNumber, setOrderNumber] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [managerLink] = useState('https://t.me/haschwaltw');
  const [paymentDetails] = useState({
    cardNumber: '4400 4303 7037 3992',
    bankName: 'Kaspi Bank',
    recipientName: 'Иван Иванов'
  });

  const getTotalItems = useCallback(() => cart.reduce((total, item) => total + (item.quantity || 1), 0), [cart]);
  const getTotalPrice = useCallback(() => {
    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    // Применяем промокод если он есть
    if (promoCode === 'DISCOUNT10') {
      return subtotal * 0.9; // 10% скидка
    }
    return subtotal;
  }, [cart, promoCode]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const generateOrderNumber = useCallback(() => {
    const date = new Date();
    const datePart = date.getFullYear().toString().slice(-2) + 
                    (date.getMonth() + 1).toString().padStart(2, '0') + 
                    date.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${datePart}-${randomPart}`;
  }, []);

  const calculateDeliveryCost = () => {
    switch (deliveryArea) {
      case 'square': return 1500;
      case 'city': return 2500;
      default: return 0;
    }
  };

  const validatePhone = (phone) => {
    return /^\+?[0-9]{10,15}$/.test(phone);
  };

  const addToCart = useCallback((product, flavor) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === product.id && item.selectedFlavor === flavor
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.selectedFlavor === flavor
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          ...product,
          selectedFlavor: flavor,
          quantity: 1
        }];
      }
    });
    setSelectedProduct(null);
    setSelectedFlavor('');
  }, []);

  const removeFromCart = useCallback((productId, flavor) => {
    setCart(prevCart => prevCart.filter(item =>
      !(item.id === productId && item.selectedFlavor === flavor)
    ));
  }, []);

  const updateQuantity = useCallback((productId, flavor, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, flavor);
      return;
    }

    setCart(prevCart => prevCart.map(item =>
      item.id === productId && item.selectedFlavor === flavor
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }, [removeFromCart]);

  const handleOrderPayment = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    if (!validatePhone(contactPhone)) {
      setSubmitError('Пожалуйста, введите корректный номер телефона');
      setIsSubmitting(false);
      return;
    }

    try {
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      
      const orderData = {
        orderNumber: newOrderNumber,
        date: new Date().toLocaleString(),
        items: cart.map(item => ({
          name: `${item.name} (${item.selectedFlavor})`,
          quantity: item.quantity || 1,
          price: item.price
        })),
        subtotal: getTotalPrice(),
        delivery: deliveryArea === 'outside' ? 'Индивидуальный тариф' : calculateDeliveryCost(),
        contactPhone,
        deliveryAddress,
        checkDevice,
        promoCode,
        paymentDetails
      };

      console.log('Отправка заказа:', orderData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setShowReceipt(true);
      setPaymentConfirmed(true);
      
      setCart([]);
      localStorage.removeItem('cart');
      
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setSubmitError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReceipt = () => (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-6">
      <div className="flex items-center justify-center mb-4">
        {submitSuccess ? (
          <CheckCircle className="text-green-500 mr-2" size={24} />
        ) : (
          <Loader2 className="animate-spin text-yellow-500 mr-2" size={24} />
        )}
        <h3 className="text-xl font-bold">
          {submitSuccess ? `Ваш заказ #${orderNumber} оформлен!` : 'Оформление заказа...'}
        </h3>
      </div>
      
      {submitSuccess ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Дата:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            
            <h4 className="font-medium mt-4 mb-2">Товары:</h4>
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedFlavor}`} className="flex justify-between py-2">
                <span>
                  {item.name} ({item.selectedFlavor}) × {item.quantity || 1}
                </span>
                <span>{(item.price * (item.quantity || 1)).toLocaleString()}₸</span>
              </div>
            ))}
            
            <div className="flex justify-between py-2 border-t border-gray-700 mt-3">
              <span>Сумма товаров:</span>
              <span>{getTotalPrice().toLocaleString()}₸</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span>Доставка:</span>
              <span>
                {deliveryArea === 'outside' 
                  ? 'Индивидуальный тариф (уточнит менеджер)' 
                  : `${calculateDeliveryCost().toLocaleString()}₸`}
              </span>
            </div>
            
            {promoCode === 'DISCOUNT10' && (
              <div className="flex justify-between py-2 text-green-400">
                <span>Скидка по промокоду (10%):</span>
                <span>-{(getTotalPrice() / 0.9 - getTotalPrice()).toLocaleString()}₸</span>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Реквизиты для оплаты:</h4>
            <div className="bg-gray-900 p-3 rounded-lg mb-2">
              <p className="text-sm text-gray-400 mb-1">Номер карты:</p>
              <p className="font-mono text-lg">{paymentDetails.cardNumber}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg mb-2">
              <p className="text-sm text-gray-400 mb-1">Банк:</p>
              <p className="font-medium">{paymentDetails.bankName}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Получатель:</p>
              <p className="font-medium">{paymentDetails.recipientName}</p>
            </div>
            <p className="text-sm text-gray-300 mt-3">
              В комментарии к платежу укажите: <strong>{orderNumber}</strong>
            </p>
          </div>
          
          <div className="mt-6">
            <Button 
              as="a"
              href={`${managerLink}?start=order_${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-medium"
            >
              Связаться с менеджером
            </Button>
            <p className="text-sm text-gray-400 mt-2 text-center">
              После оплаты отправьте менеджеру скриншот чека и номер заказа
            </p>
          </div>
        </>
      ) : submitError ? (
        <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
          <p className="text-red-400">{submitError}</p>
          <Button 
            className="w-full mt-4"
            onClick={handleOrderPayment}
          >
            Попробовать снова
          </Button>
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      )}
    </div>
  );

  // ... остальные функции рендеринга (оставьте как в оригинале, но удалите QR-код)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-4 py-3">
      {/* ... остальной JSX (оставьте как в оригинале) */}
    </div>
  );
}
