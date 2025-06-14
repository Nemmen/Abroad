import React, { useState } from 'react';

// Custom Tab Panel component
function TabPanel({ children, value, index }) {
  return (
    <div
      className={`${value !== index ? 'hidden' : ''} pt-4`}
      role="tabpanel"
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
    >
      {children}
    </div>
  );
}

export default function AgentDetailView({ agent = {}, formatCurrency = (val) => val }) {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Safely ensure agent object exists with default values
  const safeAgent = agent || {};
  const summary = safeAgent.summary || {};
  const gicEntries = safeAgent.gicEntries || [];
  const forexEntries = safeAgent.forexEntries || [];
  const students = safeAgent.students || [];
  
  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Prepare monthly data for visualization
  const monthlyData = Array.isArray(safeAgent.monthlyBreakdown) 
    ? safeAgent.monthlyBreakdown.map(item => ({
        name: item.month || "",
        gic: item.gicCount || 0,
        forex: item.forexCount || 0,
        total: (item.gicCount || 0) + (item.forexCount || 0)
      }))
    : [];
  
  // Find the maximum value for scaling the chart
  const maxTransactions = monthlyData.length > 0 
    ? Math.max(...monthlyData.map(item => Math.max(item.total, 1)), 1)
    : 10;

  return (
    <div>
      {/* Agent Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{safeAgent.name || "Unknown Agent"}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    safeAgent.userStatus === 'active' ? 'bg-green-100 text-green-800' : 
                    safeAgent.userStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {(safeAgent.userStatus || "UNKNOWN").toUpperCase()}
                  </span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{safeAgent.email || "N/A"}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{safeAgent.phoneNumber || "N/A"}</span>
              </div>
              
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>
                  {safeAgent.city && safeAgent.state 
                    ? `${safeAgent.city}, ${safeAgent.state}` 
                    : (safeAgent.city || safeAgent.state || "N/A")}
                </span>
              </div>
              
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4z" clipRule="evenodd" />
                </svg>
                <span>{safeAgent.organization || "N/A"}</span>
              </div>
              
              <hr className="my-4" />
              
              <span className="text-xs text-gray-500">
                Registered on: {formatDate(safeAgent.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg shadow p-6 h-full">
              <h4 className="text-sm text-gray-600 font-medium mb-1">Total Transactions</h4>
              <div className="text-2xl font-bold">{summary.totalTransactions || 0}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  GIC: {summary.totalGIC || 0}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Forex: {summary.totalForex || 0}
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg shadow p-6 h-full">
              <h4 className="text-sm text-gray-600 font-medium mb-1">Total Commission</h4>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalCommission || 0)}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  GIC: {formatCurrency(summary.gicCommissions || 0)}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Forex: {formatCurrency(summary.forexCommissions || 0)}
                </span>
              </div>
            </div>
            
            {/* Monthly Data Visualization */}
            <div className="bg-purple-50 rounded-lg shadow p-6 col-span-1 sm:col-span-2">
              <h3 className="text-base font-semibold mb-4">Monthly Transaction History</h3>
              
              {monthlyData.length > 0 ? (
                <div>
                  {/* Legend */}
                  <div className="flex justify-end mb-2">
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-600 rounded mr-1"></div>
                        <span className="text-sm">GIC</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-600 rounded mr-1"></div>
                        <span className="text-sm">Forex</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="grid grid-cols-[120px_1fr] gap-4 max-h-[300px] overflow-y-auto pr-1">
                    {monthlyData.map((item, index) => (
                      <React.Fragment key={index}>
                        <div className="py-1">
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">Total: {item.total}</div>
                        </div>
                        <div className="py-1">
                          <div className="space-y-2">
                            <div className="flex items-center w-full">
                              <div className="flex-grow">
                                <div className="relative h-[10px] bg-purple-100 rounded">
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-purple-600 rounded" 
                                    style={{ width: `${maxTransactions > 0 ? (item.gic / maxTransactions) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="ml-2 text-xs font-medium w-[30px]">{item.gic}</span>
                            </div>
                            
                            <div className="flex items-center w-full">
                              <div className="flex-grow">
                                <div className="relative h-[10px] bg-green-100 rounded">
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-green-600 rounded" 
                                    style={{ width: `${maxTransactions > 0 ? (item.forex / maxTransactions) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="ml-2 text-xs font-medium w-[30px]">{item.forex}</span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No monthly data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Tabs */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            {[
              `GIC Transactions (${gicEntries.length})`,
              `Forex Transactions (${forexEntries.length})`,
              `Students (${students.length})`
            ].map((label, index) => (
              <button
                key={index}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  tabValue === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setTabValue(index)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* GIC Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="bg-white rounded-lg">
            {gicEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank/Vendor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gicEntries.map((entry, idx) => (
                      <tr key={entry?._id || `gic-entry-${idx}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry?.studentRef?.name || entry?.studentName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(entry?.accOpeningDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{entry?.bankVendor || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(entry?.commissionAmt || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            entry?.commissionStatus === "Paid" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry?.commissionStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                <p>No GIC transactions found for this agent.</p>
              </div>
            )}
          </div>
        </TabPanel>
        
        {/* Forex Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="bg-white rounded-lg">
            {forexEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forexEntries.map((entry, idx) => (
                      <tr key={entry?._id || `forex-entry-${idx}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry?.studentRef?.name || entry?.studentName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(entry?.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry?.currencyBooked || "N/A"}
                          {entry?.country && ` (${entry?.country})`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(entry?.amount || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(entry?.agentCommission || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            entry?.commissionStatus === "Paid" 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry?.commissionStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                <p>No Forex transactions found for this agent.</p>
              </div>
            )}
          </div>
        </TabPanel>
        
        {/* Students Tab */}
        <TabPanel value={tabValue} index={2}>
          <div className="bg-white rounded-lg">
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport No.</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, idx) => (
                      <tr key={student?._id || `student-${idx}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{student?.name || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{student?.email || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{student?.passportNo || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                <p>No students found for this agent.</p>
              </div>
            )}
          </div>
        </TabPanel>
      </div>
    </div>
  );
}