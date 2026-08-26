import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import api from "../utils/ api";

interface Sale {
  id: number;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at: string;
}

function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales/");
      setSales(res.data.sales);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Sales History
      </h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="p-3">{sale.product}</td>
                <td className="p-3">{sale.quantity}</td>
                <td className="p-3">KES {sale.unit_price}</td>
                <td className="p-3 font-semibold">
                  KES {sale.total_amount}
                </td>
                <td className="p-3">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default SalesHistory;