import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/ DashboardLayout";
import api from "../utils/ api";

interface History {
  id: number;
  product_name: string;
  quantity: number;
  transaction_type: string;
  created_at: string;
}

function StockHistory() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/stock/stock/history");
      setHistory(res.data.history);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Stock History
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.product_name}</td>

                <td className="p-4">{item.quantity}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      item.transaction_type === "stock_in"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.transaction_type}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default StockHistory;