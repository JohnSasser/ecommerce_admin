// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/category_model';

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === 'POST') {
    let { name } = req.body;

    const categoryDoc = await Category.create({
      name: name,
    });
    res.json(categoryDoc);
  }

  if (method === 'GET') {
    res.json(await Category.find());
  }
}
