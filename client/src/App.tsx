import React, { useEffect, useState } from 'react';
import { api } from './api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, BarChart3, Settings, Calculator, Activity } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isTrained, setIsTrained] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    product_category: '',
    product_name: '',
    unit_cost: 0,
    unit_price: 0,
    comp_1: 0,
    comp_2: 0,
    comp_3: 0,
    promotion: 0,
    holiday: 0,
    weekend: 0,
    month: 1
  });

  useEffect(() => {
    // Check health/training status
    const checkHealth = async () => {
      try {
        const health = await api.health();
        setIsTrained(health.trained);
      } catch (e) {
        console.error(e);
      }
    };

    // Looping check until trained
    const interval = setInterval(() => {
      checkHealth();
    }, 2000);

    // Initial config load
    api.getConfig().then(setConfig);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setFormData({
      ...formData,
      product_category: cat,
      product_name: config?.[cat]?.products?.[0] || ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'product_name' || name === 'product_category' ? value : Number(value)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.predict(formData);
      setResults(res);
    } catch (e) {
      alert("Error in prediction: " + e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isTrained && !config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Initializing Model...</h2>
          <p className="text-slate-400 mt-2">Generating synthetic data and training (this may take a moment)</p>
        </div>
      </div>
    );
  }

  const chartData = results?.plot_data?.prices.map((p: number, i: number) => ({
    price: p,
    demand: results.plot_data.demand[i],
    profit: results.plot_data.profit[i]
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              PriceOpt AI
            </h1>
            <p className="text-slate-400 text-sm">Dynamic Pricing Optimization Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={clsx("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2", isTrained ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400")}>
            <div className={clsx("w-2 h-2 rounded-full", isTrained ? "bg-emerald-400 animate-pulse" : "bg-yellow-400")} />
            {isTrained ? "Model Ready" : "Training..."}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Input Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Scenario Configuration</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select
                    name="product_category"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleCategoryChange}
                    value={formData.product_category}
                  >
                    <option value="">Select Category</option>
                    {config && Object.keys(config).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Product</label>
                  <select
                    name="product_name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleInputChange}
                    value={formData.product_name}
                    disabled={!formData.product_category}
                  >
                    <option value="">Select Product</option>
                    {formData.product_category && config?.[formData.product_category]?.products.map((p: string) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Unit Cost ($)</label>
                  <input
                    type="number" name="unit_cost"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleInputChange} value={formData.unit_cost}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Current Price ($)</label>
                  <input
                    type="number" name="unit_price"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleInputChange} value={formData.unit_price}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-slate-400">Competitor Prices ($)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" name="comp_1" placeholder="Comp 1" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" onChange={handleInputChange} value={formData.comp_1} />
                  <input type="number" name="comp_2" placeholder="Comp 2" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" onChange={handleInputChange} value={formData.comp_2} />
                  <input type="number" name="comp_3" placeholder="Comp 3" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none" onChange={handleInputChange} value={formData.comp_3} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Month (1-12)</label>
                  <input type="number" name="month" min="1" max="12" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm outline-none" onChange={handleInputChange} value={formData.month} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700"
                      onChange={(e) => setFormData({ ...formData, promotion: e.target.checked ? 1 : 0 })} checked={formData.promotion === 1}
                    />
                    <span className="text-sm">Promotion</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-500 bg-slate-800 border-slate-700"
                      onChange={(e) => setFormData({ ...formData, weekend: e.target.checked ? 1 : 0 })} checked={formData.weekend === 1}
                    />
                    <span className="text-sm">Weekend</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isTrained}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {loading ? 'Optimizing...' : <><Calculator className="w-4 h-4" /> Optimize Pricing</>}
              </button>
            </form>
          </div>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8 space-y-6">
          {results ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Predicted Profit (Current)</span>
                  </div>
                  <div className="text-2xl font-bold text-white">${results.user_prediction.profit}</div>
                  <div className="text-xs text-slate-500 mt-1">Based on price ${formData.unit_price}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-blue-200 text-sm font-medium">Optimal Price</span>
                  </div>
                  <div className="text-3xl font-bold text-white">${results.optimal_prediction.optimal_price}</div>
                  <div className="text-xs text-blue-300 mt-1">
                    Maximizes profit to <span className="font-semibold text-white">${results.optimal_prediction.max_profit}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Demand at Optimal</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{results.optimal_prediction.optimal_demand} units</div>
                  <div className="text-xs text-slate-500 mt-1">Revenue: ${Number(results.optimal_prediction.optimal_price * results.optimal_prediction.optimal_demand).toFixed(2)}</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" /> Profit vs Price Analysis
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="price" stroke="#64748b" label={{ value: 'Price ($)', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} name="Projected Profit" />
                        <Line type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={2} dot={false} name="Demand (Units)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12 bg-slate-900/30 border border-slate-800/50 rounded-2xl border-dashed">
              <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                <Calculator className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Ready to Optimize</p>
              <p className="text-sm">Configure the scenario on the left to see optimal pricing analytics.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
