export default function IpoLotSizeTable() {
    return (
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lots
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shares
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">Retail</td>
              <td className="px-4 py-3 text-sm text-gray-700">1</td>
              <td className="px-4 py-3 text-sm text-gray-700">21</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹14,868</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">Retail</td>
              <td className="px-4 py-3 text-sm text-gray-700">2</td>
              <td className="px-4 py-3 text-sm text-gray-700">42</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹29,736</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">HNI (Minimum)</td>
              <td className="px-4 py-3 text-sm text-gray-700">14</td>
              <td className="px-4 py-3 text-sm text-gray-700">294</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹2,08,152</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">NHIL (Minimum)</td>
              <td className="px-4 py-3 text-sm text-gray-700">68</td>
              <td className="px-4 py-3 text-sm text-gray-700">1,428</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹10,11,024</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  
  