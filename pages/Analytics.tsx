
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../services/supabase';
import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => supabaseService.getSystemAnalytics()
  });

  const cards = [
    { label: 'Platform Reach', val: stats?.totalViews.toLocaleString(), icon: <Eye />, trend: '+12.5%', isUp: true },
    { label: 'Network Engagement', val: stats?.totalEngagement.toLocaleString(), icon: <TrendingUp />, trend: '+8.2%', isUp: true },
    { label: 'Active Rowdies', val: stats?.activeUsers, icon: <Users />, trend: '+4', isUp: true },
    { label: 'Index Density', val: stats?.postCounts.published, icon: <BarChart3 />, trend: '-2.1%', isUp: false },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-4xl font-black tracking-tight mb-2">Performance Engine</h1>
        <p className="text-gray-400 font-medium">Real-time engagement telemetry and audience insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="elevated-card p-8 rounded-[2rem] relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-gray-50 rounded-2xl text-black">
                {card.icon}
              </div>
              <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${card.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.isUp ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                {card.trend}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{card.label}</p>
            <h3 className="text-3xl font-black">{isLoading ? '...' : card.val}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[3rem] p-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-xl font-bold mb-1">Audience Growth</h4>
              <p className="text-xs text-gray-400 font-medium">Monthly view trends across the entire RR network.</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">30 Days</button>
              <button className="px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">90 Days</button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 60, 45, 90, 65, 80, 55, 70, 85, 95, 100, 75].map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                className="flex-1 bg-gray-100 rounded-t-lg hover:bg-black transition-colors relative group"
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   {val * 50} Views
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-black text-white rounded-[3rem] p-12 flex flex-col justify-between">
           <div>
              <h4 className="text-xl font-bold mb-6">Engagement Score</h4>
              <div className="flex items-center space-x-4 mb-8">
                <div className="text-5xl font-black">9.4</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                  Premium Tier<br/>Rating
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your content density and interaction ratio are within the top 2% of the global network.
              </p>
           </div>
           <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 transition-all">
             Export Telemetry (CSV)
           </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
