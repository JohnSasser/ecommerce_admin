// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/category_model';

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
    let { name, parentCategory, properties } = req.body;
    console.log('post req.body', req.body);
    const categoryDoc = await Category.create({
      name: name,
      parent: parentCategory === '' ? undefined : parentCategory,
      properties: properties === null ? undefined : properties,
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    let { name, parentCategory, properties, _id } = req.body;
    console.log('put req.body', req.body);

    const updatedCategory = await Category.updateOne(
      { _id },
      {
        name: name,
        parentCategory: parentCategory === '' ? undefined : parentCategory,
        properties: properties === null ? undefined : properties,
      }
    );
    res.json(updatedCategory);
  }

  if (method === 'DELETE') {
    let { _id } = req.body;
    res.json(await Category.deleteOne({ _id }));
  }
}
