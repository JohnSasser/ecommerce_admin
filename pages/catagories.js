import Layout from '@/components/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Catagories() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then(res => {
      let data = res.data;
      let sortedData = data.sort((a, b) => a.name.localCompare(b.name));
      console.log('data: ', data);
      setCategories(sortedData);
      setLoading(false);
    });
  }, []);

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name };
    // post category to db
    try {
      await axios.post('/api/categories', data).then(res => {
        res.status === 200 && setName('');
      });
    } catch (err) {
      console.error(err);
    }
  }
  console.log(categories);
  return (
    <Layout>
      <h1>Catagories Page</h1>

      <label>Name Category Name</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={'Category Name'}
        />
        <button type="submit" className="btn-default">
          Save
        </button>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Names</td>
          </tr>
        </thead>
        <tbody>
          {categories &&
            categories.map(x => (
              <tr>
                <td>{x.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
