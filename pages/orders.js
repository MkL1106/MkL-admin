/* eslint-disable react/jsx-key */
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage(){
    const [orders,setOrders] = useState([]);
    useEffect(() => {
        axios.get('api/orders').then(response => {
            setOrders(response.data);
        })
    }, []);
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => ( 
                        <tr style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td>
                                Утасны дугаар : {order.phoneNumber}<br/> 
                                Дүүрэг : {order.duureg} <br/>  Хороо : {order.horoo}<br/>  
                                Хотхон : {order.hothon}<br/> 
                                Байр : {order.bair} <br/> Орц : {order.orts} <br/> 
                                Давхар : {order.floor} <br/>  
                                Тоот : {order.toot} <br/> Орцны код : {order.code}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                    {l.price_data?.product_data.name} x {l.quantity}<br/>
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}