import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/ DashboardLayout";

import api from "../utils/ api";


// Dashboard Statistics

interface DashboardData {
  total_products: number;
  total_categories: number;
  total_suppliers: number;
  low_stock: number;
}


// Today's Sales

interface TodaySales {
  total_revenue: number;
  total_products_sold: number;
  total_transactions: number;
}


// Profit Tracking

interface ProfitData {
  total_revenue: number;
  total_cost: number;
  total_profit: number;
}


// Best Selling Product

interface BestSellingProduct {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
}


function Dashboard() {

  // ==========================================
  // Dashboard State
  // ==========================================

  const [dashboard, setDashboard] = useState<DashboardData>({
    total_products: 0,
    total_categories: 0,
    total_suppliers: 0,
    low_stock: 0,
  });


  // ==========================================
  // Today's Sales State
  // ==========================================

  const [todaySales, setTodaySales] = useState<TodaySales>({
    total_revenue: 0,
    total_products_sold: 0,
    total_transactions: 0,
  });


  // ==========================================
  // Profit State
  // ==========================================

  const [profit, setProfit] = useState<ProfitData>({
    total_revenue: 0,
    total_cost: 0,
    total_profit: 0,
  });


  // ==========================================
  // Best Selling Products State
  // ==========================================

  const [bestSelling, setBestSelling] = useState<
    BestSellingProduct[]
  >([]);




  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadDashboard();
  }, []);


  const loadDashboard = async () => {

    try {



      const dashboardResponse =
        await api.get("/dashboard/");




      const salesResponse =
        await api.get("/sales/today");




      const profitResponse =
        await api.get("/sales/profit");




      const bestSellingResponse =
        await api.get("/sales/best-selling");




      setDashboard(dashboardResponse.data);



      setTodaySales({
        total_revenue:
          salesResponse.data.total_revenue || 0,

        total_products_sold:
          salesResponse.data.total_products_sold || 0,

        total_transactions:
          salesResponse.data.total_transactions || 0,
      });




      setProfit({
        total_revenue:
          profitResponse.data.total_revenue || 0,

        total_cost:
          profitResponse.data.total_cost || 0,

        total_profit:
          profitResponse.data.total_profit || 0,
      });




      setBestSelling(
        bestSellingResponse.data.products || []
      );


    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };




  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex items-center justify-center h-full">

          <h2 className="text-2xl font-bold">
            Loading...
          </h2>

        </div>

      </DashboardLayout>

    );

  }




  return (

    <DashboardLayout>



      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to the Inventory Management System
        </p>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Total Products
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-4">
            {dashboard.total_products}
          </p>

        </div>




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Total Categories
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-4">
            {dashboard.total_categories}
          </p>

        </div>




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Total Suppliers
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-4">
            {dashboard.total_suppliers}
          </p>

        </div>




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Low Stock Products
          </h2>

          <p className="text-4xl font-bold text-red-600 mt-4">
            {dashboard.low_stock}
          </p>

        </div>




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Today's Revenue
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-4">
            KSh{" "}
            {todaySales.total_revenue.toLocaleString()}
 </p>

        </div>



<div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Products Sold Today
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-4">
            {todaySales.total_products_sold}
          </p>

        </div>



        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Transactions Today
          </h2>

          <p className="text-4xl font-bold text-purple-600 mt-4">
            {todaySales.total_transactions}
          </p>

        </div>




        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-gray-500 text-sm font-medium">
            Total Profit
          </h2>

          <p className="text-3xl font-bold text-emerald-600 mt-4">
            KSh{" "}
            {profit.total_profit.toLocaleString()}
          </p>

        </div>

</div>



      <div className="mt-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Profit Tracking
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">




          <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-gray-500 text-sm font-medium">
              Total Revenue
            </h3>

            <p className="text-2xl font-bold text-blue-600 mt-3">
              KSh{" "}
              {profit.total_revenue.toLocaleString()}
            </p>

          </div>




          <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-gray-500 text-sm font-medium">
              Total Cost
            </h3>

            <p className="text-2xl font-bold text-red-500 mt-3">
              KSh{" "}
              {profit.total_cost.toLocaleString()}
            </p>

          </div>



          <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-gray-500 text-sm font-medium">
              Net Profit
            </h3>

            <p className="text-2xl font-bold text-green-600 mt-3">
              KSh{" "}
              {profit.total_profit.toLocaleString()}
            </p>

          </div>

        </div>

      </div>


      

      <div className="mt-10 bg-white rounded-xl shadow-md">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-semibold text-gray-800">
            Best-Selling Products
          </h2>

          <p className="text-gray-500 mt-1">
            Products ranked by the number of units sold
          </p>

        </div>


        {bestSelling.length === 0 ? (

          <div className="p-8 text-center">

            <p className="text-gray-500">
              No sales recorded yet.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    #
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Units Sold
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Revenue
                  </th>

                </tr>

              </thead>


              <tbody>

                {bestSelling.map(
                  (product, index) => (

                    <tr
                      key={product.product_id}
                      className="border-t hover:bg-gray-50"
                    >


                      <td className="px-6 py-4 font-bold text-gray-700">
                        {index + 1}
                      </td>



                      <td className="px-6 py-4 font-medium text-gray-800">
                        {product.product_name}
                      </td>



                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {product.units_sold}
                      </td>



                      <td className="px-6 py-4 font-semibold text-green-600">
                        KSh{" "}
                        {product.revenue.toLocaleString()}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>




      <div className="mt-10 bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Recent Activity
        </h2>

        <p className="text-gray-500">
          Your recent stock and sales activity will appear here.
        </p>

      </div>

    </DashboardLayout>

  );

}


export default Dashboard;