import React from 'react';
import { TradeLogEntry } from '../types';
import { ShieldIcon, AlertTriangleIcon } from './IconComponents';

const ReportExporter: React.FC<{ data: TradeLogEntry[] }> = ({ data }) => {
    const exportCSV = () => {
        const headers = "ID,Timestamp,Bond,Wallet,KYC,Type,Amount,Price,Value,Flags\n";
        const rows = data.map(log => 
            `${log.id},${log.timestamp},${log.bondSymbol},${log.walletAddress},${log.kycStatus},${log.type},${log.amount},${log.price},${log.value},"${log.flags.join(', ')}"`
        ).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'compliance_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
         <button onClick={exportCSV} className="px-4 py-2 text-sm font-medium rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition-colors">
            Export as CSV
        </button>
    );
};


const ComplianceDashboard: React.FC<{ tradeLog: TradeLogEntry[] }> = ({ tradeLog }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-brand-text-primary mb-2 flex items-center"><ShieldIcon /> <span className="ml-2">Regulatory Compliance Dashboard</span></h2>
        <p className="text-brand-text-secondary">Real-time monitoring of all platform trading activity for regulatory oversight.</p>
      </div>

       <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Immutable Trade Log</h3>
          <ReportExporter data={tradeLog} />
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className="border-b border-brand-border">
                  <tr>
                      <th className="py-2 font-medium text-brand-text-secondary">Trade ID</th>
                      <th className="py-2 font-medium text-brand-text-secondary">Timestamp</th>
                      <th className="py-2 font-medium text-brand-text-secondary">Bond</th>
                      <th className="py-2 font-medium text-brand-text-secondary">Wallet Address</th>
                      <th className="py-2 font-medium text-brand-text-secondary">KYC</th>
                      <th className="py-2 font-medium text-brand-text-secondary text-right">Value (USD)</th>
                      <th className="py-2 font-medium text-brand-text-secondary text-center">Alerts</th>
                  </tr>
              </thead>
              <tbody>
                  {tradeLog.map(log => (
                      <tr key={log.id} className="border-b border-brand-border/50 hover:bg-brand-surface/50">
                          <td className="py-3 font-mono text-xs">{log.id}</td>
                          <td className="py-3">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-3 font-semibold">{log.bondSymbol}</td>
                          <td className="py-3 font-mono text-xs">{log.walletAddress}</td>
                          <td className="py-3">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  log.kycStatus === 'Verified' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>{log.kycStatus}</span>
                          </td>
                          <td className={`py-3 font-mono text-right ${log.type === 'BID' ? 'text-green-400' : 'text-red-400'}`}>
                              {log.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </td>
                          <td className="py-3 text-center">
                            {log.flags.length > 0 && (
                                <div className="flex justify-center items-center" title={log.flags.join(', ')}>
                                    <AlertTriangleIcon />
                                </div>
                            )}
                          </td>
                      </tr>
                  ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
