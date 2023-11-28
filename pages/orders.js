import Layout from '@/components/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then(res => {
      let data = res.data;
      setOrders(data);
    });
  }, []);

  return (
    <Layout>
      <table className="basic" style={{ fontSize: '.75em' }}>
        <thead>
          <tr>
            <th>Date of Order</th>
            <th>Payment Confirmed</th>
            <th>Recipient Details</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map(order => (
              <tr
                key={order._id}
                style={{
                  borderBottom: '1px solid #ccc',
                }}
              >
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? 'text-green-600 text-center' : 'text-red-600 text-center'}>
                  {order.paid ? 'Yes' : 'No'}
                </td>
                <td>
                  <h4>{order.name} </h4>
                  {order.email} <br />
                  {order.street} {order.city} {order.zip}
                </td>
                <td>
                  {order.line_items.map(x => (
                    <tr>
                      <td>{x.price_data?.product_data.name}</td>
                      {/* <td style={{ fontWeight: '400' }}>
                        quantity: {x.quantity}
                      </td> */}
                    </tr>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
