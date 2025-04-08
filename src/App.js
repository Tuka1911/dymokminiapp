import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ShoppingCart, Sliders, X, Plus, Minus, Trash2 } from 'lucide-react';

// Оптимизированный список продуктов
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
        <div className="bg-gray-900 text-white min-h-screen px-4 py-4">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <img src="https://cdn1.cdn-telegram.org/file/QyqXMkgidt5GVueQgruR5IUjmFOINbW-6AjrChU9MAnIAcksbBPTTZEO4wiNguIgZKcMb6gsBVDHaEYOmkmBkAOtF1fpVfy8F3a7HxWljk0HYF8qtTqQ0MpoOi28gBmeHUZKY6VpOna_KfY4g2I28o8wp1yEcyZQa6lr5gCoebemFm01APH0B9Ohnym1fmJjVR50dvc7mGzum_BZqfcxQBF1KgXC4wEbdaTe2rj-XzHlfMZzOuRhc6Pn2nVnhgGYp0SyZLFK0Iaa-3IsNF1CwREZPgtzFX-vp6HWCZLMWGbzXePJ-ZIiyw_iK1qQ7pzaz9nFrIuDPhbmmOMuoChQ1A.jpg" className="w-8 h-8 rounded-full" alt="logo" />
                    <h1 className="text-xl font-bold">Дымок</h1>
                </div>
                <Button
                    size="sm"
                    className="bg-gray-600 text-white px-4 py-2 text-sm"
                    onClick={() => window.open('https://t.me/dymokminimarket', '_blank')}
                >
                    Наш канал
                </Button>
            </div>

            {/* Поиск */}
            <div className="flex items-center gap-2 mb-4">
                <Input
                    placeholder="Ищете вкус?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-gray-800 text-white border-none text-sm h-10"
                />
            </div>

            <h2 className="text-lg font-semibold mb-4">Продукты</h2>

            {/* Список продуктов */}
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="bg-gray-800 hover:bg-gray-700 transition duration-200 ease-in-out rounded-lg border-gray-600">
                        <CardContent className="p-4">
                            <div className="relative aspect-square mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="rounded-lg w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-sm font-semibold">{product.name}</div>
                            <div className="text-xs text-gray-400 mb-3">{product.price.toLocaleString()} тг</div>
                            <Button
                                size="sm"
                                className="w-full text-xs py-2 h-9 bg-green-600 hover:bg-green-700"
                                onClick={() => setSelectedProduct(product)}
                            >
                                Добавить
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Модальное окно выбора вкуса */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Выберите вкус</h3>
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setSelectedFlavor('');
                                }}
                                aria-label="Закрыть"
                                className="text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="relative aspect-square mb-3">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="rounded-lg w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-sm font-semibold">{selectedProduct.name}</div>
                            <div className="text-xs text-gray-400">{selectedProduct.price.toLocaleString()} тг</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {selectedProduct.flavors.map(flavor => (
                                <Button
                                    key={flavor}
                                    variant={selectedFlavor === flavor ? 'default' : 'outline'}
                                    size="sm"
                                    className={`text-xs py-2 h-auto ${selectedFlavor === flavor ? 'bg-green-600 hover:bg-green-700' : ''}`}
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

            {/* Корзина */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-end justify-center z-50">
                    <div className="bg-gray-800 rounded-t-lg w-full max-h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                            <h3 className="text-lg font-semibold">Корзина ({getTotalItems()})</h3>
                            <button
                                onClick={() => setShowCart(false)}
                                aria-label="Закрыть корзину"
                                className="text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">Корзина пуста</div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div
                                            key={`${item.id}-${item.selectedFlavor}`}
                                            className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg"
                                        >
                                            <div className="relative w-16 h-16 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold truncate">{item.name}</div>
                                                <div className="text-xs text-gray-400">{item.selectedFlavor}</div>
                                                <div className="text-xs">{item.price.toLocaleString()} тг</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="xs"
                                                    variant="outline"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => updateQuantity(item.id, item.selectedFlavor, (item.quantity || 1) - 1)}
                                                >
                                                    <Minus size={12} />
                                                </Button>
                                                <span className="text-xs w-5 text-center">{item.quantity || 
