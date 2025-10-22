"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { productApi } from "@/lib/api";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const products = await productApi.adminListProducts();

        // Initialize stats with real data where available
        const realStats: DashboardStats = {
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: 0, // TODO: Fetch from orders API when available
          totalRevenue: 0, // TODO: Fetch from orders API when available
          totalUsers: 0, // TODO: Fetch from users API when available
          recentOrders: [], // TODO: Fetch from orders API when available
          lowStockProducts: [], // TODO: Calculate from products with stock data when available
        };

        setStats(realStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set empty stats on error
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalUsers: 0,
          recentOrders: [],
          lowStockProducts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      change: null, // TODO: Calculate percentage change when historical data available
      changeType: null as const,
      href: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: null, // TODO: Calculate percentage change when historical data available
      changeType: null as const,
      href: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: null, // TODO: Calculate percentage change when historical data available
      changeType: null as const,
      href: "/admin/analytics",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: null, // TODO: Calculate percentage change when historical data available
      changeType: null as const,
      href: "/admin/users",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && stat.changeType && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    {stat.changeType === "positive" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/orders">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.amount}</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent orders available</p>
                    <p className="text-sm">
                      Orders will appear here when available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Low Stock Alert</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products">
                    <Package className="h-4 w-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.lowStockProducts.length > 0 ? (
                  stats.lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Product ID: {product.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600 font-medium">
                          {product.stock} left
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Restock
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No low stock alerts</p>
                    <p className="text-sm">All products are well stocked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/admin/products/new">
                  <Plus className="h-6 w-6 mb-2" />
                  Add New Product
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/admin/orders">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  View Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link href="/admin/analytics">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
