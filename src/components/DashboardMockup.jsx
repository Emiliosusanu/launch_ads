import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LayoutDashboard, Megaphone, ScrollText, BarChart2, Settings, Calendar, Download, TrendingUp, TrendingDown, ChevronDown, ShoppingCart, DollarSign, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardMockup = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: 'Optimization Complete',
    description: 'Adjusted 12 bids to target 25% ACOS.',
  });
  const [selectedMetric, setSelectedMetric] = useState('spend');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30D');

  useEffect(() => {
    const variants = [
      {
        title: 'Optimization Complete',
        description: 'Adjusted 12 bids to target 25% ACOS.',
      },
      {
        title: 'Wasted Spend Blocked',
        description: '7 money‑draining keywords were paused automatically.',
      },
      {
        title: 'New Opportunities Found',
        description: 'Promoted 9 winning search terms into manual campaigns.',
      },
      {
        title: 'ACOS Trending Down',
        description: 'Last 7 days ACOS improved by 3.2% across active campaigns.',
      },
    ];

    const timer = setTimeout(() => {
      const picked = variants[Math.floor(Math.random() * variants.length)];
      setToastContent(picked);
      setShowToast(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const baseKpiData = {
    spend: {
      label: 'Ad Spend',
      value: 1068.76,
      format: (v) =>
        `$${v.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      change: '-4.2%',
      good: true,
    },
    orders: {
      label: 'Orders',
      value: 252,
      format: (v) => v,
      change: '+8.4%',
      good: true,
    },
    acos: {
      label: 'ACOS',
      value: 25.81,
      format: (v) => `${v.toFixed(2)}%`,
      change: '-1.2%',
      good: true,
    },
    sales: {
      label: 'Sales',
      value: 4140.87,
      format: (v) =>
        `$${v.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      change: '+12.5%',
      good: true,
    },
  };

  const kpiData = useMemo(() => {
    const multipliers = {
      '7D': 0.35,
      '30D': 1,
      '90D': 2.4,
    };
    const m = multipliers[timeRange] ?? 1;

    const acosByRange = {
      '7D': { value: baseKpiData.acos.value + 2.1, change: '+2.1%', good: false },
      '30D': { value: baseKpiData.acos.value, change: '-1.2%', good: true },
      '90D': { value: Math.max(18, baseKpiData.acos.value - 3.4), change: '-3.4%', good: true },
    };

    const acosForRange = acosByRange[timeRange] ?? acosByRange['30D'];

    return {
      spend: {
        ...baseKpiData.spend,
        value: baseKpiData.spend.value * m,
      },
      orders: {
        ...baseKpiData.orders,
        value: Math.round(baseKpiData.orders.value * m),
      },
      acos: {
        ...baseKpiData.acos,
        value: acosForRange.value,
        change: `${acosForRange.change}`,
        good: acosForRange.good,
      },
      sales: {
        ...baseKpiData.sales,
        value: baseKpiData.sales.value * m,
      },
    };
  }, [timeRange]);

  const chartValues = useMemo(() => {
    const metric = kpiData[selectedMetric];
    if (!metric) return Array(12).fill(0);

    const baseValue = metric.value;
    const isPercentage = selectedMetric === 'acos';

    const distributionsByRange = {
      '7D': [0.6, 0.9, 0.7, 1.1, 0.95, 1.3, 0.8],
      '30D': [0.65, 0.85, 0.55, 0.95, 0.75, 1.15, 1.35, 1.05, 1.45, 1.25, 1.55, 0.95],
      '90D': [0.5, 0.7, 0.6, 0.8, 0.9, 1.0, 0.85, 1.1, 1.25, 1.05, 0.95, 0.75],
    };

    const distribution = distributionsByRange[timeRange] || distributionsByRange['30D'];
    const periods = distribution.length;
    const avg = isPercentage ? baseValue : baseValue / periods;

    return distribution.map((factor) => avg * factor);
  }, [selectedMetric, timeRange, kpiData]);

  const maxChartValue = Math.max(...chartValues, 1) * 1.2 || 100;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'campaigns', icon: Megaphone, label: 'Campaigns' },
    { id: 'rules', icon: ScrollText, label: 'Rules' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-[#0B0B0F] border border-[#6A00FF]/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 flex flex-col h-full font-sans text-base min-h-[600px] md:min-h-[800px]">
      {/* Browser Chrome */}
      <div className="bg-[#16161a] border-b border-white/5 px-3 py-2 md:px-4 md:py-4 flex items-center gap-3 md:gap-4 select-none shrink-0 z-20 relative">
        <div className="flex gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 h-8 md:h-10 bg-[#0B0B0F] rounded-lg border border-white/5 flex items-center px-3 md:px-4 gap-2 max-w-xl mx-auto opacity-50 transition-opacity hover:opacity-80 group cursor-text">
          <Lock className="w-3 h-3 md:w-4 md:h-4 text-[#2ECC71]" />
          <span className="text-[10px] md:text-sm text-gray-400 font-mono truncate group-hover:text-white transition-colors">
            app.adsautopilot.com/dashboard
          </span>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-1 overflow-hidden relative bg-[#0B0B0F]">
        {/* Sidebar */}
        <div className="w-[52px] md:w-64 bg-[#16161a] border-r border-white/5 flex flex-col py-4 md:py-6 gap-2 md:gap-3 shrink-0 z-10 items-center md:items-stretch">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "h-10 md:h-14 w-10 md:w-auto mx-auto md:mx-4 rounded-lg md:rounded-xl flex items-center justify-center md:justify-start gap-4 md:px-4 transition-all duration-200 group relative",
                activeTab === item.id
                  ? "bg-[#6A00FF]/10 text-white"
                  : "text-gray-500 hover:text-white hover:bg-white/5",
              )}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -left-1 md:left-0 w-1 h-6 md:h-8 bg-[#6A00FF] rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <item.icon
                size={20}
                className={cn(
                  "shrink-0 md:w-6 md:h-6",
                  activeTab === item.id ? "text-[#6A00FF]" : "group-hover:text-gray-300",
                )}
              />
              <span
                className={cn(
                  "text-base font-medium hidden md:block",
                  activeTab === item.id ? "font-semibold" : "",
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className="flex-1 bg-[#0B0B0F] p-3 md:p-8 overflow-y-auto custom-scrollbar relative w-full">
          {/* Header Section */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 md:mb-10">
            <div className="mb-2 md:mb-0">
              <h2 className="text-lg md:text-4xl font-bold text-white mb-1 md:mb-2">Dashboard</h2>
              <p className="text-xs md:text-base text-gray-500 font-medium">Welcome back, Author.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="h-10 md:h-14 px-3 md:px-5 rounded-lg md:rounded-xl bg-[#1F1F25] border border-white/10 flex items-center gap-2 md:gap-3 text-xs md:text-base text-gray-300 font-medium shadow-sm flex-1 md:flex-none whitespace-nowrap justify-center md:justify-start hover:border-white/20 transition-colors cursor-pointer">
                <Calendar size={14} className="md:w-[18px] md:h-[18px] text-[#6A00FF]" />
                <span>31 Oct - 30 Nov 2025</span>
              </div>
              <button className="h-10 md:h-14 w-10 md:w-14 rounded-lg md:rounded-xl bg-[#1F1F25] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#6A00FF] hover:border-[#6A00FF]/30 transition-colors shrink-0">
                <Download size={16} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10">
            {Object.keys(kpiData).map((key) => {
              const kpi = kpiData[key];
              return <KpiCard key={key} kpi={kpi} metricKey={key} />;
            })}
          </div>

          {/* Chart Section */}
          <div className="bg-[#1F1F25] rounded-xl md:rounded-2xl border border-white/5 p-4 md:p-8 flex flex-col relative group min-h-[auto]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4 z-10 relative">
              <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <h3 className="text-sm md:text-xl font-bold text-white whitespace-nowrap">Performance</h3>

                {/* Metric Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between gap-2 text-xs md:text-base font-bold bg-[#0B0B0F] border border-white/10 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl text-white hover:border-[#6A00FF]/50 transition-colors min-w-[120px] md:min-w-[180px]"
                  >
                    <span>{kpiData[selectedMetric].label}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 md:left-0 mt-2 w-[140px] md:w-[180px] bg-[#1F1F25] border border-white/10 rounded-lg md:rounded-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 ring-1 ring-white/5"
                      >
                        {Object.keys(kpiData).map((key) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSelectedMetric(key);
                              setIsDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-3 py-2.5 md:px-4 md:py-3.5 text-xs md:text-sm font-medium transition-colors border-b border-white/5 last:border-0 flex items-center justify-between',
                              selectedMetric === key
                                ? 'text-white bg-[#6A00FF]/10'
                                : 'text-gray-400 hover:text-white hover:bg-[#0B0B0F]',
                            )}
                          >
                            {kpiData[key].label}
                            {selectedMetric === key && (
                              <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#6A00FF]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex bg-[#0B0B0F] rounded-lg p-1 border border-white/5 w-full md:w-auto justify-center md:justify-start gap-0.5 md:gap-1">
                {['7D', '30D', '90D'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setTimeRange(d)}
                    className={cn(
                      'flex-1 md:flex-none text-[11px] md:text-sm font-bold px-2.5 py-1.5 md:px-6 md:py-2.5 rounded md:rounded-lg transition-all whitespace-nowrap',
                      timeRange === d
                        ? 'bg-[#6A00FF] text-white shadow-lg'
                        : 'text-gray-500 hover:text-white hover:bg:white/5',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Render Area */}
            <div className="relative z-20 w-full h-[240px] md:h-[350px] flex items-end justify-between gap-1.5 md:gap-4 px-1">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 z-0">
                <div className="w-full h-px bg-white border-t border-dashed" />
                <div className="w-full h-px bg-white border-t border-dashed" />
                <div className="w-full h-px bg-white border-t border-dashed" />
                <div className="w-full h-px bg-white border-t border-dashed" />
                <div className="w-full h-px bg-white border-t border-dashed" />
              </div>
              {(chartValues.length ? chartValues : Array(7).fill(1)).map((value, i) => (
                <div key={i} className="relative flex-1 h-full flex items-end group/bar z-10">
                  <motion.div
                    key={selectedMetric}
                    initial={{ height: '4px' }}
                    animate={{ height: `${(value / maxChartValue) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.03, ease: 'easeOut' }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className={cn(
                      'w-full rounded-t-sm md:rounded-t-lg transition-all duration-200 relative min-w-[6px] md:min-w-[12px]',
                      hoveredBar === i
                        ? 'bg-[#FF7A3D] shadow-[0_0_25px_rgba(255,122,61,0.6)] z-20 scale-x-110'
                        : 'bg-gradient-to-t from-[#6A00FF]/40 to-[#6A00FF] hover:from-[#6A00FF]/60 hover:to-[#8B3DFF]',
                    )}
                  >
                    <AnimatePresence>
                      {hoveredBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -30, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#16161a] text-white text-[11px] md:text-xs font-bold px-2.5 py-1.5 md:px-3 md:py-2.5 rounded-lg border border-white/10 whitespace-nowrap z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-0.5 pointer-events-none min-w-[68px] md:min-w-[80px]"
                        >
                          <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                            Nov {18 + i}
                          </span>
                          <span className="text-sm md:text-base font-bold text-[#FF7A3D]">
                            {metricFormatter(value, selectedMetric)}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 md:left:auto md:right-6 md:bottom-6 md:max-w-sm bg-[#1F1F25]/95 backdrop-blur-md border border-[#2ECC71]/30 p-3 md:p-5 rounded-xl md:rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex items-start gap-3 z-50 cursor-pointer hover:border-[#2ECC71]/60 transition-colors"
                onClick={() => setShowToast(false)}
              >
                <div className="w-2.5 h-2.5 mt-1 md:mt-1.5 rounded-full bg-[#2ECC71] shadow-[0_0_10px_#2ECC71] animate-pulse shrink-0" />
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white leading-none mb-1">
                    {toastContent.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 leading-snug">
                    {toastContent.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ kpi, metricKey }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="bg-[#1F1F25] rounded-xl md:rounded-2xl p-2.5 md:p-5 border border-white/5 hover:border-[#6A00FF]/30 transition-all duration-300 group relative overflow-hidden min-h-[90px] md:min-h-[150px] flex flex-col justify-between shadow-sm hover:shadow-lg"
  >
    <div className="flex justify-between items-start mb-1.5 md:mb-2 relative z-10">
      <div className="w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-[#2d2d35] flex items-center justify-center group-hover:bg-[#6A00FF]/20 transition-colors duration-300">
        {metricKey === 'spend' && (
          <WalletIcon className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-[#6A00FF] transition-colors" />
        )}
        {metricKey === 'sales' && (
          <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-[#6A00FF] transition-colors" />
        )}
        {metricKey === 'orders' && (
          <ShoppingCart className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-[#6A00FF] transition-colors" />
        )}
        {metricKey === 'acos' && (
          <Percent className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-[#6A00FF] transition-colors" />
        )}
      </div>
      <div
        className={cn(
          'flex items-center text-[10px] md:text-xs font-bold px-1.5 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg bg-opacity-10',
          kpi.good ? 'text-[#2ECC71] bg-[#2ECC71]/10' : 'text-[#FF4D4D] bg-[#FF4D4D]/10',
        )}
      >
        {kpi.good ? (
          <TrendingDown size={10} className="mr-1 md:mr-1.5" />
        ) : (
          <TrendingUp size={10} className="mr-1 md:mr-1.5" />
        )}
        {kpi.change}
      </div>
    </div>
    <div>
      <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-0.5 md:mb-2">
        {kpi.label}
      </div>
      <div className="text-lg md:text-3xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
        {kpi.format(kpi.value)}
      </div>
    </div>
  </motion.div>
);

const WalletIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const metricFormatter = (value, type) => {
  if (type === 'spend' || type === 'sales') return `$${value.toFixed(2)}`;
  if (type === 'acos' || type === 'ctr') return `${value.toFixed(2)}%`;
  return Math.round(value).toLocaleString();
};

export default DashboardMockup;
