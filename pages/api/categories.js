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
    let { name, parentCategory } = req.body;

    const categoryDoc = await Category.create({
      name: name,
      parent: parentCategory,
    });
    console.log(`created categoryDoc in api route ${categoryDoc}`);
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    let { name, parentCategory, _id } = req.body;
    const updatedCategory = await Category.updateOne(
      { _id },
      { name, parentCategory }
    );
    res.json(updatedCategory);
  }
}
