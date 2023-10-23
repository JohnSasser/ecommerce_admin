import Layout from '@/components/layout';
import axios from 'axios';
import RiseLoader from 'react-spinners/RiseLoader';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('/api/products')
      .then(res => {
        let data = res.data;
        console.log('products: ', products);
        // The localeCompare() method compares two strings in the current locale; sorting produces the new array.
        let sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setProducts(sortedData);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return loading ? (
    <Layout>
      <div className="loader-box flex min-h-full items-center justify-center">
        <RiseLoader size={50} color="#7e9eff" />
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className="pt-4 pb-4">
        <Link className="btn-primary" href={'/products/new'}>
          Add Product
        </Link>
      </div>
      <div className="container h-full w-full">
        <table className="basic">
          <thead>
            <tr className="max-w-sm">
              <td className="title">Product Name</td>
              <td className="title">Product Images</td>
              <td className="title">Product Management</td>
            </tr>
          </thead>
          <tbody className="">
            {products.map((product, idx) => (
              <tr className="border-b-2" key={product._id}>
                <td className="text-center">{product.title}</td>
                <td className="flex justify-evenly flex-wrap">
                  {product.images.map(x => (
                    <img
                      className="p-2 max-h-40"
                      key={`${x}_${idx}`}
                      src={x}
                      alt="product image"
                    />
                  ))}
                </td>
                <td className="product-link-buttons">
                  <Link href={'/products/edit/' + product._id}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                    Edit
                  </Link>
                  <Link
                  className='delete-button'
                    href={'products/delete/' + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
