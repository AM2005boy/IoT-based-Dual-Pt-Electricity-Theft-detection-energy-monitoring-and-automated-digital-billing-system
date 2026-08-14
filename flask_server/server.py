from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app)

# -------- Firebase Setup --------
cred = credentials.Certificate("serviceAccountKey.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://meterwebsite-71308-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

# -------- Test Route --------
@app.route('/')
def home():
    return "Flask Server Running"

# -------- ESP Data Route --------
@app.route('/update', methods=['POST'])
def update():
    try:
        # 🔥 FORCE JSON PARSE (IMPORTANT FIX)
        data = request.get_json(force=True)

        print("\n📥 Data received from ESP:")
        print(data)

        if not data:
            return jsonify({"error": "No data received"}), 400

        # 🔥 SAFE EXTRACTION
        home = abs(float(data.get("homePower", 0)))
        trans = abs(float(data.get("transPower", 0)))
        loss = abs(float(data.get("loss", 0)))

        # 🔥 ROUND VALUES
        home = round(home, 1)
        trans = round(trans, 1)
        loss = round(loss, 1)

        # 🔥 STATUS
        status = data.get("status", "NORMAL")

        print("⚡ Status:", status)

        # 🔥 Save to Firebase
        ref = db.reference("meter")

        ref.update({
            "homePower": home,
            "transPower": trans,
            "loss": loss,
            "status": status
        })

        return jsonify({
            "message": "Data stored successfully",
            "status": status
        }), 200

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# -------- Run Server --------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)