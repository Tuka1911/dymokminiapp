import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ShoppingCart, Sliders, X, Plus, Minus, Trash2, ArrowUp, ArrowDown, Flame } from 'lucide-react';

// Добавим поле popularity и sale для продуктов
const PRODUCTS = [
    {
        id: 'waka-10000',
        name: 'Waka 10000',
        price: 15000,
        image: 'https://cis.wakavaping.com/cdn/shop/articles/10-000_300x.png?v=1713928939',
        puffs: 10000,
        popularity: 5,
        sale: false,
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
        popularity: 4,
        sale: true,
        flavors: ['Арбуз', 'Манго', 'Клубника', 'Виноград', 'Мята', 'Личи', 'Персик', 'Ананас', 'Кокос']
    },
    // ... остальные продукты с добавленными полями popularity и sale
];

export default function DymokApp() {
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedFlavor, setSelectedFlavor] = useState('');
    const [showCart, setShowCart] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
    const [sortOption, setSortOption] = useState('popularity'); // Добавляем состояние для сортировки
    const [showFilters, setShowFilters] = useState(false); // Состояние для отображения фильтров

    // Функции для сортировки
    const sortProducts = useCallback((products, option) => {
        const sorted = [...products];
        switch (option) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'popularity':
                return sorted.sort((a, b) => b.popularity - a.popularity);
            case 'sale':
                return sorted.filter(product => product.sale);
            default:
                return sorted;
        }
    }, []);

    // Обновленный эффект для фильтрации и сортировки
    useEffect(() => {
        const timer = setTimeout(() => {
            let filtered = PRODUCTS;
            
            // Фильтрация по поиску
            if (search) {
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.flavors.some(f => f.toLowerCase().includes(search.toLowerCase()))
                );
            }
            
            // Сортировка
            filtered = sortProducts(filtered, sortOption);
            
            setFilteredProducts(filtered);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, sortOption, sortProducts]);

    // ... остальные функции остаются без изменений ...

    return (
        <div className="bg-black text-white min-h-screen px-3 py-2">
            {/* Шапка с кнопкой канала */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <img src="https://api.logo.com/api/v2/images?design=lg_ZKr8H3ndN71oZLSd7v&u=ff2fc0ec5b7ab0ac231779e391f9f88ff27ee04daca1d04685988a526c540921&width=128&height=128&margins=24&fit=contain&format=webp&quality=60&tightBounds=true" className="w-8 h-8 rounded-full" alt="logo" />
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

            {/* Поиск и кнопка фильтров */}
            <div className="flex items-center gap-2 mb-3">
                <Input
                    placeholder="Я ищу..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-gray-800 text-white border-none text-sm h-9"
                />
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Sliders size={18} />
                </Button>
            </div>

            {/* Панель фильтров */}
            {showFilters && (
                <div className="mb-3 p-2 bg-zinc-900 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant={sortOption === 'popularity' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSortOption('popularity')}
                        >
                            <Flame size={14} className="mr-1" /> Популярные
                        </Button>
                        <Button 
                            variant={sortOption === 'price-low' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSortOption('price-low')}
                        >
                            <ArrowDown size={14} className="mr-1" /> Дешевле
                        </Button>
                        <Button 
                            variant={sortOption === 'price-high' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSortOption('price-high')}
                        >
                            <ArrowUp size={14} className="mr-1" /> Дороже
                        </Button>
                        <Button 
                            variant={sortOption === 'sale' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSortOption('sale')}
                        >
                            🔥 Акции
                        </Button>
                    </div>
                </div>
            )}

            {/* ... остальная часть компонента остается без изменений ... */}
        </div>
    );
}
