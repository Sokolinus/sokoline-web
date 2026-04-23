"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchShopOrders, completeOrder } from "@/lib/api";
import { Order } from "@/lib/types";
import { Package, Clock, CheckCircle2, XCircle, DollarSign, Check } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();

  const getOrders = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await fetchShopOrders(token);
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch shop orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getOrders();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleCompleteOrder = async (orderId: number) => {
    try {
      setCompletingId(orderId);
      const token = await getToken();
      if (!token) return;

      const success = await completeOrder(token, orderId);
      if (success) {
        toast("Order marked as completed", "success");
        getOrders(); // Refresh list
      } else {
        toast("Failed to complete order. Verify payment status.", "error");
      }
    } catch (error) {
      toast("An error occurred", "error");
    } finally {
      setCompletingId(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#8484F6]"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, o) => 
    acc + (o.payment_status === 'SUCCESS' ? parseFloat(o.total_price) : 0), 0
  ).toFixed(2);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-logo">Sales & Orders</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track incoming orders and verify student payments.
          </p>
        </div>
        <Card className="shadow-none bg-[#8484F6]/5 border-[#8484F6]/10">
           <CardContent className="py-2 px-4 flex items-center gap-2">
             <DollarSign size={16} className="text-[#8484F6]" />
             <span className="text-sm font-semibold text-zinc-900">
               ${totalRevenue} 
               <span className="text-zinc-400 font-normal ml-1 text-xs">Total Revenue</span>
             </span>
           </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="shadow-sm border-zinc-200 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-100">
                 <Package size={24} />
               </div>
               <h2 className="text-base font-semibold text-zinc-900 font-logo">No sales yet</h2>
               <p className="text-zinc-500 text-sm max-w-xs mt-1">Incoming orders from other students will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-200">
                  <TableHead className="uppercase text-[10px] tracking-wider font-bold">Order</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-wider font-bold">Date</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-wider font-bold">Customer</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-wider font-bold">Payment</TableHead>
                  <TableHead className="uppercase text-[10px] tracking-wider font-bold">Status</TableHead>
                  <TableHead className="text-right uppercase text-[10px] tracking-wider font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const displayStatus = order.seller_status || order.status;
                  return (
                    <TableRow key={order.id} className="hover:bg-zinc-50/30 transition-colors border-zinc-100">
                      <TableCell className="font-bold text-zinc-900">
                        #SKL-{order.id.toString().padStart(5, '0')}
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-900 font-medium">
                        Student #{order.user}
                      </TableCell>
                      <TableCell>
                         <Badge 
                           variant={order.payment_status === 'SUCCESS' ? "default" : "secondary"}
                           className={`border font-bold shadow-none ${
                             order.payment_status === 'SUCCESS' 
                               ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-50" 
                               : order.payment_status === 'FAILED'
                               ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-50"
                               : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-50"
                           }`}
                         >
                           {order.payment_status}
                         </Badge>
                      </TableCell>
                      <TableCell>
                         <Badge 
                           variant="outline"
                           className={`font-bold shadow-none border ${
                             displayStatus === 'COMPLETED' 
                               ? "bg-blue-50 text-blue-700 border-blue-100" 
                               : "bg-zinc-100 text-zinc-600 border-zinc-200"
                           }`}
                         >
                           {displayStatus}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {displayStatus === 'PENDING' && order.payment_status === 'SUCCESS' ? (
                          <Button
                            size="sm"
                            disabled={completingId === order.id}
                            onClick={() => handleCompleteOrder(order.id)}
                            className="bg-[#8484F6] hover:bg-[#7373e5] text-white font-bold rounded-xl h-8 px-4"
                          >
                            {completingId === order.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white"></div>
                            ) : (
                              <>Complete <Check size={14} className="ml-1" /></>
                            )}
                          </Button>
                        ) : displayStatus === 'COMPLETED' ? (
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                            Fulfilled <CheckCircle2 size={12} className="text-green-500" />
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            Awaiting Payment
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-zinc-50 border-zinc-200 shadow-none rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3">
          <Clock size={16} className="text-[#8484F6] mt-0.5" />
          <div className="text-xs text-zinc-600 leading-normal">
             <p className="font-bold text-zinc-900 mb-1 text-sm font-logo">Verify Payments Carefully</p>
             Only fulfill and deliver items when the **Payment Status** is marked as <span className="text-green-700 font-bold uppercase tracking-tighter">Success</span>. Clicking **"Complete"** signifies the order has been delivered to the student.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
