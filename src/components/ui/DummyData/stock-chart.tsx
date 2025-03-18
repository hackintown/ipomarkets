"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "8 Feb", price: 720 },
  { date: "9 Feb", price: 740 },
  { date: "10 Feb", price: 760 },
  { date: "11 Feb", price: 750 },
  { date: "12 Feb", price: 770 },
  { date: "13 Feb", price: 780 },
  { date: "14 Feb", price: 790 },
  { date: "15 Feb", price: 785 },
  { date: "16 Feb", price: 795 },
  { date: "17 Feb", price: 799 },
]

export default function StockChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis
          domain={["dataMin - 20", "dataMax + 20"]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip formatter={(value) => [`₹${value}`, "Price"]} labelFormatter={(label) => `Date: ${label}`} />
        <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

