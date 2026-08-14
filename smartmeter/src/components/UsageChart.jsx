import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const UsageChart = ({ data }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl mt-6">
      <h2 className="text-cyan-400 mb-4 text-lg">
        Daily Usage (kWh)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="day" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />
          <Bar dataKey="units" fill="#22D3EE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;