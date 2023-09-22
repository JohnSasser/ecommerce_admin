import { Product } from '@/models/product_model';
// ./lib/mongoose.js has the imports mongoose and instantiates it on the mongo cluster used for user creds;
import { mongooseConnect } from '@/lib/mongoose';

export default async function handler(req, res) {
  // mongoose Instance connection that links to the atlas cluster in the lib folder;
  await mongooseConnect();

  const { method } = req;

  if (method === 'POST') {
    // create a new product record in the db.
    let { title, description, price } = req.body;
    const productDoc = await Product.create({
      title: title,
      description: description,
      price: price,
    });
    res.json(productDoc);
  }

  if (method === 'GET') {
    // if the get request has an associated product ID, find the one record and send it back to the front;
    if (req.query.id) {
      let { id } = req.query;
      // console.log('id: ', id);
      res.json(await Product.findOne({ _id: id }));
    }
    // return all products for the product page initial load request
    res.json(await Product.find());
  }

  if (method === 'PUT') {
    // deconstruct properties passed in the api post;
    let { title, description, price, _id } = req.body;
    // updateOne record in the db by the passed _id property;
    await Product.updateOne({ _id }, { title, description, price });
    // return ok status
    res.json(200);
  }

  if (method === 'DELETE') {
    let { id } = req.query;
    res.json(await Product.deleteOne({ _id: id }));
    res.json(200);
  }
}
