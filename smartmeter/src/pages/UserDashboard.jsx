import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";
import UsageChart from "../components/UsageChart";

const UserDashboard = () => {

  const [homePower, setHomePower] = useState(0);
  const [rate] = useState(6.5);
  const [status, setStatus] = useState("NORMAL");
  const [units, setUnits] = useState(0);
  const [chartData, setChartData] = useState([]);

  const lastStatus = useRef("NORMAL");
  const lastTime = useRef(null);

  // 🔥 NEW: Track current day
  const currentDay = useRef(new Date().getDate());

  useEffect(() => {

    const meterRef = ref(db, "meter");

    onValue(meterRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {

        const now = Date.now();
        const today = new Date().getDate();

        // 🔥 RESET AT MIDNIGHT
        if (today !== currentDay.current) {
          setUnits(0);
          setChartData([]);
          currentDay.current = today;
        }

        if (lastTime.current !== null) {
          const timeDiff = (now - lastTime.current) / 1000;
          const power = data.homePower || 0;

          const energy = (power * timeDiff) / 3600000;

          setUnits(prev => {
            const newUnits = prev + energy;

            setChartData(prevData => [
              ...prevData.slice(-6),
              {
                day: new Date().toLocaleTimeString(),
                units: parseFloat(energy.toFixed(5)),
                power: power
              }
            ]);

            return newUnits;
          });
        }

        lastTime.current = now;

        setHomePower(data.homePower || 0);

        const newStatus = data.status || "NORMAL";
        setStatus(newStatus);

        if (
          (newStatus === "THEFT" || newStatus === "TAMPER") &&
          lastStatus.current !== newStatus
        ) {
          const audio = new Audio("/alert.mp3");
          audio.play();
        }

        lastStatus.current = newStatus;
      }
    });

    return () => off(meterRef);

  }, []);

  const cost = (units * rate).toFixed(2);

  const isAlert = status === "THEFT" || status === "TAMPER";

  const statusText =
    status === "THEFT"
      ? "⚠ Theft Detected"
      : status === "TAMPER"
      ? "🚨 Tamper Detected"
      : "✔ System Normal";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">⚡ Smart Energy Control</h1>
          <p className="text-gray-400">Real-time Monitoring System</p>
        </div>

        <div className="text-right">
          <p className="text-green-400 font-semibold">🟢 LIVE</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p className="text-gray-300">⚡ Power</p>
          <h2 className="text-3xl text-cyan-400">{homePower} W</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p className="text-gray-300">📊 Units (Today)</p>
          <h2 className="text-3xl text-yellow-400">
            {units.toFixed(4)} kWh
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p className="text-gray-300">💰 Cost (Today)</p>
          <h2 className="text-3xl text-green-400">
            ₹{cost}
          </h2>
        </div>

      </div>

      {/* STATUS */}
      <div className={`p-6 rounded-2xl mb-8 text-center shadow-lg
        ${isAlert ? "bg-red-600 animate-pulse" : "bg-green-600"}`}>

        <h2 className="text-xl font-bold mb-2">System Status</h2>
        <p className="text-2xl">{statusText}</p>
      </div>

      {/* GRAPH */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl mb-4">📈 Daily Energy Usage</h2>
        <UsageChart data={chartData} />
      </div>

    </div>
  );
};

export default UserDashboard;