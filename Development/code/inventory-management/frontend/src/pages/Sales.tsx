import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/ DashboardLayout";
import api from "../utils/ api";

interface Product {
  id: number;
  name: string;
  selling_price: number;
  quantity: number;
}

interface Sale {
  id: number;
  product: string;
  quantity: number;
  selling_price: number;
  total_amount: number;
  created_at: string;
}

interface SalesSummary {
  total_revenue: number;
  total_products_sold: number;
  total_transactions: number;
  sales: Sale[];
}

type SalesPeriod = "today" | "week" | "month" | "custom";

function Sales() {

  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");



  const emptySalesSummary: SalesSummary = {
    total_revenue: 0,
    total_products_sold: 0,
    total_transactions: 0,
    sales: [],
  };

  const [todaySales, setTodaySales] =
    useState<SalesSummary>(emptySalesSummary);

  const [weekSales, setWeekSales] =
    useState<SalesSummary>(emptySalesSummary);

  const [monthSales, setMonthSales] =
    useState<SalesSummary>(emptySalesSummary);

  const [customSales, setCustomSales] =
    useState<SalesSummary>(emptySalesSummary);



  const [activePeriod, setActivePeriod] =
    useState<SalesPeriod>("today");



  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  useEffect(() => {
    fetchProducts();
    fetchTodaySales();
    fetchWeekSales();
    fetchMonthSales();
  }, []);



  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");

      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };



  const fetchTodaySales = async () => {
    try {
      const res = await api.get("/sales/today");

      setTodaySales(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch today's sales:",
        err
      );
    }
  };



  const fetchWeekSales = async () => {
    try {
      const res = await api.get("/sales/week");

      setWeekSales(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch weekly sales:",
        err
      );
    }
  };

  const fetchMonthSales = async () => {
    try {
      const res = await api.get("/sales/month");

      setMonthSales(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch monthly sales:",
        err
      );
    }
  };



  const fetchCustomSales = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      const res = await api.get(
        `/sales/range?start_date=${startDate}&end_date=${endDate}`
      );

      setCustomSales(res.data);
      setActivePeriod("custom");
    } catch (err: any) {
      console.error(
        "Failed to fetch custom sales:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to fetch sales."
      );
    }
  };



  const getActiveSales = (): SalesSummary => {
    if (activePeriod === "today") {
      return todaySales;
    }

    if (activePeriod === "week") {
      return weekSales;
    }

    if (activePeriod === "month") {
      return monthSales;
    }

    return customSales;
  };

  const activeSales = getActiveSales();



  const selectedProduct = products.find(
    (product) =>
      product.id === Number(productId)
  );



  const totalSale = selectedProduct
    ? selectedProduct.selling_price *
      Number(quantity || 0)
    : 0;



  const handleSale = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!productId || !quantity) {
      alert("Please select a product and quantity.");
      return;
    }

    try {
      const res = await api.post(
        "/sales/",
        {
          product_id: Number(productId),
          quantity: Number(quantity),
        }
      );

      alert(res.data.message);

      setProductId("");
      setQuantity("");

      fetchProducts();

      fetchTodaySales();
      fetchWeekSales();
      fetchMonthSales();

      // Refresh custom range if one is active
      if (
        activePeriod === "custom" &&
        startDate &&
        endDate
      ) {
        fetchCustomSales();
      }
    } catch (err: any) {
      console.error("Sale failed:", err);

      alert(
        err.response?.data?.message ||
          "Sale failed"
      );
    }
  };



  const periodTitle =
    activePeriod === "today"
      ? "Today's Sales"
      : activePeriod === "week"
      ? "This Week's Sales"
      : activePeriod === "month"
      ? "This Month's Sales"
      : `Sales from ${startDate} to ${endDate}`;


  return (
    <DashboardLayout>



      <h1 className="text-3xl font-bold mb-6">
        Sales
      </h1>


      <div className="flex flex-wrap gap-3 mb-8">


        <button
          onClick={() =>
            setActivePeriod("today")
          }
          className={`px-5 py-2 rounded-lg font-medium ${
            activePeriod === "today"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Daily
        </button>


        <button
          onClick={() =>
            setActivePeriod("week")
          }
          className={`px-5 py-2 rounded-lg font-medium ${
            activePeriod === "week"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Weekly
        </button>


        <button
          onClick={() =>
            setActivePeriod("month")
          }
          className={`px-5 py-2 rounded-lg font-medium ${
            activePeriod === "month"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Monthly
        </button>

      </div>



      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          Sales Period
        </h2>

        <div className="border-t pt-5">

          <h3 className="font-semibold mb-3">
            Custom Date Range
          </h3>

          <div className="flex flex-col md:flex-row gap-4">


            <div className="flex-1">

              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />

            </div>


            <div className="flex-1">

              <label className="block text-sm font-medium mb-2">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>


          <button
            onClick={fetchCustomSales}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Apply Date Range
          </button>

        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Revenue */}

        <div className="bg-white shadow rounded-xl p-5">

          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-2xl font-bold mt-2">
            KSh{" "}
            {activeSales.total_revenue.toLocaleString()}
          </h2>

        </div>


        <div className="bg-white shadow rounded-xl p-5">

          <p className="text-gray-500">
            Products Sold
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {activeSales.total_products_sold}
          </h2>

        </div>


        <div className="bg-white shadow rounded-xl p-5">

          <p className="text-gray-500">
            Total Transactions
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {activeSales.total_transactions}
          </h2>

        </div>

      </div>



      <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-8">

        <h2 className="text-xl font-bold mb-5">
          Record Sale
        </h2>

        <form onSubmit={handleSale}>


          <div className="mb-4">

            <label className="block mb-2">
              Product
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={productId}
              onChange={(e) =>
                setProductId(e.target.value)
              }
              required
            >

              <option value="">
                Select Product
              </option>

              {products.map((product) => (

                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} (
                  {product.quantity} left)
                </option>

              ))}

            </select>

          </div>


          <div className="mb-4">

            <label className="block mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              className="w-full border rounded-lg p-3"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              required
            />

          </div>


          {selectedProduct && (

            <div className="mb-4">

              <p>
                Price per item:{" "}

                <span className="font-semibold">
                  KSh{" "}
                  {selectedProduct.selling_price.toLocaleString()}
                </span>
              </p>

            </div>

          )}


          <div className="mb-6 bg-gray-100 p-4 rounded-lg">

            <p className="text-lg">

              Current Sale Total:{" "}

              <span className="font-bold">
                KSh{" "}
                {totalSale.toLocaleString()}
              </span>

            </p>

          </div>


          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Record Sale
          </button>

        </form>

      </div>

      

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          {periodTitle}
        </h2>

        {activeSales.sales.length === 0 ? (

          <p className="text-gray-500">
            No sales found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b">

                <tr>

                  <th className="text-left p-3">
                    Product
                  </th>

                  <th className="text-left p-3">
                    Quantity
                  </th>

                  <th className="text-left p-3">
                    Price
                  </th>

                  <th className="text-left p-3">
                    Total
                  </th>

                  <th className="text-left p-3">
                    Date & Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {activeSales.sales.map((sale) => (

                  <tr
                    key={sale.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {sale.product}
                    </td>

                    <td className="p-3">
                      {sale.quantity}
                    </td>

                    <td className="p-3">
                      KSh{" "}
                      {sale.selling_price.toLocaleString()}
                    </td>

                    <td className="p-3 font-semibold">
                      KSh{" "}
                      {sale.total_amount.toLocaleString()}
                    </td>

                    <td className="p-3">
                      {new Date(
                        sale.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Sales;