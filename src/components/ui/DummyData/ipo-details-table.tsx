export default function IpoDetailsTable() {
    return (
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">IPO Date</td>
              <td className="px-4 py-3 text-sm text-gray-700">February 12, 2025 to February 14, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Listing Date</td>
              <td className="px-4 py-3 text-sm text-gray-700">February 19, 2025</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Face Value</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1 per share</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Issue Price</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹708 per share</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Lot Size</td>
              <td className="px-4 py-3 text-sm text-gray-700">21 Shares</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Total Issue Size</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                12,35,87,570 shares
                <br />
                (aggregating up to ₹8,750.00 Cr)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Offer for Sale</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                12,35,87,570 shares of ₹1
                <br />
                (aggregating up to ₹8,750.00 Cr)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Employee Discount</td>
              <td className="px-4 py-3 text-sm text-gray-700">67.00</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Issue Type</td>
              <td className="px-4 py-3 text-sm text-gray-700">Book Built Issue IPO</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Listing At</td>
              <td className="px-4 py-3 text-sm text-gray-700">BSE, NSE</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  
  