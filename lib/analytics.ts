import { Order } from "./types";

export interface ChartDataPoint {
  name: string;
  revenue: number;
  fullDate: string;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

/**
 * Calculates the revenue belonging to the seller for a specific order.
 * Items not belonging to the seller should be excluded in a real multi-vendor scenario,
 * but for the dashboard view we assume the orders list already contains relevant items.
 */
export const calculateSellerRevenue = (order: Order): number => {
  if (order.payment_status !== "SUCCESS") return 0;
  return order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
};

/**
 * Processes a list of orders into a 7-day revenue chart data structure.
 */
export const get7DayChartData = (orders: Order[]): ChartDataPoint[] => {
  const days: ChartDataPoint[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayRevenue = orders
      .filter(o => o.created_at.split('T')[0] === dateStr)
      .reduce((sum, o) => sum + calculateSellerRevenue(o), 0);
      
    days.push({
      name: dayName,
      revenue: dayRevenue,
      fullDate: dateStr
    });
  }
  return days;
};

/**
 * Aggregates order items to find the top performing products by revenue.
 */
export const getTopProducts = (orders: Order[]): TopProduct[] => {
  const productMap: Record<string, TopProduct> = {};
  
  orders.forEach(order => {
    if (order.payment_status === "SUCCESS") {
      order.items.forEach(item => {
        const key = item.product_name;
        if (!productMap[key]) {
          productMap[key] = { name: key, quantity: 0, revenue: 0 };
        }
        productMap[key].quantity += item.quantity;
        productMap[key].revenue += Number(item.price) * item.quantity;
      });
    }
  });
  
  return Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);
};
