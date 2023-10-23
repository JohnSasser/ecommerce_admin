import Layout from '@/components/layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DeleteProduct() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  // make the id of the selected product available globally to the function
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    } else
      axios.get('/api/products?id=' + id).then(res => {
        setProductInfo(res.data);
      });
  }, []);

  function backButton() {
    router.push('/products');
  }

  function deleteProduct() {
    axios
      .delete('/api/products?id=' + id)
      .then(res => {
        let delete_confirmed = res.data.acknowledged;
        if (delete_confirmed === true) {
          return router.push('/products');
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <Layout>
      <h1> Do you really want to delete the record? </h1>
      <br />
      <table className="basic">
        <thead>
          <tr>
            {productInfo ? (
              <tr className="product-link-buttons flex justify-between">
                <td>Title: {productInfo?.title}</td>
                <td>Description: {productInfo.description}</td>
                <td>Price: {productInfo.price}</td>
              </tr>
            ) : null}
          </tr>
        </thead>
      </table>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="delete-button">
          Yes
        </button>

        <button className="btn-default" onClick={backButton}>
          No
        </button>
      </div>
    </Layout>
  );
}
