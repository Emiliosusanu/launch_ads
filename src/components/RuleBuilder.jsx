
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, Play, Clock, Zap, 
  Filter, ArrowDown, X, Layers, Check, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Initial Templates
const TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'High ACOS Bid Reducer',
    trigger: 'daily',
    intervalDays: 1,
    timeOfDay: '08:00',
    enabled: true,
    conditions: [
      { id: 'c1', metric: 'acos', operator: 'gt', value: 30 },
      { id: 'c2', metric: 'clicks', operator: 'gt', value: 10 }
    ],
    actions: [
      { id: 'a1', type: 'decrease_bid', value: 15, unit: '%' }
    ]
  },
  {
    id: 'tpl-2',
    name: 'Bleeder Stopper',
    trigger: 'daily',
    intervalDays: 1,
    timeOfDay: '12:00',
    enabled: true,
    conditions: [
      { id: 'c1', metric: 'spend', operator: 'gt', value: 20 },
      { id: 'c2', metric: 'orders', operator: 'eq', value: 0 }
    ],
    actions: [
      { id: 'a1', type: 'pause_keyword', value: null, unit: null }
    ]
  },
  {
    id: 'tpl-3',
    name: 'Winner Scaler',
    trigger: 'daily',
    intervalDays: 1,
    timeOfDay: '20:00',
    enabled: false,
    conditions: [
      { id: 'c1', metric: 'acos', operator: 'lt', value: 15 },
      { id: 'c2', metric: 'orders', operator: 'gt', value: 5 }
    ],
    actions: [
      { id: 'a1', type: 'increase_bid', value: 10, unit: '%' }
    ]
  }
];

const METRICS = [
  { value: 'acos', label: 'ACOS (%)' },
  { value: 'cpc', label: 'CPC ($)' },
  { value: 'clicks', label: 'Clicks' },
  { value: 'impressions', label: 'Impressions' },
  { value: 'spend', label: 'Spend ($)' },
  { value: 'orders', label: 'Orders' },
];

const OPERATORS = [
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'eq', label: '=' },
  { value: 'gte', label: '>=' },
  { value: 'lte', label: '<=' }
];

const ACTIONS = [
  { value: 'increase_bid', label: 'Increase Bid' },
  { value: 'decrease_bid', label: 'Decrease Bid' },
  { value: 'set_bid', label: 'Set Bid To' },
  { value: 'pause_keyword', label: 'Pause Keyword' },
  { value: 'enable_keyword', label: 'Enable Keyword' },
  { value: 'add_negative', label: 'Add Negative KW' }
];

