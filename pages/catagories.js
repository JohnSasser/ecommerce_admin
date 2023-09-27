import Layout from '@/components/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import RiseLoader from 'react-spinners/RiseLoader';

export default function Catagories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState(undefined);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  function getCategories() {
    axios
      .get('/api/categories')
      .then(res => {
        let data = res.data;
        // The localeCompare() method compares two strings in the current locale; sorting produces the new array.
        let sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedData);
        setLoading(false);
        setEditedCategory(null);
      })
      .catch(err => console.error(err));
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      // assigning the id from the edited state to the set of values from the inputs;
      data._id = editedCategory._id;
      try {
        await axios.put('/api/categories', data).then(res => {
          console.log(res.data);
          if (res.status === 200) {
            setName('');
            setParentCategory(null);
            getCategories();
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      // post category to db

      console.log('post data: ', data);
      await axios
        .post('/api/categories', data)
        .then(res => {
          if (res.status === 200) {
            setName('');
            getCategories();
          }
        })
        .catch(err => console.error(err));
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  function deleteCategory(_id) {}

  return !loading ? (
    <Layout>
      <h1>Catagories Page</h1>

      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>

      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={'Category Name'}
        />
        <select
          className="mb-0"
          name="Parent Category"
          value={parentCategory}
          onChange={e => setParentCategory(e.target.value)}
        >
          <option value="null">No Parent Category</option>
          {categories &&
            categories.map(x => (
              <option key={x._id} value={x._id}>
                {x.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-default">
          Save
        </button>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Names</td>
            <td>Parent Category</td>
            <td>Category Management</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default"
                  >
                    Edit
                  </button>
                  <button className="btn-red">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  ) : (
    <Layout>
      <div className="loader-box flex min-h-full items-center justify-center">
        <RiseLoader size={50} color="#7e9eff" />
      </div>
    </Layout>
  );
}

// {categories &&
//   categories.map(category => (
//     <tr key={category._id}>
//       <td>{category.name}</td>
//       <td>
//         {category.parent &&
//           categories.map(x => {
//             if (category.parent === x._id) return x.name;
//           })}
//       </td>
//       <td className="flex">
//         <button
//           onClick={() => editCategory(category)}
//           className="btn-default"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => deleteCategory(category._id)}
//           className="btn-red"
//         >
//           Delete
//         </button>
//       </td>
//     </tr>
//   ))}

// const [editedCategory, setEditedCategory] = useState('')

// function editCategory(category) {
//   console.log('category: ', category);
//   setEditedCategory(category);
//   setName(editedCategory.name);
//   if (editedCategory.parent) {
//     categories.map(x => {
//       if (category.parent === x._id) setParentCategory(x);
//     });
//   }
//   console.log(parentCategory);
// }
