import React, { useState, useEffect } from 'react';
import { proteinSources } from '../data/proteinSources';

const ProteinCalculator = () => {
    // --- State ---
    const [isClient, setIsClient] = useState(false);

    // User Stats
    const [weight, setWeight] = useState(180);
    const [isLbs, setIsLbs] = useState(true);
    const [customGoal, setCustomGoal] = useState(''); // String for input handling, converted to num for math

    // Selection & Distribution
    const [selectedIds, setSelectedIds] = useState(
        proteinSources.filter(s => s.default).map(s => s.id)
    );
    const [distributions, setDistributions] = useState({});

    // --- Effects ---

    // Hydration fix
    useEffect(() => {
        setIsClient(true);
        // Initialize distributions for default selection
        const initialDist = {};
        const defaultSources = proteinSources.filter(s => s.default);
        const split = Math.floor(100 / defaultSources.length);
        const remainder = 100 % defaultSources.length;

        defaultSources.forEach((s, idx) => {
            initialDist[s.id] = split + (idx === 0 ? remainder : 0);
        });
        setDistributions(initialDist);
    }, []);

    // --- Helpers ---

    const getAutoGoal = () => {
        const w = parseFloat(weight) || 0;
        // 1g per lb. If kg, convert to lbs first used for the "1g/lb" rule, 
        // OR standard is 2.2g/kg (roughly same).
        // Let's simplified: 1g/lb.
        const weightInLbs = isLbs ? w : w * 2.20462;
        return Math.round(weightInLbs);
    };

    const currentGoal = customGoal !== '' ? parseFloat(customGoal) : getAutoGoal();

    const handleSourceToggle = (id) => {
        if (selectedIds.includes(id)) {
            // Remove
            const newIds = selectedIds.filter(i => i !== id);
            setSelectedIds(newIds);

            // Rebalance remaining
            if (newIds.length > 0) {
                const newDist = { ...distributions };
                delete newDist[id];

                // Redistribute the removed % equally among survivors
                const removedPct = distributions[id] || 0;
                const addPerItem = Math.floor(removedPct / newIds.length);
                const remainder = removedPct % newIds.length;

                newIds.forEach((sid, idx) => {
                    newDist[sid] = (newDist[sid] || 0) + addPerItem + (idx === 0 ? remainder : 0);
                });
                setDistributions(newDist);
            } else {
                setDistributions({});
            }
        } else {
            // Add
            const newIds = [...selectedIds, id];
            setSelectedIds(newIds);

            // Steal a bit from everyone else to give to new guy? 
            // Or just give 0? Let's give equal split to start fresh or intelligent rebalance.
            // Simple approach: Give 0 and let user adjust, or normalize equal.
            // "Premium" feel: Equalize all.
            const split = Math.floor(100 / newIds.length);
            const remainder = 100 % newIds.length;
            const newDist = {};
            newIds.forEach((sid, idx) => {
                newDist[sid] = split + (idx === 0 ? remainder : 0);
            });
            setDistributions(newDist);
        }
    };

    const handleDistChange = (id, newVal) => {
        const val = Math.max(0, Math.min(100, parseInt(newVal) || 0));
        setDistributions(prev => ({ ...prev, [id]: val }));
    };

    const getTotalDist = () => {
        return selectedIds.reduce((sum, id) => sum + (distributions[id] || 0), 0);
    };

    const normalizeDistributions = () => {
        const total = getTotalDist();
        if (total === 0) return;

        const newDist = {};
        const ids = selectedIds;
        let runningTotal = 0;

        ids.forEach((id, idx) => {
            if (idx === ids.length - 1) {
                newDist[id] = 100 - runningTotal;
            } else {
                const raw = distributions[id];
                const normalized = Math.round((raw / total) * 100);
                newDist[id] = normalized;
                runningTotal += normalized;
            }
        });
        setDistributions(newDist);
    };

    // --- Render ---
    if (!isClient) return <div className="p-10 text-center text-gray-500">Loading Planner...</div>;

    const totalDist = getTotalDist();
    const isTotal100 = totalDist === 100;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12">

            {/* Header / Stats Section */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white p-2 rounded-lg text-sm">1</span>
                    Your Metrics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Weight Input */}
                    <div className="space-y-2">
                        <label htmlFor="weight" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Body Weight</label>
                        <div className="flex items-center gap-4">
                            <input
                                id="weight"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full text-4xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-indigo-600 outline-none bg-transparent transition-colors py-2"
                            />
                            <div className="flex bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setIsLbs(true)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isLbs ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    lbs
                                </button>
                                <button
                                    onClick={() => setIsLbs(false)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!isLbs ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    kg
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Goal Input */}
                    <div className="space-y-2">
                        <label htmlFor="proteinGoal" className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Daily Protein Goal</label>
                        <div className="flex items-center gap-2">
                            <input
                                id="proteinGoal"
                                type="number"
                                value={customGoal || ''}
                                placeholder={getAutoGoal()}
                                onChange={(e) => setCustomGoal(e.target.value)}
                                className={`w-full text-4xl font-bold border-b-2 outline-none bg-transparent transition-colors py-2 ${customGoal ? 'text-indigo-600 border-indigo-200' : 'text-gray-400 border-gray-200'}`}
                            />
                            <span className="text-xl font-medium text-gray-400 mb-1">g</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            {customGoal ? 'Manual override active' : 'Auto-calculated (1g/lb)'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Selection & Distribution Section */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="bg-pink-500 text-white p-2 rounded-lg text-sm">2</span>
                    Source Distribution
                </h2>

                <div className="mb-8 overflow-x-auto">
                    <div className="flex gap-4 pb-4">
                        {proteinSources.map(source => (
                            <button
                                key={source.id}
                                onClick={() => handleSourceToggle(source.id)}
                                className={`
                                    flex-shrink-0 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200
                                    ${selectedIds.includes(source.id)
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'}
                                `}
                            >
                                {source.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {selectedIds.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">Select at least one protein source above.</p>
                    ) : (
                        selectedIds.map(id => {
                            const source = proteinSources.find(s => s.id === id);
                            const val = distributions[id] || 0;
                            return (
                                <div key={id} className="flex items-center gap-6 animate-fadeIn">
                                    <div className="w-32 font-medium text-gray-700">{source.name}</div>
                                    <div className="flex-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={val}
                                            onChange={(e) => handleDistChange(id, e.target.value)}
                                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>
                                    <div className="w-16 text-right font-bold text-gray-800 tabular-nums">
                                        {val}%
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Total Validation */}
                {selectedIds.length > 0 && (
                    <div className={`mt-8 p-4 rounded-xl flex items-center justify-between ${isTotal100 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        <div className="font-medium">
                            Total Distribution: <span className="font-bold text-lg">{totalDist}%</span>
                            {!isTotal100 && <span className="ml-2 opacity-75">({100 - totalDist}% remaining)</span>}
                        </div>
                        {!isTotal100 && (
                            <button
                                onClick={normalizeDistributions}
                                className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold border border-amber-200 hover:bg-amber-50 active:scale-95 transition-all"
                            >
                                Auto-Fix
                            </button>
                        )}
                        {isTotal100 && (
                            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-xs font-bold uppercase tracking-wider">Perfect</span>
                        )}
                    </div>
                )}
            </section>

            {/* Results Dashboard */}
            {isTotal100 && selectedIds.length > 0 && (
                <section className="bg-indigo-900 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-[100px] opacity-30 -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <span className="bg-white text-indigo-900 p-2 rounded-lg text-sm">3</span>
                            Your Menu
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedIds.map(id => {
                                const source = proteinSources.find(s => s.id === id);
                                const percentage = distributions[id] || 0;
                                if (percentage === 0) return null;

                                const proteinGoalForSource = currentGoal * (percentage / 100);
                                const gramsOfFood = (proteinGoalForSource / (source.proteinPer100g / 100)); // Total grams of food
                                const ouncesOfFood = gramsOfFood * 0.035274;

                                return (
                                    <div key={id} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
                                        <div className="text-indigo-200 text-sm font-medium mb-1">{source.name}</div>
                                        <div className="text-3xl font-bold mb-1">
                                            {Math.round(gramsOfFood)}<span className="text-lg opacity-60 font-normal">g</span>
                                        </div>
                                        <div className="text-sm opacity-60">
                                            {ouncesOfFood.toFixed(1)} oz
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs opacity-70">
                                            <span>Provides</span>
                                            <span className="font-semibold">{Math.round(proteinGoalForSource)}g Protein</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProteinCalculator;
