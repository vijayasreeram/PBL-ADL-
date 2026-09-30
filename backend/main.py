import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Dict, Any

from app.ml_service.inference import predict_crop_disease

app = FastAPI(
    title="AgriVision Crop Disease Detection API",
    description="Backend API supporting multi-task crop type, disease classification, and severity estimation with Grad-CAM.",
    version="1.0.0"
)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated in-memory storage for scan history
history_db = []

@app.get("/")
def read_root():
    return {"message": "AgriVision AI API is running!"}

@app.post("/api/diagnose")
async def diagnose(file: UploadFile = File(...), field_id: str = Form("FIELD-TN-01")):
    """
    Receives an image, runs multi-task prediction + Grad-CAM, 
    stores result in history, and returns the analysis.
    """
    # Verify file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
        
    try:
        # Read file contents
        contents = await file.read()
        
        # Run inference
        result = predict_crop_disease(contents, file.filename, field_id=field_id)
        
        # Add to local history
        record = {
            "id": len(history_db) + 1,
            "filename": file.filename,
            "field_id": result.get("epidemiological_decision", {}).get("field_id", "FIELD-TN-01"),
            "crop": result["crop"],
            "disease": result["disease"],
            "severity": result["severity"],
            "crop_confidence": result["crop_confidence"],
            "disease_confidence": result["disease_confidence"],
            "days_to_threshold": result.get("epidemiological_decision", {}).get("days_to_threshold", 5),
            "timestamp": "Just Now"
        }
        history_db.insert(0, record)
        
        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/api/history")
def get_history():
    """Returns past diagnoses."""
    return history_db[:20] # Return last 20 records

@app.get("/api/weather-risk")
def get_weather_risk(lat: float = 0.0, lon: float = 0.0):
    """
    Fetches real-time weather using Open-Meteo API (free, no key required)
    and dynamically calculates risk indices for Tamil Nadu & Chennai surrounding crops.
    """
    # Default coordinates (Chennai Region, Tamil Nadu) if none provided
    if lat == 0.0 and lon == 0.0:
        lat, lon = 13.0827, 80.2707
        
    temp = 31.5 # Default fallback for Chennai tropical coastal weather
    humidity = 78.0
    precip = 0.0
    weather_desc = "Warm coastal climate in Chennai region, Tamil Nadu."
    
    try:
        import urllib.request
        import json
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode())
            current = data.get("current", {})
            if current:
                temp = current.get("temperature_2m", temp)
                humidity = current.get("relative_humidity_2m", humidity)
                precip = current.get("precipitation", precip)
                
                # Descriptive text tailored for Chennai & Tamil Nadu coastal weather
                if precip > 0.1:
                    weather_desc = "Rainfall detected in Chennai surrounding belt. High moisture favors sheath blight & fungal blast spore proliferation."
                elif humidity > 80:
                    weather_desc = "High coastal humidity in Tamil Nadu. Highly favorable for Rice Leaf Blast, Sugarcane Red Rot, and Leaf Spot fungi."
                elif temp > 33:
                    weather_desc = "High ambient heat across Chennai belt. Monitor vector whiteflies carrying Yellow Mosaic Virus on pulses & cotton."
                else:
                    weather_desc = "Moderate coastal conditions across Chennai region. Standard baseline monitoring recommended."
    except Exception as e:
        print(f"Error fetching live weather for Chennai: {e}. Reverting to Tamil Nadu baseline metrics.")

    # Calculate dynamic risk indexes for Tamil Nadu & Chennai regional crops
    # 1. Rice Paddy (Leaf Blast / Sheath Blight - Primary TN staple crop: 24-32°C, humidity > 75%)
    rice_score = 0
    if 24 <= temp <= 32: rice_score += 45
    if humidity > 75: rice_score += 45
    if precip > 0.1: rice_score += 10
    rice_score = min(max(rice_score, 15), 98)
    
    # 2. Sugarcane (Red Rot - Major crop in Chengalpattu/Villupuram sugar belt: 26-36°C, humidity > 70%)
    sugarcane_score = 0
    if 25 <= temp <= 36: sugarcane_score += 45
    if humidity > 70: sugarcane_score += 45
    sugarcane_score = min(max(sugarcane_score, 20), 95)

    # 3. Banana (Sigatoka Leaf Spot - Key fruit crop across Tamil Nadu: 25-34°C, humidity > 75%)
    banana_score = 0
    if 24 <= temp <= 34: banana_score += 45
    if humidity > 75: banana_score += 45
    banana_score = min(max(banana_score, 15), 95)
    
    # 4. Blackgram / Pulses (Yellow Mosaic Virus - Vector whitefly activity peaks in warm dry/humid weather)
    blackgram_score = 0
    if temp >= 28: blackgram_score += 45
    if humidity >= 65: blackgram_score += 40
    blackgram_score = min(max(blackgram_score, 15), 95)

    # 5. Onion (Purple Blotch - Cultivated in Tamil Nadu agricultural zones: 20-30°C, humidity > 80%)
    onion_score = 0
    if 20 <= temp <= 32: onion_score += 40
    if humidity > 75: onion_score += 45
    onion_score = min(max(onion_score, 10), 95)

    def get_risk_label(score):
        if score >= 70: return "High"
        if score >= 40: return "Medium"
        return "Low"

    return {
        "region": "Chennai Region, Tamil Nadu",
        "coordinates": f"Latitude: {lat:.4f}° N, Longitude: {lon:.4f}° E",
        "risks": [
          {"crop": "Rice Paddy", "disease": "Leaf Blast / Sheath Blight", "risk": get_risk_label(rice_score), "score": rice_score},
          {"crop": "Sugarcane", "disease": "Red Rot", "risk": get_risk_label(sugarcane_score), "score": sugarcane_score},
          {"crop": "Banana", "disease": "Sigatoka Leaf Spot", "risk": get_risk_label(banana_score), "score": banana_score},
          {"crop": "Blackgram Pulses", "disease": "Yellow Mosaic Virus", "risk": get_risk_label(blackgram_score), "score": blackgram_score},
          {"crop": "Onion", "disease": "Purple Blotch", "risk": get_risk_label(onion_score), "score": onion_score}
        ],
        "weather_summary": {
            "temperature": f"{temp:.1f}°C",
            "humidity": f"{humidity:.0f}%",
            "precipitation_chance": "High probability" if precip > 0.5 else "Low probability",
            "description": weather_desc
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
