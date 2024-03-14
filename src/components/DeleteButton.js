import React, {useState} from "react";
import {removeProduct} from "../services/apiService";
import ConfirmModal from "./ConfirmModal";

const DeleteButton = ({ productId, onProductDeleted}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(' ');

    const handleDelete = async () => {
        try {
            setLoading(true);
            console.log('Deleting product with id: ${productId}');
            const data = await removeProduct(productId);
            setLoading(false);
            console.log(data);
            if (onProductDeleted) {
                onProductDeleted(data);
            }
        }
        catch (err) {
            console.error('failed to delete product', err);
            setLoading(false);

        } finally {
            setShowConfirmModal(false); // close the modal
        }
    };
    return (
        <>
            <button className="btn btn-danger" onClick={() => setShowConfirmModal(true)} disabled ={loading}>
            {loading ? 'Deleteing...' : 'Delete Product'} 
            </button>
            {error && <p>{error}</p>}
            <ConfirmModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
            >
                Are you sure you want to delete this product?
            </ConfirmModal>

        </>
    );
}

export default DeleteButton;