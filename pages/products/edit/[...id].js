import Layout from '@/components/layout';
import ProductForm from '@/components/productForm';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get('/api/products?id=' + id)
      .then(res => setProductInfo(res.data));
  }, [id]);

  return (
    <Layout>
      <h1>Edit Products Page</h1>
      {productInfo ? <ProductForm {...productInfo} /> : null}
    </Layout>
  );
}
