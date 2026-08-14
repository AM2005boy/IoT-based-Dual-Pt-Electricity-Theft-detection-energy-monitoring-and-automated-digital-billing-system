import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import UsageChart from "../components/UsageChart";
import jsPDF from "jspdf";

const AdminPanel = () => {

  const [data, setData] = useState({ name: "Kirthi" });
  const [rate, setRate] = useState(6.5);
  const [chartData, setChartData] = useState([]);

  const [dailyUnits, setDailyUnits] = useState(0);
  const [monthlyUnits, setMonthlyUnits] = useState(0);

  const lastTime = useRef(null);

  // ✅ FIXED BILL NUMBER (constant)
  const billNumber = useRef(
    `EB-${new Date().toISOString().slice(0,10)}-${Math.floor(Math.random()*1000)}`
  );

  useEffect(() => {

    const meterRef = ref(db, "meter");

    onValue(meterRef, (snapshot) => {
      const meterData = snapshot.val();

      if (meterData) {

        const now = Date.now();
        const power = meterData.homePower || 0;

        if (lastTime.current !== null) {
          const timeDiff = (now - lastTime.current) / 1000;
          const energy = (power * timeDiff) / 3600000;

          setDailyUnits(prev => prev + energy);
          setMonthlyUnits(prev => prev + energy);

          setChartData(prev => [
            ...prev.slice(-8),
            {
              day: new Date().toLocaleTimeString(),
              units: parseFloat(energy.toFixed(5))
            }
          ]);
        }

        lastTime.current = now;

        setData((prev) => ({
          ...prev,
          ...meterData,
          name: "Kirthi"
        }));
      }
    });

    const fetchData = async () => {
      const tariffSnap = await getDoc(doc(db, "tariff_config", "main"));
      if (tariffSnap.exists()) {
        setRate(tariffSnap.data().current_rate);
      }
    };

    fetchData();

  }, []);

  const dailyBill = (dailyUnits * rate).toFixed(2);
  const monthlyBill = (monthlyUnits * rate).toFixed(2);

  const isAlert =
    data.status === "THEFT" || data.status === "TAMPER";

  const statusText =
    data.status === "THEFT"
      ? "⚠ Theft Detected"
      : data.status === "TAMPER"
      ? "🚨 Tamper Detected"
      : "✔ System Normal";

  // 🔥 REAL EB STYLE PDF
  const downloadPDF = () => {

    const pdf = new jsPDF();

    // HEADER
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("PONDICHERRY ELECTRICITY BOARD", 105, 15, null, null, "center");

    pdf.setFontSize(12);
    pdf.text("Electricity Consumption Bill", 105, 22, null, null, "center");

    pdf.line(15, 25, 195, 25);

    // DETAILS
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(`Consumer Name : Kirthi`, 15, 35);
    pdf.text(`Bill Date : ${new Date().toLocaleDateString()}`, 15, 42);
    pdf.text(`Bill No : ${billNumber.current}`, 15, 49);

    pdf.text(`Tariff : ₹${rate}/unit`, 120, 35);
    pdf.text(`Status : ${data.status}`, 120, 42);

    pdf.line(15, 55, 195, 55);

    // TABLE HEADER
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", 15, 65);
    pdf.text("Units", 120, 65);
    pdf.text("Amount (₹)", 170, 65, null, null, "right");

    pdf.line(15, 68, 195, 68);

    // DATA
    pdf.setFont("helvetica", "normal");

    pdf.text("Daily Consumption", 15, 80);
    pdf.text(dailyUnits.toFixed(2), 120, 80);
    pdf.text((dailyUnits * rate).toFixed(2), 170, 80, null, null, "right");

    pdf.text("Monthly Consumption", 15, 90);
    pdf.text(monthlyUnits.toFixed(2), 120, 90);
    pdf.text(monthlyBill, 170, 90, null, null, "right");

    pdf.line(15, 100, 195, 100);

    // TOTAL
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("TOTAL AMOUNT", 15, 115);
    pdf.text(`₹${monthlyBill}`, 170, 115, null, null, "right");

    pdf.line(15, 120, 195, 120);

    // FOOTER
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      "Please pay before due date to avoid disconnection.",
      105,
      135,
      null,
      null,
      "center"
    );

    pdf.text(
      "This is a system generated bill.",
      105,
      142,
      null,
      null,
      "center"
    );

    pdf.save("EB_Bill.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">⚡ Admin Control Panel</h1>
          <p className="text-gray-400">Energy Monitoring & Billing</p>
        </div>

        <div className="text-right">
          <p className="text-green-400 font-semibold">🟢 LIVE</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p>⚡ Power</p>
          <h2 className="text-3xl text-cyan-400">{data.homePower} W</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p>📉 Loss</p>
          <h2 className="text-3xl text-red-400">{data.loss} W</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <p>💰 Monthly Bill</p>
          <h2 className="text-3xl text-green-400">₹{monthlyBill}</h2>
        </div>

      </div>

      {/* STATUS */}
      <div className={`p-6 rounded-2xl mb-8 text-center
        ${isAlert ? "bg-red-600 animate-pulse" : "bg-green-600"}`}>
        <h2 className="text-xl font-bold mb-2">System Status</h2>
        <p className="text-2xl">{statusText}</p>
      </div>

      {/* BILL + GRAPH */}
      <div className="flex flex-wrap gap-6 items-start">

        {/* BILL */}
        <div className="bg-white text-black p-5 rounded-xl shadow-lg w-80">

          <h3 className="text-center font-bold text-lg mb-2">
            ELECTRICITY BILL
          </h3>

          <hr className="mb-2"/>

          <p className="text-sm">Name: Kirthi</p>
          <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-sm mb-2">Bill No: {billNumber.current}</p>

          <hr className="mb-2"/>

          <p className="text-sm">Daily Units: {dailyUnits.toFixed(2)} kWh</p>
          <p className="text-sm">Monthly Units: {monthlyUnits.toFixed(2)} kWh</p>
          <p className="text-sm">Tariff: ₹{rate}/unit</p>

          <hr className="my-2"/>

          <p className="font-semibold">Daily Charge: ₹{dailyBill}</p>

          <p className="text-lg font-bold text-right">
            Total: ₹{monthlyBill}
          </p>

          <button
            onClick={downloadPDF}
            className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition"
          >
            Download Bill
          </button>

        </div>

        {/* GRAPH */}
        <div className="flex-1 min-w-[300px] bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl mb-4">📈 Usage Trend</h2>
          <UsageChart data={chartData} />
        </div>

      </div>

    </div>
  );
};

export default AdminPanel;