const RuleBuilder = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState([]);
  const [activeRuleId, setActiveRuleId] = useState(null);
  
  // Load rules
  useEffect(() => {
    const saved = localStorage.getItem('aap_rules');
    if (saved) {
      try {
        setRules(JSON.parse(saved));
      } catch (e) {
        setRules(TEMPLATES);
      }
    } else {
      setRules(TEMPLATES);
    }
  }, []);

  // Persist rules
  useEffect(() => {
    if (rules.length > 0) {
      localStorage.setItem('aap_rules', JSON.stringify(rules));
    }
  }, [rules]);

  const handleCreateRule = () => {
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Automation Rule',
      enabled: false,
      trigger: 'daily',
      intervalDays: 1,
      timeOfDay: '09:00',
      conditions: [{ id: Math.random().toString(), metric: 'acos', operator: 'gt', value: 30 }],
      actions: [{ id: Math.random().toString(), type: 'decrease_bid', value: 5, unit: '%' }]
    };
    setRules([...rules, newRule]);
    setActiveRuleId(newRule.id);
  };

  const handleToggleRule = (id, e) => {
    e.stopPropagation();
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({
      title: "Rule Updated",
      description: "Rule status changed.",
      className: "bg-[#1F1F25] border-[#6A00FF] text-white",
      duration: 1500
    });
  };

  const deleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
    if (activeRuleId === id) setActiveRuleId(null);
  };

  const activeRule = rules.find(r => r.id === activeRuleId);

  // Helper to update active rule
  const updateActiveRule = (updates) => {
    setRules(prev => prev.map(r => r.id === activeRuleId ? { ...r, ...updates } : r));
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0B0B0F] relative overflow-hidden" id="rule-engine">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-[#6A00FF]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-10 md:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A00FF]/10 text-[#C149FF] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 border border-[#6A00FF]/20"
          >
            <Sparkles size={14} />
            <span>Smart Automation</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Custom Logic Builder</h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">Create complex "If This Then That" rules to automate your bid management.</p>
        </div>

        <div className="bg-[#16161a] rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[700px]">
          
          {/* Sidebar - List of Rules */}
          <div className={`w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0B0B0F]/50 flex flex-col ${activeRule ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#16161a]">
              <h3 className="font-bold text-white text-base md:text-lg">Your Rules</h3>
              <Button 
                size="sm" 
                onClick={handleCreateRule} 
                className="bg-[#6A00FF] hover:bg-[#5B00CC] h-8 w-8 p-0 rounded-lg transition-colors"
              >
                <Plus size={18} className="text-white" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 custom-scrollbar min-h-[300px] lg:min-h-0">
              {rules.map(rule => (
                <motion.div
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all group relative flex items-center justify-between ${
                    activeRuleId === rule.id 
                      ? 'bg-[#1F1F25] border-[#6A00FF]/50 shadow-[0_0_20px_rgba(106,0,255,0.1)]' 
                      : 'bg-[#1F1F25]/50 border-white/5 hover:bg-[#1F1F25] hover:border-white/10'
                  }`}
                >
                  <div>
                    <h4 className={`font-bold text-sm mb-1 ${activeRuleId === rule.id ? 'text-white' : 'text-gray-300'}`}>
                      {rule.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em]">
                      <Clock size={10} className="text-gray-600" />
                      <span className="text-[9px] text-gray-600 normal-case tracking-normal">
                        Every {(rule.intervalDays || 1)} day{(rule.intervalDays || 1) > 1 ? 's' : ''} at {(rule.timeOfDay || '08:00')}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={(e) => handleToggleRule(rule.id, e)}
                    className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${rule.enabled ? 'bg-[#2ECC71]' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-md ${rule.enabled ? 'left-5' : 'left-1'}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Canvas - Rule Editor */}
          <div className={`flex-1 bg-[#1F1F25] relative flex flex-col ${!activeRule ? 'hidden lg:flex' : 'flex'}`}>
            {activeRule ? (
              <>
                {/* Editor Header */}
                <div className="h-16 md:h-20 border-b border-white/5 px-4 md:px-8 flex items-center justify-between bg-[#16161a]">
                  <div className="flex items-center gap-2 w-full">
                    <button onClick={() => setActiveRuleId(null)} className="lg:hidden mr-2 text-gray-500">
                       <ArrowDown className="rotate-90" size={20} />
                    </button>
                    <div className="flex flex-col gap-1 w-full">
                      <input 
                        type="text" 
                        value={activeRule.name}
                        onChange={(e) => updateActiveRule({ name: e.target.value })}
                        className="bg-transparent border-none text-base md:text-xl font-bold text-white focus:outline-none focus:ring-0 p-0 w-full placeholder:text-gray-600"
                      />
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0F]/80 border border-white/10 px-2.5 py-0.5 w-max">
                        <Clock size={11} className="text-gray-500" />
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.18em] uppercase">DAILY</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 ml-1">
                          <span className="uppercase tracking-[0.16em] text-gray-500">AT</span>
                          <input
                            type="time"
                            value={activeRule.timeOfDay || '08:00'}
                            onChange={(e) => updateActiveRule({ timeOfDay: e.target.value })}
                            className="bg-[#111118] border border-white/10 rounded px-1 py-0.5 text-[10px] text-gray-100 text-center focus:outline-none focus:border-[#6A00FF]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 md:gap-3 shrink-0 ml-2">
                    <Button 
                      size="sm"
                      onClick={() => toast({ title: "Rule Saved", className: "bg-[#1F1F25] border-[#2ECC71] text-white" })}
                      className="bg-[#6A00FF] hover:bg-[#5B00CC] text-white h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm"
                    >
                      <Save size={14} className="mr-1.5 md:mr-2" /> Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRule(activeRule.id)}
                      className="text-gray-500 hover:text-[#FF4D4D] hover:bg-[#FF4D4D]/10 h-8 md:h-10 w-8 md:w-10 p-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0B0B0F]/20">
                  
                  {/* Conditions */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4 md:mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#6A00FF]/20 flex items-center justify-center border border-[#6A00FF]/30">
                         <Filter size={16} className="text-[#C149FF]" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white">IF <span className="text-gray-500 text-xs md:text-sm font-normal ml-2">(Conditions match)</span></h3>
                    </div>

                    <div className="space-y-3 pl-2 md:pl-4 border-l-2 border-[#6A00FF]/20">
                       {activeRule.conditions.map((c, i) => (
                         <div key={c.id} className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 bg-[#1F1F25] p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-colors">
                            <div className="text-[10px] md:text-xs font-bold text-gray-500 w-full md:w-8 mb-1 md:mb-0">{i === 0 ? 'WHEN' : 'AND'}</div>
                            <select 
                              value={c.metric}
                              onChange={(e) => {
                                const newConds = [...activeRule.conditions];
                                newConds[i].metric = e.target.value;
                                updateActiveRule({ conditions: newConds });
                              }}
                              className="bg-[#0B0B0F] text-white text-xs md:text-sm rounded-lg border border-white/10 px-2 md:px-3 h-9 focus:border-[#6A00FF] outline-none flex-1 md:w-32"
                            >
                              {METRICS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <select 
                              value={c.operator}
                              onChange={(e) => {
                                const newConds = [...activeRule.conditions];
                                newConds[i].operator = e.target.value;
                                updateActiveRule({ conditions: newConds });
                              }}
                              className="bg-[#0B0B0F] text-white text-xs md:text-sm rounded-lg border border-white/10 px-2 md:px-3 h-9 focus:border-[#6A00FF] outline-none w-16 md:w-20"
                            >
                              {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <input 
                              type="number"
                              value={c.value}
                              onChange={(e) => {
                                const newConds = [...activeRule.conditions];
                                newConds[i].value = e.target.value;
                                updateActiveRule({ conditions: newConds });
                              }}
                              className="bg-[#0B0B0F] text-white text-xs md:text-sm rounded-lg border border-white/10 px-2 md:px-3 h-9 focus:border-[#6A00FF] outline-none w-20 md:w-24"
                            />
                            <button 
                              onClick={() => {
                                const newConds = activeRule.conditions.filter(cond => cond.id !== c.id);
                                updateActiveRule({ conditions: newConds });
                              }}
                              className="ml-auto text-gray-600 hover:text-[#FF4D4D] p-2"
                            >
                              <X size={16} />
                            </button>
                         </div>
                       ))}
                       <button 
                         onClick={() => updateActiveRule({ conditions: [...activeRule.conditions, { id: Math.random(), metric: 'acos', operator: 'gt', value: 0 }]})}
                         className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#6A00FF] hover:text-[#C149FF] py-2 px-1"
                       >
                         <Plus size={14} /> ADD CONDITION
                       </button>
                    </div>
                  </div>

                  <div className="flex justify-center my-4 md:my-6 opacity-30">
                    <ArrowDown size={24} className="text-white" />
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex items-center gap-3 mb-4 md:mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#FF7A3D]/20 flex items-center justify-center border border-[#FF7A3D]/30">
                         <Zap size={16} className="text-[#FF7A3D]" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white">THEN <span className="text-gray-500 text-xs md:text-sm font-normal ml-2">(Take action)</span></h3>
                    </div>

                    <div className="space-y-3 pl-2 md:pl-4 border-l-2 border-[#FF7A3D]/20">
                       {activeRule.actions.map((a, i) => (
                         <div key={a.id} className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 bg-[#1F1F25] p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-colors">
                            <div className="text-[10px] md:text-xs font-bold text-gray-500 w-full md:w-8 mb-1 md:mb-0">DO</div>
                            <select 
                              value={a.type}
                              onChange={(e) => {
                                const newActs = [...activeRule.actions];
                                newActs[i].type = e.target.value;
                                updateActiveRule({ actions: newActs });
                              }}
                              className="bg-[#0B0B0F] text-white text-xs md:text-sm rounded-lg border border-white/10 px-2 md:px-3 h-9 focus:border-[#FF7A3D] outline-none flex-1 md:w-40"
                            >
                              {ACTIONS.map(act => <option key={act.value} value={act.value}>{act.label}</option>)}
                            </select>
                            
                            {!['pause_keyword', 'enable_keyword'].includes(a.type) && (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number"
                                  value={a.value}
                                  onChange={(e) => {
                                    const newActs = [...activeRule.actions];
                                    newActs[i].value = e.target.value;
                                    updateActiveRule({ actions: newActs });
                                  }}
                                  className="bg-[#0B0B0F] text-white text-xs md:text-sm rounded-lg border border-white/10 px-2 md:px-3 h-9 focus:border-[#FF7A3D] outline-none w-20 md:w-24"
                                />
                                <span className="text-gray-400 text-xs md:text-sm font-bold">{a.unit}</span>
                              </div>
                            )}

                            <button 
                              onClick={() => {
                                const newActs = activeRule.actions.filter(act => act.id !== a.id);
                                updateActiveRule({ actions: newActs });
                              }}
                              className="ml-auto text-gray-600 hover:text-[#FF4D4D] p-2"
                            >
                              <X size={16} />
                            </button>
                         </div>
                       ))}
                       <button 
                         onClick={() => updateActiveRule({ actions: [...activeRule.actions, { id: Math.random(), type: 'increase_bid', value: 5, unit: '%' }]})}
                         className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#FF7A3D] hover:text-[#FF4F2C] py-2 px-1"
                       >
                         <Plus size={14} /> ADD ACTION
                       </button>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1F1F25] border border-white/5 flex items-center justify-center mb-4 md:mb-6 shadow-inner">
                  <Layers size={32} className="md:w-[40px] md:h-[40px] text-gray-600 opacity-50" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Rule Selected</h3>
                <p className="text-sm md:text-base text-gray-500 max-w-sm mb-6 md:mb-8">Select a rule from the list to edit, or create a new one to start automating your ads.</p>
                <Button onClick={handleCreateRule} className="bg-[#6A00FF] hover:bg-[#5B00CC] text-white">
                  Create New Rule
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RuleBuilder;
