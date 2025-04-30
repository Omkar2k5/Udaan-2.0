from fastapi import FastAPI, HTTPException
from typing import Optional
import json
from fastapi import Query
app = FastAPI()

# Load data once at startup
with open("cleaned_uddan_dataset.json", "r", encoding="utf-8") as f:
    dataset = json.load(f)

@app.get("/")
def root():
    return {"message": "Welcome to the Uddan Dataset API!"}

@app.get("/property/{property_id}")
def get_property_by_id(property_id: str):
    data_map = dataset.get("Datalink", {}).get("property_id_map", {})
    if property_id in data_map:
        return data_map[property_id]
    raise HTTPException(status_code=404, detail="Property ID not found")

@app.get("/rural")
def get_rural_data(district: Optional[str] = None):
    rural_data = dataset.get("output", {}).get("rural-output", [])
    if district:
        filtered = [item for item in rural_data if item.get("District") == district]
        return filtered
    return rural_data

@app.get("/urban")
def get_urban_data(year: Optional[int] = None):
    urban_data = dataset.get("output", {}).get("urban-outout", [])
    if year:
        filtered = [item for item in urban_data if item.get("Registration Year") == year]
        return filtered
    return urban_data


app.get("/search/urban")

