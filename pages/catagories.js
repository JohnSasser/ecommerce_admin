import Layout from '@/components/layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import RiseLoader from 'react-spinners/RiseLoader';
import SweetAlert2 from 'react-sweetalert2';

export default function Catagories() {
  const [loading, setLoading] = useState(true);

  const [editedCategory, setEditedCategory] = useState(null);
  const [deleteSelectionCategory, setDeleteSelectionCategory] = useState({});
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

    const category_object = {
      name,
      parentCategory,
      properties: properties.map(p => {
        if (p.name && p.values) {
          return {
            name: p.name,
            values: p.values.split(','),
          };
        } else return;
      }),
    };

    // put or post conditional;
    if (editedCategory !== null) {
      category_object._id = editedCategory._id;
      try {
        await axios.put('/api/categories', category_object).then(res => {
          if (res.status === 200) {
            clearEdits();
          }
        });
        getCategories();
      } catch (err) {
        console.log(err);
      }
    } else {
      await axios
        .post('/api/categories', category_object)
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
    let data = deleteSelectionCategory;

    axios
      .delete('/api/categories', { data: data })
      .then(res => {
        console.log(res);
        if (res.status === 200 && res.data.deletedCount >= 1) {
          setEditedCategory('');
          setName('');
          setParentCategory('');
          setDeleteSelectionCategory('');
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
    setEditedCategory('');
    setName('');
    setParentCategory('');
    setProperties([]);
  }

  function handleDeleteButtonClick(category) {
    setSwalProps({
      show: true,
      title: 'Warning...',
      text: `Are you sure you would like to permanently Delete ${category.name}?`,
    });

    setDeleteSelectionCategory(category);
  }

  function closeSwalPopover() {
    setDeleteSelectionCategory('');
    setSwalProps({
      show: false,
    });
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }

  // multiple inputs: input_state holds the state of the input
  // and it is reassigned to the property object attribute of name that was created
  // when the inputs were dynamically rendered;
  function handlePropertyNameChange(idx, property, input_state) {
    console.log({ idx, property, input_state });
    setProperties(prev => {
      const properties = [...prev];

      properties[idx].name = input_state;
      return properties;
    });
  }

  function handlePropertyValuesChange(idx, property, input_state) {
    console.log({ idx, property, input_state });
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

      return properties;
    });
  }

  return !loading ? (
    <Layout>
      <h1>Catagories Page</h1>

      <label className="label-title">
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>

      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1 mb-2">
          <input
            className="mb-0 m-2"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={'Category Name'}
          />
          <select
            className="mb-0 m-2"
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
          <label className="label-title block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm m-2"
            onClick={addProperty}
          >
            add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, idx) => (
              <div key={idx} className="flex mt-1 gap-1">
                <input
                  type="text"
                  className="mb-0  m-2"
                  value={property.name}
                  onChange={ev =>
                    handlePropertyNameChange(idx, property, ev.target.value)
                  }
                  placeholder="Name"
                />

                <input
                  type="text"
                  className="mb-0 m-2"
                  value={property.values}
                  onChange={ev =>
                    handlePropertyValuesChange(idx, property, ev.target.value)
                  }
                  placeholder="Value/s (comma separated)"
                />

                <button
                  type="button"
                  onClick={() => removeProperty(idx)}
                  className="delete-button mx-4"
                >
                  remove
                </button>
              </div>
            ))}
        </div>

        <button type="submit" className="btn-primary">
          Save
        </button>

        {editedCategory && (
          <button
            type="button"
            onClick={() => clearEdits()}
            className="btn-default ml-2 h-12"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td className="title">Category Name</td>
              <td className="title">Parent Category</td>
              <td className="title">Category Management</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map(category => (
                <tr className="border-b-2 text-center" key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td className="flex justify-center">
                    <div className="m-2">
                      <button
                        key={`edit${category._id}`}
                        onClick={ev => editCategory(category, ev.target.value)}
                        className="btn-default"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="m-2 flex justify-around">
                      <button
                        key={`delete${category._id}`}
                        onClick={ev => handleDeleteButtonClick(category)}
                        className="delete-button"
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
                      </button>
                      <SweetAlert2
                        {...swalProps}
                        showCancelButton="true"
                        cancelButtonText="Cancel"
                        confirmButtonColor="#d55"
                        reverseButtons="true"
                        onResolve={res => {
                          if (res.isConfirmed === true) {
                            deleteCategory(deleteSelectionCategory);
                          } else {
                            closeSwalPopover();
                          }
                        }}
                      />
                    </div>
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
