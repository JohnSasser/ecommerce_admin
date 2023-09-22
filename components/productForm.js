import axios from 'axios';
import { router } from 'next/router';
import { useState } from 'react';

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [backToProducts, setBackToProducts] = useState(false);

  async function createProduct(e) {
    e.preventDefault();

    const data = { title, description, price };
    console.log({ _id });

    if (_id) {
      //update existing record
      await axios
        .put(`/api/products/`, { ...data, _id })
        .then(res =>
          res.status === 200
            ? setBackToProducts(true)
            : alert('error updating record')
        );
    } else {
      // create product
      await axios
        .post('/api/products', data)
        .then(res =>
          res.status === 200
            ? setBackToProducts(true)
            : alert('error updating record')
        )
        .catch(err => {
          console.error(err);
        });
    }
  }

  if (backToProducts) {
    router.push('/products');
  } else
    return (
      <form onSubmit={createProduct}>
        <label>Name of the new product</label>
        <input
          type="text"
          placeholder="product name"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label>What is the description for the new product</label>
        <textarea
          placeholder="description"
          value={description}
          type="text"
          onChange={e => setDescription(e.target.value)}
        />
        <label>How is the item priced</label>
        <input
          placeholder="100"
          value={price}
          required
          type="number"
          onChange={e => setPrice(e.target.value)}
        />
        <button className="btn-primary">Save product</button>
      </form>
    );
}
