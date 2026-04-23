import { describe, it, expect } from 'vitest';
import { calculateSellerRevenue, getTopProducts, get7DayChartData } from './analytics';
import { Order } from './types';

describe('Analytics Utility', () => {
  const mockOrders: Order[] = [
    {
      id: 1,
      user: 1,
      total_price: "300.00",
      status: "COMPLETED",
      payment_status: "SUCCESS",
      created_at: new Date().toISOString(),
      items: [
        { id: 1, product: 1, product_name: "Alpha", quantity: 2, price: "100.00", status: "COMPLETED" },
        { id: 2, product: 2, product_name: "Beta", quantity: 1, price: "100.00", status: "COMPLETED" }
      ]
    },
    {
      id: 2,
      user: 2,
      total_price: "200.00",
      status: "PENDING",
      payment_status: "SUCCESS",
      created_at: new Date().toISOString(),
      items: [
        { id: 3, product: 1, product_name: "Alpha", quantity: 2, price: "100.00", status: "PENDING" }
      ]
    },
    {
      id: 3,
      user: 3,
      total_price: "500.00",
      status: "PENDING",
      payment_status: "PENDING", // Should be ignored in revenue
      created_at: new Date().toISOString(),
      items: [
        { id: 4, product: 3, product_name: "Gamma", quantity: 1, price: "500.00", status: "PENDING" }
      ]
    }
  ];

  it('should calculate seller revenue correctly', () => {
    const revenue = calculateSellerRevenue(mockOrders[0]);
    expect(revenue).toBe(300);
    
    const unpaidRevenue = calculateSellerRevenue(mockOrders[2]);
    expect(unpaidRevenue).toBe(0);
  });

  it('should aggregate top products correctly', () => {
    const top = getTopProducts(mockOrders);
    
    // Alpha has 4 units sold across 2 successful orders (2*100 + 2*100 = 400)
    // Beta has 1 unit sold (1*100 = 100)
    // Gamma is PENDING payment so revenue is 0
    
    expect(top[0].name).toBe("Alpha");
    expect(top[0].quantity).toBe(4);
    expect(top[0].revenue).toBe(400);
    
    expect(top[1].name).toBe("Beta");
    expect(top[1].quantity).toBe(1);
    expect(top[1].revenue).toBe(100);
    
    expect(top.length).toBe(2);
  });

  it('should generate 7-day chart data correctly', () => {
    const chart = get7DayChartData(mockOrders);
    expect(chart.length).toBe(7);
    
    // The last element in the array is "Today"
    const today = chart[6];
    expect(today.revenue).toBe(500); // 300 from Order 1 + 200 from Order 2
  });
});
