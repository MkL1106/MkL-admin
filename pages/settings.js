import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [featuredProduct, setFeaturedProduct] = useState(''); // Use string for product ID
    const [products, setProducts] = useState([]);
    const [price, setPrice] = useState(0);
    const [editSettings, setEditSettings] = useState(false);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        fetchFeaturedProduct(); // Fetch featured product and then products
    }, []);

    function fetchProducts() {
        axios.get('/api/products').then(response => {
            const allProducts = response.data;
            // Filter out the featured product if it exists
            const filteredProducts = allProducts.filter(product => product._id !== featuredProduct);
            const selectedProduct = allProducts.find(product => product._id === featuredProduct);
            setProducts(filteredProducts);
            setProductName(selectedProduct?.title);
        });
    }

    function fetchFeaturedProduct() {
        axios.get('/api/settings').then(result => {
            const featured = result.data[0] || {};
            console.log("Fetched product:", featured.product);
            console.log("Fetched price:", featured.price);

            setFeaturedProduct(featured.product || '');
            setPrice(featured.price || 0);

            setEditSettings(!featured.product);

            console.log({featuredProduct});
            console.log({price});
            console.log({editSettings});
            
        }).catch(error => {
            console.error('Error fetching settings:', error);
        }).finally(() => {
            fetchProducts(); // Fetch products after fetching featured product
        });
    }

    const id = "settings"

    async function saveSettings(ev) {
        ev.preventDefault();
        const data = {
            product: featuredProduct,
            price: Number(price) || 0, // Convert price to number, default to 0 if invalid
        };
        try {
            if (!editSettings) {
                await axios.put('/api/settings', data);
            } else {
                await axios.post('/api/settings', data);
            }
            fetchFeaturedProduct(); // Refresh featured product and products
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    return (
        <Layout>
            <h1>Тохиргоо</h1>
            <form onSubmit={saveSettings}>
                <label>Онцлох бүтээгдэхүүн</label>
                <div className="">
                    <select
                        onChange={ev => setFeaturedProduct(ev.target.value)}
                        value={featuredProduct}
                    >
                        <option value="">{productName}</option>
                        {products.length > 0 && products.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.title}
                            </option>
                        ))}
                    </select>
                </div>
                <label>Хүргэлтийн үнэ (₮)</label>
                <div className="">
                    <input 
                        type="number"  
                        placeholder={price}   
                        onChange={ev => setPrice(ev.target.value)}
                        value={price || ''} // Handle empty value case
                    /> 
                </div>
                <button 
                    type="submit" 
                    className="btn-primary py-1"
                >
                    Тохиргоог хадгалах
                </button>
            </form>
        </Layout>
    );
}
