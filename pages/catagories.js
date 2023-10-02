import Layout from '@/components/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import RiseLoader from 'react-spinners/RiseLoader';
import SweetAlert2 from 'react-sweetalert2';

export default function Catagories() {
  const [loading, setLoading] = useState(true);

  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState(undefined);

  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, Delete',
  });

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
      })
      .catch(err => console.error(err));
  }

  async function saveCategory(e) {
    e.preventDefault();
    console.log(properties);
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => {
        return {
          name: p.name,
          values: p.values.split(','),
        };
      }),
    };
    // console.log(editedCategory);
    if (editedCategory !== null) {
      // assigning the id from the edited state to the set of values from the inputs;
      data._id = editedCategory._id;
      try {
        await axios.put('/api/categories', data).then(res => {
          // console.log(res.data);
          if (res.status === 200) {
            clearEdits();
          }
        });
        getCategories();
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
            clearEdits();
          }
          getCategories();
        })
        .catch(err => console.error(err));
    }
  }

  function deleteCategory() {
    let data = editedCategory;
    // console.log(data);
    axios
      .delete('/api/categories', { data: data })
      .then(res => {
        console.log(res);
        if (res.status === 200 && res.data.deletedCount >= 1) {
          setEditedCategory('');
          setName('');
          setParentCategory('');
        }
        getCategories();
      })
      .catch(err => console.error(err));
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => {
        return {
          name: name,
          values: values.join(','),
        };
      })
    );
  }

  function clearEdits() {
    setEditedCategory(null);
    setName('');
    setParentCategory('');
    setProperties([]);
  }

  function handleClick(category) {
    setEditedCategory(category);
    let cat_name = category.name.toUpperCase();
    setSwalProps({
      show: true,
      title: 'Warning...',
      text: `Are you sure you would like to permanently Delete ${cat_name}?`,
    });
  }

  function addProperty() {
    // post new pr
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }

  // multiple inputs: input_state holds the state of the input
  // and it is reassigned to the property object attribute of name that was created
  // when the inputs were dynamically rendered;
  function handlePropertyNameChange(idx, property, input_state) {
    // console.log({ idx, property, input_state });
    setProperties(prev => {
      const properties = [...prev];
      properties[idx].name = input_state;
      return properties;
    });
  }

  function handlePropertyValuesChange(idx, property, input_state) {
    // console.log({ idx, property, input_state });
    setProperties(prev => {
      const properties = [...prev];
      properties[idx].values = input_state;
      return properties;
    });
  }

  function removeProperty(idx) {
    setProperties(prev => {
      const properties = [...prev].filter((property, property_index) => {
        return property_index !== idx;
      });
      console.log('properties: ', properties);
      return properties;
    });
  }

  return !loading ? (
    <Layout>
      <h1>Catagories Page</h1>

      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>

      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1 mb-2">
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
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, idx) => (
              <div key={idx} className="flex mt-1 gap-1">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={ev =>
                    handlePropertyNameChange(idx, property, ev.target.value)
                  }
                  placeholder="Name"
                />

                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={ev =>
                    handlePropertyValuesChange(idx, property, ev.target.value)
                  }
                  placeholder="Value/s (comma separated)"
                />

                <button
                  type="button"
                  onClick={() => removeProperty(idx)}
                  className="btn-default"
                >
                  remove
                </button>
              </div>
            ))}
        </div>
        {editedCategory && (
          <button
            type="button"
            onClick={() => clearEdits()}
            className="btn-default mr-2 h-12"
          >
            Cancel Edit
          </button>
        )}

        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>

      {!editedCategory && (
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
                    <button
                      onClick={() => handleClick(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                    <SweetAlert2
                      {...swalProps}
                      showCancelButton="true"
                      cancelButtonText="Cancel"
                      confirmButtonColor="#d55"
                      reverseButtons="true"
                      onConfirm={res => {
                        if (res.isConfirmed === true) {
                          deleteCategory();
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  ) : (
    <Layout>
      <div className="loader-box flex min-h-full items-center justify-center">
        <RiseLoader size={50} color="#7e9eff" />
      </div>
    </Layout>
  );
}
