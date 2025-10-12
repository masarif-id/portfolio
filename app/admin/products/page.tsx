'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { FaSave, FaPlus, FaTrash, FaLock } from 'react-icons/fa';

interface Product {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    hero_icon: string;
    store_url: string;
    secondary_url: string | null;
    secondary_url_label: string | null;
    features: string[];
    packages: Array<{
        name: string;
        description: string;
        price: string;
        count: number;
        countLabel: string;
    }>;
    extra_section_title: string | null;
    extra_section_description: string | null;
    extra_section_items: string[];
    cta_title: string;
    cta_description: string;
    meta_description: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const stored = sessionStorage.getItem('admin_auth');
        if (stored === 'true') {
            setIsAuthenticated(true);
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                setIsAuthenticated(true);
                sessionStorage.setItem('admin_auth', 'true');
                fetchProducts();
            } else {
                setAuthError('Password salah!');
            }
        } catch (error) {
            setAuthError('Terjadi kesalahan. Coba lagi.');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_auth');
        setPassword('');
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
            if (data.length > 0 && !selectedProduct) {
                setSelectedProduct(data[0]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedProduct) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/products/${selectedProduct.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedProduct)
            });

            if (response.ok) {
                alert('Product updated successfully!');
                fetchProducts();
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof Product, value: any) => {
        if (!selectedProduct) return;
        setSelectedProduct({ ...selectedProduct, [field]: value });
    };

    const addArrayItem = (field: 'features' | 'extra_section_items') => {
        if (!selectedProduct) return;
        setSelectedProduct({
            ...selectedProduct,
            [field]: [...selectedProduct[field], '']
        });
    };

    const updateArrayItem = (field: 'features' | 'extra_section_items', index: number, value: string) => {
        if (!selectedProduct) return;
        const newArray = [...selectedProduct[field]];
        newArray[index] = value;
        setSelectedProduct({ ...selectedProduct, [field]: newArray });
    };

    const removeArrayItem = (field: 'features' | 'extra_section_items', index: number) => {
        if (!selectedProduct) return;
        const newArray = selectedProduct[field].filter((_, i) => i !== index);
        setSelectedProduct({ ...selectedProduct, [field]: newArray });
    };

    const addPackage = () => {
        if (!selectedProduct) return;
        setSelectedProduct({
            ...selectedProduct,
            packages: [
                ...selectedProduct.packages,
                { name: '', description: '', price: '', count: 0, countLabel: '' }
            ]
        });
    };

    const updatePackage = (index: number, field: string, value: any) => {
        if (!selectedProduct) return;
        const newPackages = [...selectedProduct.packages];
        newPackages[index] = { ...newPackages[index], [field]: value };
        setSelectedProduct({ ...selectedProduct, packages: newPackages });
    };

    const removePackage = (index: number) => {
        if (!selectedProduct) return;
        const newPackages = selectedProduct.packages.filter((_, i) => i !== index);
        setSelectedProduct({ ...selectedProduct, packages: newPackages });
    };

    if (!isAuthenticated) {
        return (
            <Container className='py-16'>
                <div className='max-w-md mx-auto'>
                    <Card className='p-8'>
                        <div className='flex justify-center mb-6'>
                            <div className='w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center'>
                                <FaLock className='text-3xl text-white dark:text-black' />
                            </div>
                        </div>
                        <h1 className='font-pixelify-sans text-3xl mb-2 text-center'>Admin Login</h1>
                        <p className='text-center text-gray-600 dark:text-gray-300 mb-6'>
                            Masukkan password untuk mengakses admin panel
                        </p>
                        <form onSubmit={handleLogin} className='space-y-4'>
                            <div>
                                <label className='block mb-2 font-medium'>Password</label>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Masukkan password'
                                    className='w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
                                    autoFocus
                                />
                            </div>
                            {authError && (
                                <p className='text-red-500 text-sm'>{authError}</p>
                            )}
                            <button
                                type='submit'
                                className='w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-80 transition-opacity'>
                                Login
                            </button>
                        </form>
                    </Card>
                </div>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className='py-16'>
                <p className='text-center'>Loading...</p>
            </Container>
        );
    }

    return (
        <Container className='py-16'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <h1 className='font-pixelify-sans text-4xl mb-4'>Product Content Manager</h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        Edit your product pages without touching code
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                    Logout
                </button>
            </div>

            <div className='flex gap-4 mb-8'>
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            selectedProduct?.id === product.id
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                        {product.slug.toUpperCase()}
                    </button>
                ))}
            </div>

            {selectedProduct && (
                <div className='space-y-8'>
                    <Card className='p-6'>
                        <h2 className='font-pixelify-sans text-2xl mb-4'>Basic Information</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block mb-2 font-medium'>Title</label>
                                <input
                                    type='text'
                                    value={selectedProduct.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Subtitle</label>
                                <textarea
                                    value={selectedProduct.subtitle}
                                    onChange={(e) => updateField('subtitle', e.target.value)}
                                    rows={3}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Store URL</label>
                                <input
                                    type='text'
                                    value={selectedProduct.store_url}
                                    onChange={(e) => updateField('store_url', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Secondary URL (Optional)</label>
                                <input
                                    type='text'
                                    value={selectedProduct.secondary_url || ''}
                                    onChange={(e) => updateField('secondary_url', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Secondary Button Label</label>
                                <input
                                    type='text'
                                    value={selectedProduct.secondary_url_label || ''}
                                    onChange={(e) => updateField('secondary_url_label', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='font-pixelify-sans text-2xl'>Features</h2>
                            <button
                                onClick={() => addArrayItem('features')}
                                className='flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg'>
                                <FaPlus /> Add Feature
                            </button>
                        </div>
                        <div className='space-y-3'>
                            {selectedProduct.features.map((feature, index) => (
                                <div key={index} className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={feature}
                                        onChange={(e) => updateArrayItem('features', index, e.target.value)}
                                        className='flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                    />
                                    <button
                                        onClick={() => removeArrayItem('features', index)}
                                        className='px-4 py-2 bg-red-500 text-white rounded-lg'>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='font-pixelify-sans text-2xl'>Packages</h2>
                            <button
                                onClick={addPackage}
                                className='flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg'>
                                <FaPlus /> Add Package
                            </button>
                        </div>
                        <div className='space-y-6'>
                            {selectedProduct.packages.map((pkg, index) => (
                                <div key={index} className='p-4 border rounded-lg dark:border-gray-700'>
                                    <div className='flex justify-end mb-4'>
                                        <button
                                            onClick={() => removePackage(index)}
                                            className='px-3 py-1 bg-red-500 text-white rounded text-sm'>
                                            Remove
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block mb-2 text-sm font-medium'>Name</label>
                                            <input
                                                type='text'
                                                value={pkg.name}
                                                onChange={(e) => updatePackage(index, 'name', e.target.value)}
                                                className='w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                        </div>
                                        <div>
                                            <label className='block mb-2 text-sm font-medium'>Price</label>
                                            <input
                                                type='text'
                                                value={pkg.price}
                                                onChange={(e) => updatePackage(index, 'price', e.target.value)}
                                                className='w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                        </div>
                                        <div>
                                            <label className='block mb-2 text-sm font-medium'>Count</label>
                                            <input
                                                type='number'
                                                value={pkg.count}
                                                onChange={(e) =>
                                                    updatePackage(index, 'count', parseInt(e.target.value))
                                                }
                                                className='w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                        </div>
                                        <div>
                                            <label className='block mb-2 text-sm font-medium'>Count Label</label>
                                            <input
                                                type='text'
                                                value={pkg.countLabel}
                                                onChange={(e) => updatePackage(index, 'countLabel', e.target.value)}
                                                className='w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <label className='block mb-2 text-sm font-medium'>Description</label>
                                            <textarea
                                                value={pkg.description}
                                                onChange={(e) => updatePackage(index, 'description', e.target.value)}
                                                rows={2}
                                                className='w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className='p-6'>
                        <h2 className='font-pixelify-sans text-2xl mb-4'>Extra Section (Optional)</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block mb-2 font-medium'>Title</label>
                                <input
                                    type='text'
                                    value={selectedProduct.extra_section_title || ''}
                                    onChange={(e) => updateField('extra_section_title', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Description</label>
                                <textarea
                                    value={selectedProduct.extra_section_description || ''}
                                    onChange={(e) => updateField('extra_section_description', e.target.value)}
                                    rows={2}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <div className='flex items-center justify-between mb-3'>
                                    <label className='font-medium'>Items</label>
                                    <button
                                        onClick={() => addArrayItem('extra_section_items')}
                                        className='flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded text-sm'>
                                        <FaPlus /> Add Item
                                    </button>
                                </div>
                                <div className='space-y-2'>
                                    {selectedProduct.extra_section_items.map((item, index) => (
                                        <div key={index} className='flex gap-2'>
                                            <input
                                                type='text'
                                                value={item}
                                                onChange={(e) =>
                                                    updateArrayItem('extra_section_items', index, e.target.value)
                                                }
                                                className='flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700'
                                            />
                                            <button
                                                onClick={() => removeArrayItem('extra_section_items', index)}
                                                className='px-3 py-2 bg-red-500 text-white rounded'>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className='p-6'>
                        <h2 className='font-pixelify-sans text-2xl mb-4'>CTA Section</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block mb-2 font-medium'>Title</label>
                                <input
                                    type='text'
                                    value={selectedProduct.cta_title}
                                    onChange={(e) => updateField('cta_title', e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block mb-2 font-medium'>Description</label>
                                <textarea
                                    value={selectedProduct.cta_description}
                                    onChange={(e) => updateField('cta_description', e.target.value)}
                                    rows={3}
                                    className='w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                        </div>
                    </Card>

                    <div className='flex justify-end'>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className='flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50'>
                            <FaSave />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}
        </Container>
    );
}
