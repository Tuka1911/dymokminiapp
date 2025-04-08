import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';

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
    // ... другие продукты ...
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
    const getTotalPrice = useCallback(() => cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0), [cart]);

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
        
        try {
            const newOrderNumber = generateOrderNumber();
            setOrderNumber(newOrderNumber);
            
            // Формируем данные заказа
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

            // В реальном приложении здесь будет отправка на сервер
            console.log('Отправка заказа:', orderData);
            
            // Имитация задержки отправки
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSubmitSuccess(true);
            setShowReceipt(true);
            setPaymentConfirmed(true);
            
            // Очищаем корзину после успешного оформления
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
                        
                        <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                            <h4 className="font-medium text-yellow-400 mb-2">Важно!</h4>
                            <p className="text-sm">
                                Оплатите только стоимость товаров: <strong>{getTotalPrice().toLocaleString()}₸</strong>.
                                Стоимость доставки уточнит менеджер после получения заказа.
                            </p>
                        </div>
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
                    
                    <div className="flex flex-col items-center mt-6">
                        <p className="text-sm text-gray-400 mb-4">Или отсканируйте QR-код для оплаты:</p>
                        <div className="p-3 bg-white rounded-lg mb-4">
                            <QRCode 
                                value={`bank://transfer?card=${paymentDetails.cardNumber.replace(/\s/g, '')}&amount=${getTotalPrice()}&comment=${orderNumber}`}
                                size={128}
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <Button 
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-medium"
                        >
                            <a href={`${managerLink}?start=order_${orderNumber}`} target="_blank" rel="noopener noreferrer">
                                Связаться с менеджером
                            </a>
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

    const renderCheckout = () => (
        <div className="pb-20">
            <div className="flex items-center mb-6">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2"
                    onClick={() => setShowCheckout(false)}
                >
                    <ArrowLeft size={20} />
                </Button>
                <h2 className="text-xl font-bold">Оформление заказа</h2>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Доставка</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium">Яндекс доставка</p>
                                <p className="text-sm text-gray-400">Время доставки: от 60 до 180 минут.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium">Стоимость доставки:</h4>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <input 
                                        type="radio" 
                                        name="deliveryArea" 
                                        checked={deliveryArea === 'square'}
                                        onChange={() => setDeliveryArea('square')}
                                        className="text-green-500"
                                    />
                                    <div className="flex-1">
                                        <p>В квадрате Саина – Рыскулова – Восточка – Аль-Фараби</p>
                                        <p className="text-sm text-gray-400">1500₸</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <input 
                                        type="radio" 
                                        name="deliveryArea" 
                                        checked={deliveryArea === 'city'}
                                        onChange={() => setDeliveryArea('city')}
                                        className="text-green-500"
                                    />
                                    <div className="flex-1">
                                        <p>В пределах города (за пределами квадрата)</p>
                                        <p className="text-sm text-gray-400">2500₸</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <input 
                                        type="radio" 
                                        name="deliveryArea" 
                                        checked={deliveryArea === 'outside'}
                                        onChange={() => setDeliveryArea('outside')}
                                        className="text-green-500"
                                    />
                                    <div className="flex-1">
                                        <p>За город</p>
                                        <p className="text-sm text-gray-400">Индивидуальный тариф</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Контактный телефон *</label>
                                <Input 
                                    type="tel" 
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="+7 (777) 123-45-67"
                                    className="w-full bg-gray-700 border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Адрес доставки</label>
                                <Input 
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder="Укажите адрес или ссылку на 2Гис"
                                    className="w-full bg-gray-700 border-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <label className="flex items-start gap-3">
                        <input 
                            type="checkbox" 
                            checked={checkDevice}
                            onChange={(e) => setCheckDevice(e.target.checked)}
                            className="mt-1 text-green-500"
                        />
                        <div>
                            <h3 className="font-medium mb-1">Проверка устройства на брак</h3>
                            <p className="text-sm text-gray-400">
                                Мы проверим ваше устройство перед отправкой. При отказе от проверки
                                ответственность за брак снимается.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h3 className="font-medium mb-3">Промокод</h3>
                    <div className="flex gap-2">
                        <Input 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Введите промокод"
                            className="flex-1 bg-gray-700 border-gray-600"
                        />
                        <Button variant="outline" className="border-gray-600">
                            Применить
                        </Button>
                    </div>
                </div>

                {paymentConfirmed ? (
                    renderReceipt()
                ) : (
                    <div className="space-y-4">
                        <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-800">
                            <h4 className="font-medium text-yellow-400 mb-2">Важно!</h4>
                            <p className="text-sm">
                                Оплатите только стоимость товаров: <strong>{getTotalPrice().toLocaleString()}₸</strong>.
                                Стоимость доставки уточнит менеджер после получения заказа.
                            </p>
                        </div>
                        
                        <Button 
                            className="w-full py-4 text-lg font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            onClick={handleOrderPayment}
                            disabled={!contactPhone || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Оформление...
                                </>
                            ) : (
                                'Я оплатил'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProductCatalog = () => (
        <>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Популярные товары</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-20">
                {filteredProducts.map(product => (
                    <Card
                        key={product.id}
                        className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                    >
                        <CardContent className="p-0">
                            <div className="relative aspect-square group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm line-clamp-1 mb-1">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-400 font-bold">{product.price.toLocaleString()} ₸</span>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 rounded-lg transition-colors"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        Выбрать
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-4 py-3">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <img
                        src="https://cdn1.cdn-telegram.org/file/QyqXMkgidt5GVueQgruR5IUjmFOINbW-6AjrChU9MAnIAcksbBPTTZEO4wiNguIgZKcMb6gsBVDHaEYOmkmBkAOtF1fpVfy8F3a7HxWljk0HYF8qtTqQ0MpoOi28gBmeHUZKY6VpOna_KfY4g2I28o8wp1yEcyZQa6lr5gCoebemFm01APH0B9Ohnym1fmJjVR50dvc7mGzum_BZqfcxQBF1KgXC4wEbdaTe2rj-XzHlfMZzOuRhc6Pn2nVnhgGYp0SyZLFK0Iaa-3IsNF1CwREZPgtzFX-vp6HWCZLMWGbzXePJ-ZIiyw_iK1qQ7pzaz9nFrIuDPhbmmOMuoChQ1A.jpg"
                        className="w-10 h-10 rounded-full border border-gray-600 shadow-md"
                        alt="Логотип Дымок"
                    />
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Дымок
                        </h1>
                        <p className="text-xs text-gray-400">Минимаркет</p>
                    </div>
                </div>
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
                    onClick={() => window.open('https://t.me/dymokminimarket', '_blank')}
                >
                    Наш канал
                </Button>
            </header>

            {!showCheckout && (
                <div className="relative mb-6">
                    <Input
                        placeholder="Поиск товаров..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-xl py-5 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            )}

            {showCheckout ? renderCheckout() : renderProductCatalog()}

            {/* Модальное окно выбора вкуса */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-100">{selectedProduct.name}</h3>
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setSelectedFlavor('');
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-5">
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-green-400 font-bold text-lg">
                                        {selectedProduct.price.toLocaleString()} ₸
                                    </span>
                                    <span className="block text-xs text-gray-400">
                                        {selectedProduct.puffs.toLocaleString()} puff's
                                    </span>
                                </div>
                                <div className="text-sm text-gray-300">
                                    Доступно {selectedProduct.flavors.length} вкусов
                                </div>
                            </div>
                        </div>

                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Выберите вкус:</h4>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {selectedProduct.flavors.map(flavor => (
                                <Button
                                    key={flavor}
                                    variant={selectedFlavor === flavor ? 'default' : 'outline'}
                                    className={`text-sm py-2 h-auto min-h-10 transition-all ${
                                        selectedFlavor === flavor
                                            ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent'
                                            : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    onClick={() => setSelectedFlavor(flavor)}
                                >
                                    {flavor}
                                </Button>
                            ))}
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-3 rounded-lg text-lg font-medium shadow-lg transition-all duration-300 disabled:opacity-50"
                            disabled={!selectedFlavor}
                            onClick={() => addToCart(selectedProduct, selectedFlavor)}
                        >
                            Добавить в корзину
                        </Button>
                    </div>
                </div>
            )}

            {/* Корзина */}
            {showCart && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-end justify-center z-50">
                    <div className="bg-gray-800 rounded-t-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border-t border-gray-700 shadow-xl">
                        <div className="flex justify-between items-center p-5 border-b border-gray-700">
                            <h3 className="text-xl font-bold">
                                Корзина <span className="text-green-400">({getTotalItems()})</span>
                            </h3>
                            <button
                                onClick={() => setShowCart(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <ShoppingCart size={48} className="text-gray-500 mb-4" />
                                    <h4 className="text-lg font-medium text-gray-300 mb-1">Корзина пуста</h4>
                                    <p className="text-gray-500 text-sm">Добавьте товары из каталога</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={`${item.id}-${item.selectedFlavor}`}
                                            className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                                        >
                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{item.name}</h4>
                                                <p className="text-sm text-gray-400 truncate">{item.selectedFlavor}</p>
                                                <p className="text-green-400 font-medium">
                                                    {item.price.toLocaleString()} ₸ × {item.quantity || 1}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-gray-600 hover:bg-gray-600"
                                                    onClick={() => updateQuantity(item.id, item.selectedFlavor, (item.quantity || 1) - 1)}
                                                >
                                                    <Minus size={16} />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity || 1}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-gray-600 hover:bg-gray-600"
                                                    onClick={() => updateQuantity(item.id, item.selectedFlavor, (item.quantity || 1) + 1)}
                                                >
                                                    <Plus size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:bg-red-900/30"
                                                    onClick={() => removeFromCart(item.id, item.selectedFlavor)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-700 p-5 bg-gray-900/50">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="text-gray-300">Общая сумма:</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        {getTotalPrice().toLocaleString()} ₸
                                    </span>
                                </div>
                                <Button
                                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300"
                                    onClick={() => {
                                        setShowCart(false);
                                        setShowCheckout(true);
                                    }}
                                >
                                    Оформить заказ
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Плавающая кнопка корзины */}
            {!showCheckout && (
                <div className="fixed bottom-6 right-6 z-40">
                    <Button
                        className="relative bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full p-4 shadow-xl transition-all duration-300 group"
                        onClick={() => setShowCart(true)}
                    >
                        <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                                {getTotalItems()}
                            </span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
