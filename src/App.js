import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ShoppingCart, Sliders, X, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

// Оптимизированный список продуктов с уменьшенными изображениями
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
    // ... остальные продукты ...
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
    const [managerLink, setManagerLink] = useState('');

    // Мемоизированные функции
    const getTotalItems = useCallback(() => cart.reduce((total, item) => total + (item.quantity || 1), 0), [cart]);
    const getTotalPrice = useCallback(() => cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0), [cart]);

    // Загрузка и сохранение корзины
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

    // Фильтрация продуктов
    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProducts(filtered);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

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

    const calculateDeliveryCost = () => {
        switch (deliveryArea) {
            case 'square':
                return 1500;
            case 'city':
                return 2500;
            case 'outside':
                return 0; // индивидуальный тариф
            default:
                return 0;
        }
    };

    const handleOrderPayment = () => {
        // Генерация ссылки на менеджера (в реальном приложении это должно быть с сервера)
        const randomId = Math.random().toString(36).substring(2, 8);
        setManagerLink(`https://t.me/dymok_manager_${randomId}`);
        
        // Здесь должна быть логика отправки данных на сервер
        console.log('Order submitted:', {
            cart,
            contactPhone,
            deliveryAddress,
            checkDevice,
            promoCode,
            deliveryArea,
            total: getTotalPrice() + calculateDeliveryCost()
        });
    };

    const renderMainContent = () => {
        if (showCheckout) {
            return renderCheckout();
        }
        return renderProductCatalog();
    };

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
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                        {product.puffs.toLocaleString()} puff's
                                    </span>
                                </div>
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
                {/* Оплата */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Оплата</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <h4 className="font-medium mb-2">Банковский перевод по реквизитам карты:</h4>
                            <div className="bg-gray-900 p-3 rounded-lg mb-3">
                                <p className="text-sm text-gray-400 mb-1">Номер карты для оплаты:</p>
                                <p className="font-mono text-lg">4400 4303 7037 3992</p>
                            </div>
                            <p className="text-sm text-gray-300">
                                Примечание: Оплатите только стоимость товара, после оплаты нажмите на кнопку "Заказ оплачен", 
                                вам выдаст ссылку на менеджера, обязательно отправьте ему чек и номер вашего заказа, 
                                который вам выдаст бот.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Доставка */}
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
                                    placeholder="Желательно укажите ссылку на 2Гис"
                                    className="w-full bg-gray-700 border-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Проверка устройства */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <label className="flex items-start gap-3">
                        <input 
                            type="checkbox" 
                            checked={checkDevice}
                            onChange={(e) => setCheckDevice(e.target.checked)}
                            className="mt-1 text-green-500"
                        />
                        <div>
                            <h3 className="font-medium mb-1">Проверка устройства на брак (только для одноразовых товаров)</h3>
                            <p className="text-sm text-gray-400">
                                Мы можем проверить ваше одноразовое устройство перед отправкой на наличие брака. 
                                В случае отказа от проверки, мы снимаем с себя ответственность за наличие брака у вашего устройства.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Промокод */}
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

                {/* Итого */}
                <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Товары:</span>
                            <span className="font-medium">{getTotalPrice().toLocaleString()}₸</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Доставка:</span>
                            <span className="font-medium">
                                {deliveryArea === 'outside' ? 'Индивидуальный тариф' : `${calculateDeliveryCost().toLocaleString()}₸`}
                            </span>
                        </div>
                        <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between">
                            <span className="font-semibold">Итого:</span>
                            <span className="text-green-400 font-bold text-lg">
                                {deliveryArea === 'outside' 
                                    ? 'Индивидуальный тариф' 
                                    : `${(getTotalPrice() + calculateDeliveryCost()).toLocaleString()}₸`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Кнопка оплаты */}
                {managerLink ? (
                    <div className="bg-green-900/20 rounded-xl p-5 border border-green-800">
                        <h3 className="font-medium text-green-400 mb-3">Ваш заказ оформлен!</h3>
                        <p className="text-sm mb-4">
                            Пожалуйста, свяжитесь с менеджером по ссылке ниже и отправьте ему чек об оплате и номер заказа.
                        </p>
                        <Button 
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            <a href={managerLink} target="_blank" rel="noopener noreferrer">
                                Связаться с менеджером
                            </a>
                        </Button>
                    </div>
                ) : (
                    <Button 
                        className="w-full py-4 text-lg font-medium bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        onClick={handleOrderPayment}
                        disabled={!contactPhone}
                    >
                        Заказ оплачен
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-4 py-3">
            {/* Улучшенный хедер */}
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

            {/* Поиск с улучшенным дизайном */}
            {!showCheckout && (
                <div className="relative mb-6">
                    <Input
                        placeholder="Поиск товаров..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-xl py-5 px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            )}

            {renderMainContent()}

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

            {/* Улучшенный дизайн корзины */}
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
