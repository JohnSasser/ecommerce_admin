import axios from 'axios';
import { router } from 'next/router';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [imageLoader, setImageLoader] = useState(false);
  const [backToProducts, setBackToProducts] = useState(false);

  async function createProduct(e) {
    e.preventDefault();

    const data = { title, description, price, images };

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

  async function uploadImage(e) {
    setImageLoader(true);
    let files = e.target?.files;

    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);

      setImages(oldImages => {
        console.log('oldImages: ', oldImages);
        return [...oldImages, ...res.data.links];
      });
    }
    setImageLoader(false);
  }

  function imageOrder(images) {
    // console.log(images);
    setImages(images);
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
        {/* photo */}
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <label className="w-24 h-24 flex items-center justify-center text-gray-700 bg-gray-200 rounded-lg mb-2 cursor-pointer">
            {imageLoader == false ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                <div>Upload</div>
                <input type="file" className="hidden" onChange={uploadImage} />
              </>
            ) : (
              <div>
                <BeatLoader size={15} />
              </div>
            )}
          </label>
          <ReactSortable
            className="flex flex-wrap gap-1"
            list={images}
            setList={imageOrder}
          >
            {!!images?.length &&
              images.map(link => (
                <div className="h-24" key={link}>
                  <img src={link} alt="product image" className="rounded-lg" />
                </div>
              ))}
          </ReactSortable>
        </div>
        {/* product description */}
        <label>What is the description for the new product?</label>
        <textarea
          placeholder="description"
          value={description}
          type="text"
          onChange={e => setDescription(e.target.value)}
        />
        <label>What is the price(USD)?</label>
        <input
          placeholder="100"
          value={price}
          required
          type="number"
          onChange={e => setPrice(e.target.value)}
        />
        <button disabled={imageLoader} className="btn-primary">
          Save product
        </button>
      </form>
    );
}
