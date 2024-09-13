import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

const useFetchProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const productRef = ref(db, `products/${productId}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          setProduct(snapshot.val());
        } else {
          setProduct(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export default useFetchProduct;
