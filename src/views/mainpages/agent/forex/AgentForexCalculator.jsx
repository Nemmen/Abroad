import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Custom useDebounce hook
const useDebounce = (callback, delay, deps = []) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [...deps]);
};

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token_auth');
};

// Configure axios with auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};

// API base URL - use local test server
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app';

// Currency options with symbols
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($) - US Dollar', symbol: '$' },
  { value: 'AUD', label: 'AUD ($) - Australian Dollar', symbol: 'A$' },
  { value: 'CAD', label: 'CAD ($) - Canadian Dollar', symbol: 'C$' },
  { value: 'GBP', label: 'GBP (£) - British Pound', symbol: '£' },
  { value: 'EUR', label: 'EUR (€) - Euro', symbol: '€' },
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham', symbol: 'د.إ' },
  { value: 'MYR', label: 'MYR (RM) - Malaysian Ringgit', symbol: 'RM' },
];

// Get currency symbol by code
const getCurrencySymbol = (code) => {
  const currency = CURRENCY_OPTIONS.find(c => c.value === code);
  return currency ? currency.symbol : '';
};

// Format currency
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const AgentForexCalculator = () => {
  // Inputs
  const [currencyType, setCurrencyType] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState(10000);
  const [agentMargin, setAgentMargin] = useState(0.35);

  // IBR
  const [ibrRate, setIbrRate] = useState(83.0);
  const [isRateLoading, setIsRateLoading] = useState(false);

  // Quote
  const [calculationResult, setCalculationResult] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Request submit
  const [contactInfo, setContactInfo] = useState('');
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(null);

  // Tabs
  const [tab, setTab] = useState(0);

  // Debounce currency change for IBR fetch
  const debouncedRef = useRef(null);
  useEffect(() => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      fetchIbrRate(currencyType);
    }, 400);
    return () => clearTimeout(debouncedRef.current);
  }, [currencyType]);

  const fetchIbrRate = async (currency) => {
    setIsRateLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/forex/get-rate/${currency}`);
      if (res?.data?.rate) setIbrRate(Number(res.data.rate));
    } catch (err) {
      console.debug('IBR fetch failed:', err?.message || err);
    } finally {
      setIsRateLoading(false);
    }
  };

  const handleNumberInput = (setter) => (e) => {
    const v = e.target.value;
    if (v === '' || !isNaN(v)) setter(v === '' ? '' : Number(v));
  };

  const getAgentQuoteAPI = async () => {
    setErrorMessage(null);
    setIsQuoteLoading(true);
    try {
      const payload = { currencyType, foreignAmount: Number(foreignAmount), agentMargin: Number(agentMargin) };
      const res = await axios.post(`${API_BASE_URL}/api/forex/agent/quote`, payload, getAuthHeaders());
      if (res.data && res.data.success && res.data.quote) {
        setCalculationResult(res.data.quote);
      } else {
        setCalculationResult(null);
        setErrorMessage(res?.data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('Agent quote error:', err?.response?.data || err.message || err);
      setErrorMessage((err?.response?.data && err.response.data.message) ? err.response.data.message : 'Failed to fetch quote');
      setCalculationResult(null);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const submitForexRequest = async () => {
    setReqSuccess(null);
    setReqLoading(true);
    setErrorMessage(null);
    try {
      const payload = { currencyType, foreignAmount: Number(foreignAmount), contactInfo };
      const res = await axios.post(`${API_BASE_URL}/api/forex/request`, payload, getAuthHeaders());
      if (res.data && res.data.success) {
        setReqSuccess(true);
      } else {
        setReqSuccess(false);
        setErrorMessage(res?.data?.message || 'Request failed');
      }
    } catch (err) {
      console.error('Request submit error:', err?.response?.data || err.message || err);
      setReqSuccess(false);
      setErrorMessage((err?.response?.data && err.response.data.message) ? err.response.data.message : 'Failed to submit request');
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Agent Quick Quote</h3>
            <p className="text-sm text-slate-500">Minimal inputs — get an official quote from the test API (local).</p>
          </div>
          <button
            title={"Guide: Select currency, enter foreign amount and your agent margin (optional). Click 'Get Quote' to fetch the official quote. Response includes effectiveRate, inrAmount, serviceCharge (base,gst,total) and tcs info if applicable."}
            className="ml-2 text-sm text-slate-400 hover:text-slate-600"
          >
            ℹ️
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab(0)} className={`${tab === 0 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'} px-4 py-2 rounded-md`}>Calculator</button>
          <button onClick={() => setTab(1)} className={`${tab === 1 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'} px-4 py-2 rounded-md`}>Request Submit</button>
        </div>

        {tab === 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Currency</label>
                <select value={currencyType} onChange={(e) => setCurrencyType(e.target.value)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2">
                  {CURRENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Foreign Amount</label>
                <input type="number" value={foreignAmount} onChange={handleNumberInput(setForeignAmount)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Agent Margin (₹ or paise)</label>
                <input type="number" value={agentMargin} onChange={handleNumberInput(setAgentMargin)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2" />
                <p className="text-xs text-slate-500 mt-1">Enter 0.35 for ₹0.35 or 35 for 35 paise (server heuristic)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">IBR (info)</label>
                <div className="flex gap-2 mt-1">
                  <input value={ibrRate} readOnly className="flex-1 border-gray-200 rounded-md shadow-sm p-2 bg-gray-50" />
                  <button onClick={() => fetchIbrRate(currencyType)} className="px-3 rounded-md bg-sky-600 text-white" disabled={isRateLoading}>{isRateLoading ? '...' : 'Refresh'}</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={getAgentQuoteAPI} className="px-4 py-2 bg-green-600 text-white rounded-md" disabled={isQuoteLoading}>{isQuoteLoading ? 'Loading...' : 'Get Quote'}</button>
              <button onClick={() => { setCalculationResult(null); setErrorMessage(null); }} className="px-4 py-2 border rounded-md">Clear</button>
            </div>

            {errorMessage && <div className="mt-3 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md">{errorMessage}</div>}

            {calculationResult && (
              <div className="mt-4 p-4 bg-slate-50 border rounded-md grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800">
                <div>
                  <div className="text-xs text-slate-500">Effective Rate</div>
                  <div className="text-lg font-semibold">₹{calculationResult.effectiveRate}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">INR Amount</div>
                  <div className="text-lg font-semibold">{formatCurrency(calculationResult.inrAmount)}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Service Charge (total)</div>
                  <div className="text-md font-semibold">{formatCurrency(calculationResult.serviceCharge?.total)}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">TCS</div>
                  <div className="text-md">{calculationResult.tcs?.applicable ? `₹${calculationResult.tcs?.amount} (${(calculationResult.tcs?.rate || 0) * 100}%)` : 'Not applicable'}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Submit a forex request to admin. Fill minimal info and click Submit.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Currency</label>
                <select value={currencyType} onChange={(e) => setCurrencyType(e.target.value)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2">
                  {CURRENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Amount</label>
                <input type="number" value={foreignAmount} onChange={handleNumberInput(setForeignAmount)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Contact info (phone/email)</label>
                <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={submitForexRequest} className="px-4 py-2 bg-sky-600 text-white rounded-md" disabled={reqLoading}>{reqLoading ? 'Submitting...' : 'Submit Request'}</button>
              <button onClick={() => { setReqSuccess(null); setErrorMessage(null); setContactInfo(''); }} className="px-4 py-2 border rounded-md">Clear</button>
            </div>

            {reqSuccess === true && <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-md">Request submitted successfully.</div>}
            {reqSuccess === false && errorMessage && <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-md">{errorMessage}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentForexCalculator;