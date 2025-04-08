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
    // другие продукты
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
