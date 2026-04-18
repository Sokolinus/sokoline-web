"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Users, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Total Revenue", value: "$1,240.00", icon: TrendingUp, change: "+12.5%", changeType: "positive" },
  { name: "Active Orders", value: "8", icon: ShoppingBag, change: "+2 today", changeType: "positive" },
  { name: "Shop Visitors", value: "432", icon: Users, change: "+18%", changeType: "positive" },
];

export default function DashboardOverview() {
  const { user } = useUser();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase leading-none">
            Sup, <br /> <span className="text-[#7C3AED]">{user?.firstName || "Entreprenuer"}</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg font-medium">
            Your shop is performing 24% better than last week. Keep it up.
          </p>
        </div>
        <Link 
          href="/dashboard/products" 
          className="bg-[#1A1A1A] dark:bg-[#FBFBFB] text-white dark:text-[#1A1A1A] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#7C3AED] dark:hover:bg-[#7C3AED] dark:hover:text-white transition-all shadow-2xl active:scale-95"
        >
          <Plus size={18} />
          List New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white dark:bg-[#0A0A0A] border border-zinc-100 dark:border-zinc-800 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-purple-100 dark:hover:shadow-none transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#F5F3FF] dark:bg-[#1E1B4B] flex items-center justify-center text-[#7C3AED]">
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                stat.changeType === 'positive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.name}</p>
            <h3 className="text-3xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
         {/* Order Preview */}
         <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Latest Sales</h2>
              <Link href="/dashboard/orders" className="text-xs font-black uppercase tracking-widest text-[#7C3AED] hover:underline flex items-center gap-2">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] p-4 space-y-2">
               {[1, 2, 3].map((item) => (
                 <div key={item} className="flex items-center justify-between p-6 bg-white dark:bg-[#0A0A0A] rounded-[28px] border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                       <div>
                          <p className="font-bold text-sm uppercase">Order #SKL-00{item}2</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">2 items • 4m ago</p>
                       </div>
                    </div>
                    <span className="font-black text-[#1A1A1A] dark:text-[#FBFBFB]">$42.00</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Shop Health */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Shop Insights</h2>
            <div className="bg-[#7C3AED] rounded-[40px] p-10 text-white relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="text-3xl font-bold leading-tight mb-4 uppercase italic">Your "Safety Certified" badge is pending.</h3>
                 <p className="text-purple-100 font-medium mb-8 max-w-sm">Complete your shop verification to unlock the trust badge and boost sales by up to 40%.</p>
                 <button className="bg-white text-[#7C3AED] px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95">
                   Verify Now
                 </button>
               </div>
               {/* Abstract Background Shapes */}
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
               <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-black/10 rounded-full blur-2xl" />
            </div>
         </div>
      </div>
    </motion.div>
  );
}
