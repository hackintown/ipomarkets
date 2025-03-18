export default function IpoTimelineTable() {
    return (
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">IPO Open Date</td>
              <td className="px-4 py-3 text-sm text-gray-700">Wed, Feb 12, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">IPO Close Date</td>
              <td className="px-4 py-3 text-sm text-gray-700">Fri, Feb 14, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Tentative Allotment</td>
              <td className="px-4 py-3 text-sm text-gray-700">Mon, Feb 17, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Initiation of Refunds</td>
              <td className="px-4 py-3 text-sm text-gray-700">Tue, Feb 18, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Credit of Shares to Demat</td>
              <td className="px-4 py-3 text-sm text-gray-700">Tue, Feb 18, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Tentative Listing Date</td>
              <td className="px-4 py-3 text-sm text-gray-700">Wed, Feb 19, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                Cut-off time for UPI mandate confirmation
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">5 PM on February 14, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  
  