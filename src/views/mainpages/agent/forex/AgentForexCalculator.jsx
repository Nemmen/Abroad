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
    },
  };
};

// API base URL - use local test server
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app';

// Base margin (₹0.20 added to IBR to get adjusted IBR)
const BASE_MARGIN = 0.15;

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
  const currency = CURRENCY_OPTIONS.find((c) => c.value === code);
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
  const [pmMargin, setPmMargin] = useState(0.35); // Agent's PM margin (agent-controlled)
  

  // IBR
  const [ibrRate, setIbrRate] = useState(83.0);
  const [isRateLoading, setIsRateLoading] = useState(false);

  // AE Margin (fetched from backend, not shown to agent)
  const [aeMargin, setAeMargin] = useState(0);

  // Local calculation (displayed rate = IBR + ₹0.20 + AE margin + PM margin)
  // Note: AE margin is NOT shown separately to agent - only included in final calculation
  const [displayedRate, setDisplayedRate] = useState(0);

  // Quote
  const [calculationResult, setCalculationResult] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Request submission status (merged with Get Quote)
  const [reqSuccess, setReqSuccess] = useState(null);

  // Fetch AE margin from backend on mount (for preview calculation)
  // Note: The actual quote from API will use the server-side AE margin
  useEffect(() => {
    const fetchAeMargin = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/forex/admin/ae-margin`,
          getAuthHeaders(),
        );
        if (response.data && response.data.success && response.data.data) {
          setAeMargin(parseFloat(response.data.data.aeMargin) || 0);
        }
      } catch (error) {
        // If agent can't access admin endpoint, default to 0 for preview
        // The actual quote API will use the correct AE margin on the backend
        console.debug(
          'AE margin fetch failed (expected for non-admin):',
          error?.message,
        );
        setAeMargin(0);
      }
    };
    fetchAeMargin();
  }, []);

  // Calculate displayed rate whenever inputs change
  // Rate = (IBR + ₹0.20) + PM margin (0.10) + Agent's margin
  useEffect(() => {
    const adjustedIbr = Number(ibrRate) + BASE_MARGIN; // IBR + 0.20
    const calculatedRate = adjustedIbr + aeMargin + Number(pmMargin || 0);
    setDisplayedRate(calculatedRate);
  }, [ibrRate, pmMargin, aeMargin]);

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
      const res = await axios.get(
        `${API_BASE_URL}/api/forex/get-rate/${currency}`,
      );
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

  // Combined function: Get Quote AND Submit Request in one action
  const getQuoteAndSubmit = async () => {
    setErrorMessage(null);
    setReqSuccess(null);
    setIsQuoteLoading(true);

    try {
      const effectiveRate = Number(displayedRate) || 0;
      const fxAmount = Number(foreignAmount) || 0;

      const inrAmount = effectiveRate * fxAmount;
      const gst =
        inrAmount <= 100000
          ? inrAmount * 0.0018
          : 100000 * 0.0018 + (inrAmount - 100000) * 0.0009;
      const serviceChargeBase = 590;
      const tcsAmount = inrAmount > 1000000 ? (inrAmount - 1000000) * 0.05 : 0;
      const grandTotal = inrAmount + gst + serviceChargeBase + tcsAmount;

      // Submit the forex request to the API
      const requestPayload = {
        currencyType,
        ibr: effectiveRate,
        indianAmount: grandTotal,
        foreignAmount: fxAmount,
        agentMargin: Number(pmMargin) || 0, // Send agent's PM margin to backend
      };
      const response = await axios.post(
        `${API_BASE_URL}/api/forex/request`,
        requestPayload,
        getAuthHeaders(),
      );

      if (response.data && response.data.success) {
        // Request was successful
        setReqSuccess(true);

        // If the API returns quote data, use it; otherwise calculate locally
        if (response.data.quote) {
          setCalculationResult(response.data.quote);
        } else {
          // Calculate locally for display since API doesn't return quote details
          setCalculationResult({
            effectiveRate: effectiveRate.toFixed(2),
            inrAmount: inrAmount,
            serviceCharge: {
              base: serviceChargeBase,
              gst: gst,
              total: serviceChargeBase + gst,
            },
            tcs: {
              applicable: tcsAmount > 0,
              amount: tcsAmount,
              rate: 0.05,
            },
          });
        }
      } else {
        setCalculationResult(null);
        setReqSuccess(false);
        setErrorMessage(response?.data?.message || 'Request failed');
      }
    } catch (err) {
      console.error(
        'Agent request error:',
        err?.response?.data || err.message || err,
      );
      setErrorMessage(
        err?.response?.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to submit request',
      );
      setCalculationResult(null);
      setReqSuccess(false);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Agent Forex Calculator
            </h3>
            <p className="text-sm text-slate-500">
              Get a quote and submit request in one click.
            </p>
          </div>
          <button
            title={
              "Guide: Select currency, enter foreign amount and your PM margin. Click 'Book Now' to calculate the quote and submit the request automatically."
            }
            className="ml-2 text-sm text-slate-400 hover:text-slate-600"
          >
            ℹ️
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Currency
              </label>
              <select
                value={currencyType}
                onChange={(e) => setCurrencyType(e.target.value)}
                className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2"
              >
                {CURRENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Foreign Amount
              </label>
              <input
                type="number"
                value={foreignAmount}
                onChange={handleNumberInput(setForeignAmount)}
                className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Your Margin (₹)
              </label>
              <input
                type="number"
                value={pmMargin}
                onChange={handleNumberInput(setPmMargin)}
                className="mt-1 block w-full border-gray-200 rounded-md shadow-sm p-2"
                step="0.01"
              />
              <p className="text-xs text-slate-500 mt-1">
                Your margin per unit (e.g., 0.35 for ₹0.35)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Live IBR rate
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  value={`₹${(Number(ibrRate) + BASE_MARGIN + aeMargin).toFixed(
                    2,
                  )}`}
                  readOnly
                  className="flex-1 border-gray-200 rounded-md shadow-sm p-2 bg-gray-50 font-semibold text-blue-700"
                />
                <button
                  onClick={() => fetchIbrRate(currencyType)}
                  className="px-3 rounded-md bg-sky-600 text-white"
                  disabled={isRateLoading}
                >
                  {isRateLoading ? '...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Calculation Preview - 2 Column Layout */}
          {(() => {
            const inrConverted = displayedRate * Number(foreignAmount);
            // GST calculation: 0.18% for first 1L, then 0.09% for rest
            const gst =
              inrConverted <= 100000
                ? inrConverted * 0.0018
                : 100000 * 0.0018 + (inrConverted - 100000) * 0.0009;
            const serviceCharge = 590;
            // TCS: 5% on amounts over 10 lakhs
            const tcs =
              inrConverted > 1000000 ? (inrConverted - 1000000) * 0.05 : 0;
            const grandTotal = inrConverted + gst + serviceCharge + tcs;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column - Rate & Conversion */}
                <div className="space-y-4">
                  {/* New Currency Rate */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg h-full">
                    <div className="text-sm font-medium text-slate-600 mb-1">
                      New Currency Rate
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{displayedRate.toFixed(2)}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                        1 {currencyType} = ₹{displayedRate.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      IBR (
                      {(Number(ibrRate) + BASE_MARGIN + aeMargin).toFixed(2)})+
                      Your Margin ({pmMargin})
                    </div>

                    {/* INR Converted */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="text-sm font-medium text-slate-600 mb-1">
                        INR Converted Amount
                      </div>
                      <div className="text-xl font-bold text-slate-800">
                        {formatCurrency(inrConverted)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {foreignAmount} {currencyType} ×{' '}
                        {displayedRate.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Grand Total & Charges */}
                <div className="space-y-4">
                  {/* Grand Total */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-1">
                      Grand Total (INR)
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(grandTotal)}
                    </div>
                    <div className="text-sm text-slate-500">
                      Total amount including all charges
                    </div>

                    {/* Equivalent in Foreign Currency */}
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="text-sm font-medium text-slate-600 mb-1">
                        Equivalent in {currencyType}
                      </div>
                      <div className="text-xl font-bold text-purple-600">
                        {getCurrencySymbol(currencyType)}
                        {(grandTotal / displayedRate).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Additional Charges */}
                  <div className="text-sm font-medium text-slate-600">
                    Additional Charges
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white border border-slate-200 rounded-lg p-2">
                      <div className="text-xs text-slate-500">GST</div>
                      <div className="text-sm font-bold text-slate-800">
                        {formatCurrency(gst)}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-2">
                      <div className="text-xs text-slate-500">Service</div>
                      <div className="text-sm font-bold text-slate-800">
                        {formatCurrency(serviceCharge)}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-2">
                      <div className="text-xs text-slate-500">TCS</div>
                      <div className="text-sm font-bold text-slate-800">
                        {formatCurrency(tcs)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={getQuoteAndSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              disabled={isQuoteLoading}
            >
              {isQuoteLoading ? 'Processing...' : 'Book Now'}
            </button>
            <button
              onClick={() => {
                setCalculationResult(null);
                setErrorMessage(null);
                setReqSuccess(null);
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          {reqSuccess === true && (
            <div className="mt-3 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md">
              ✓ Quote generated and request submitted successfully!
            </div>
          )}

          {/* <div> {calculationResult && (
            <div className="mt-4 p-4 bg-slate-50 border rounded-md text-slate-800">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Calculation Results</h4>
              
             
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-3">
                <div className="text-xs text-slate-500">New Currency Rate</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">₹{calculationResult.effectiveRate}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">1 {currencyType} = ₹{calculationResult.effectiveRate}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">IBR ({(Number(ibrRate) + BASE_MARGIN + aeMargin).toFixed(2)}) + Your Margin ({pmMargin})</div>
              </div>

        
              <div className="p-3 bg-white border border-slate-200 rounded-md mb-3">
                <div className="text-xs text-slate-500">INR Converted Amount</div>
                <div className="text-xl font-bold text-slate-800">{formatCurrency(calculationResult.inrAmount)}</div>
                <div className="text-xs text-slate-500 mt-1">{foreignAmount} {currencyType} × {calculationResult.effectiveRate}</div>
              </div>

             
              <div className="text-sm font-medium text-slate-600 mb-2">Additional Charges</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 bg-white border border-slate-200 rounded-md">
                  <div className="text-xs text-slate-500">GST</div>
                  <div className="text-md font-semibold">{formatCurrency(calculationResult.serviceCharge?.gst || 0)}</div>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-md">
                  <div className="text-xs text-slate-500">Service Charge</div>
                  <div className="text-md font-semibold">{formatCurrency(calculationResult.serviceCharge?.base || 590)}</div>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-md col-span-2">
                  <div className="text-xs text-slate-500">TCS (&gt;10L)</div>
                  <div className="text-md font-semibold">
                    {calculationResult.tcs?.applicable 
                      ? `${formatCurrency(calculationResult.tcs?.amount)} (${(calculationResult.tcs?.rate || 0) * 100}%)` 
                      : 'Not Applicable'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
                <div className="text-xs text-slate-500">Grand Total (INR)</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    (calculationResult.inrAmount || 0) + 
                    (calculationResult.serviceCharge?.total || 0) + 
                    (calculationResult.tcs?.applicable ? calculationResult.tcs?.amount : 0)
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">Total amount including all charges</div>
              </div>

        
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="text-xs text-slate-500">Equivalent in {currencyType}</div>
                <div className="text-xl font-bold text-purple-600">
                  {getCurrencySymbol(currencyType)}{(
                    ((calculationResult.inrAmount || 0) + 
                    (calculationResult.serviceCharge?.total || 0) + 
                    (calculationResult.tcs?.applicable ? calculationResult.tcs?.amount : 0)) / 
                    calculationResult.effectiveRate
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          )}</div> */}
        </div>
      </div>
    </div>
  );
};

export default AgentForexCalculator;
