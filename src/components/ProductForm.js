import React, {useState, useEffect} from "react";
import { addProduct, editProduct, getProductDetails } from "../services/apiService";
import { useProductsContext } from "../context/ProductsContext";
import { useNavigate, useParams } from "react-router-dom";

const ProductForm = () => {
    // Access route parameters
    const {productId} = useParams();
    const navigate = useNavigate();

    const {saveProduct} = useProductsContext();
    const [product, setProduct] = useState(
        { 
            title: "", 
            description: "", 
            price: "", 
            brand: "", 
            category: "", 
            
        });

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchProductDetails = async () => {
                setLoading(true);
                try {
                    const data = await getProductDetails(productId);
                    setProduct(data);
                    setError(null);
                } catch (error) {
                    console.error("Error fetching product details", error);
                    setLoading(false);
                    setError('Failed to fetch product details');                 
                } finally {
                    setLoading(false);
                }
            };
            if (productId) {
                fetchProductDetails();
            }
        }, [productId]);
        
        const handleChange = (e) => {
            const { name, value } = e.target;
            setProduct((prevProduct) => ({
                ...prevProduct,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            const apiCall = productId ? editProduct(productId, product) : addProduct(product);

            apiCall.then(responce => {
                setLoading(false);
                saveProduct(responce.data);
                // Navigate Back
                navigate(-1);
            }).catch(error => {
                console.error('Error saving product', error);
                setError('Failed to save product');
                setLoading(false);
            });
        };

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error:1 {error}</div>;

        return (
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input type="text" className="form-control" id="title" name="title" value={product.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" name="description" 
                    rows= "3" value={product.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price:</label>
                    <input type="number" className="form-control" id="price" name="price" 
                    value={product.price} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="brand" className="form-label">Brand:</label>
                    <input type="text" className="form-control" id="brand" name="brand"
                    value={product.brand} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category:</label>
                    <input type="text" className="form-control" id="category" name="category"
                    value={product.category} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Save Product</button>
            </form>
        );
};

export default ProductForm;

