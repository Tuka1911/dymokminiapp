import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ShoppingCart, Sliders, X, Plus, Minus, Trash2 } from 'lucide-react';

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
    const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

    // Мемоизированные функции для оптимизации производительности
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

    // Фильтрация продуктов по названию
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

    return (
        <div className="bg-black text-white min-h-screen px-3 py-2">
            {/* Упрощенная шапка для мобильных */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <img src="https://cdn1.cdn-telegram.org/file/QyqXMkgidt5GVueQgruR5IUjmFOINbW-6AjrChU9MAnIAcksbBPTTZEO4wiNguIgZKcMb6gsBVDHaEYOmkmBkAOtF1fpVfy8F3a7HxWljk0HYF8qtTqQ0MpoOi28gBmeHUZKY6VpOna_KfY4g2I28o8wp1yEcyZQa6lr5gCoebemFm01APH0B9Ohnym1fmJjVR50dvc7mGzum_BZqfcxQBF1KgXC4wEbdaTe2rj-XzHlfMZzOuRhc6Pn2nVnhgGYp0SyZLFK0Iaa-3IsNF1CwREZPgtzFX-vp6HWCZLMWGbzXePJ-ZIiyw_iK1qQ7pzaz9nFrIuDPhbmmOMuoChQ1A.jpg" className="w-8 h-8 rounded-full" alt="logo" />
                    <h1 className="text-lg font-bold">Дымок</h1>
                </div>
                <Button
                    size="sm"
                    className="bg-green-500 text-white px-3 py-1 text-sm"
                    onClick={() => window.open('https://t.me/dymokminimarket', '_blank')}
                >
                    Наш канал
                </Button>
            </div>

            {/* Поиск с оптимизацией для мобильных */}
            <div className="flex items-center gap-2 mb-3">
                <Input
                    placeholder="Я ищу..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-gray-800 text-white border-none text-sm h-9"
                />
            </div>

            <h2 className="text-md font-semibold mb-2">Главная</h2>

            {/* Список продуктов с оптимизированной сеткой */}
            <div className="grid grid-cols-2 gap-2 pb-16">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-2">
                            <div className="relative aspect-square mb-2">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="rounded-lg w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x300';
                                    }}
                                />
                            </div>
                            <div className="text-sm font-semibold line-clamp-1">{product.name}</div>
                            <div className="text-xs text-gray-400 mb-2">{product.price.toLocaleString()} тг</div>
                            <Button
                                size="sm"
                                className="w-full text-xs py-1 h-7"
                                onClick={() => setSelectedProduct(product)}
                            >
                                Добавить
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Модальное окно выбора вкуса - оптимизировано для мобильных */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-3 z-50">
                    <div className="bg-zinc-900 rounded-lg p-3 w-full max-w-sm max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-3 sticky top-0 bg-zinc-900 py-2 z-10">
                            <h3 className="text-md font-semibold">Выберите вкус</h3>
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setSelectedFlavor('');
                                }}
                                aria-label="Закрыть"
                                className="p-1"
                            >
                                <X className="text-gray-400" size={20} />
                            </button>
                        </div>

                        <div className="mb-3">
                            <div className="relative aspect-square mb-2">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="rounded-lg w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x300';
                                    }}
                                />
                            </div>
                            <div className="text-sm font-semibold">{selectedProduct.name}</div>
                            <div className="text-xs text-gray-400">{selectedProduct.price.toLocaleString()} тг</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {selectedProduct.flavors.map(flavor => (
                                <Button
                                    key={flavor}
                                    variant={selectedFlavor === flavor ? 'default' : 'outline'}
                                    size="sm"
                                    className={`text-xs py-1 h-auto min-h-9 ${selectedFlavor === flavor ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                    onClick={() => setSelectedFlavor(flavor)}
                                >
                                    <span className="line-clamp-1">{flavor}</span>
                                </Button>
                            ))}
                        </div>

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-sm py-2"
                            disabled={!selectedFlavor}
                            onClick={() => addToCart(selectedProduct, selectedFlavor)}
                        >
                            Добавить в корзину
                        </Button>
                    </div>
                </div>
            )}

            {/* Корзина - оптимизирована для мобильных */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-end justify-center z-50">
                    <div className="bg-zinc-900 rounded-t-lg w-full max-h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center p-3 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                            <h3 className="text-md font-semibold">Корзина ({getTotalItems()})</h3>
                            <button
                                onClick={() => setShowCart(false)}
                                aria-label="Закрыть корзину"
                                className="p-1"
                            >
                                <X className="text-gray-400" size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">Корзина пуста</div>
                            ) : (
                                <div className="space-y-2">
                                    {cart.map((item) => (
                                        <div
                                            key={`${item.id}-${item.selectedFlavor}`}
                                            className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg"
                                        >
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/150';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold truncate">{item.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{item.selectedFlavor}</div>
                                                <div className="text-xs">{item.price.toLocaleString()} тг</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => updateQuantity(item.id, item.selectedFlavor, (item.quantity || 1) - 1)}
                                                >
                                                    <Minus size={12} />
                                                </Button>
                                                <span className="text-xs w-5 text-center">{item.quantity || 1}</span>
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => updateQuantity(item.id, item.selectedFlavor, (item.quantity || 1) + 1)}
                                                >
                                                    <Plus size={12} />
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 text-red-500"
                                                    onClick={() => removeFromCart(item.id, item.selectedFlavor)}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-zinc-700 p-3 sticky bottom-0 bg-zinc-900">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Итого:</span>
                                    <span className="font-semibold">{getTotalPrice().toLocaleString()} тг</span>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-sm py-2">
                                    Оформить заказ
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Кнопка корзины внизу экрана */}
            <div className="fixed bottom-4 right-4 z-40">
                <Button
                    className="bg-green-600 hover:bg-green-700 rounded-full p-3 shadow-lg relative"
                    onClick={() => setShowCart(true)}
                >
                    <ShoppingCart size={20} />
                    {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                            {getTotalItems()}
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
