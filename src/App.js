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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-screen px-4 py-4">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <img src="https://cdn1.cdn-telegram.org/file/QyqXMkgidt5GVueQgruR5IUjmFOINbW-6AjrChU9MAnIAcksbBPTTZEO4wiNguIgZKcMb6gsBVDHaEYOmkmBkAOtF1fpVfy8F3a7HxWljk0HYF8qtTqQ0MpoOi28gBmeHUZKY6VpOna_KfY4g2I28o8wp1yEcyZQa6lr5gCoebemFm01APH0B9Ohnym1fmJjVR50dvc7mGzum_BZqfcxQBF1KgXC4wEbdaTe2rj-XzHlfMZzOuRhc6Pn2nVnhgGYp0SyZLFK0Iaa-3IsNF1CwREZPgtzFX-vp6HWCZLMWGbzXePJ-ZIiyw_iK1qQ7pzaz9nFrIuDPhbmmOMuoChQ1A.jpg" className="w-10 h-10 rounded-full" alt="logo" />
                    <h1 className="text-xl font-bold">Дымок</h1>
                </div>
                <Button
                    size="sm"
                    className="bg-pink-600 text-white px-4 py-2 text-sm rounded-xl shadow-lg hover:scale-105 transition-transform"
                    onClick={() => window.open('https://t.me/dymokminimarket', '_blank')}
                >
                    Наш канал
                </Button>
            </div>

            {/* Поиск */}
            <div className="flex items-center gap-2 mb-5">
                <Input
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-white text-black border-none text-sm p-3 rounded-xl"
                />
            </div>

            <h2 className="text-xl font-semibold mb-4">Товары</h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-16">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
                        <CardContent className="flex flex-col items-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-xl mb-2"
                                loading="lazy"
                            />
                            <div className="text-sm font-semibold">{product.name}</div>
                            <div className="text-xs text-gray-200 mb-2">{product.price.toLocaleString()} тг</div>
                            <Button
                                size="sm"
                                className="bg-green-600 text-white text-xs py-2 px-4 rounded-full hover:bg-green-700"
                                onClick={() => setSelectedProduct(product)}
                            >
                                Добавить
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Корзина и модальные окна */}
            {/* Далее идет остальная часть кода */}
        </div>
    );
}
