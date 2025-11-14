import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';

interface BitcoinData {
  price: number;
  change24h: number;
  lastUpdated: string;
}

function App() {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();

      setBitcoinData({
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        lastUpdated: new Date().toLocaleTimeString(),
      });
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to fetch Bitcoin price');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = bitcoinData ? bitcoinData.change24h >= 0 : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-orange-500 p-4 rounded-full">
            <Bitcoin className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
          Bitcoin Price
        </h1>

        {loading && (
          <div className="text-center text-slate-600">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600">
            {error}
          </div>
        )}

        {bitcoinData && !loading && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-900 mb-2">
                ${bitcoinData.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-sm text-slate-500">USD</div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                  isPositive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isPositive ? '+' : ''}
                  {bitcoinData.change24h.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-slate-500">
              Last updated: {bitcoinData.lastUpdated}
            </div>

            <button
              onClick={fetchBitcoinPrice}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
