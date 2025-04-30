from fastapi import FastAPI, HTTPException, Query
from typing import Optional
import json

app = FastAPI()

# Load data once at startup
with open("cleaned_uddan_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

@app.get("/")
def root():
    return {"message": "Welcome to the Uddan Dataset API!"}

@app.get("/property/{property_id}")
def get_property_by_id(property_id: str):
    data_map = data.get("Datalink", {}).get("property_id_map", {})
    if property_id in data_map:
        return data_map[property_id]
    raise HTTPException(status_code=404, detail="Property ID not found")

@app.get("/rural")
def get_rural_data(district: Optional[str] = None):
    rural_data = data.get("output", {}).get("rural-output", [])
    if district:
        filtered = [item for item in rural_data if item.get("District") == district]
        return filtered
    return rural_data

@app.get("/urban")
def get_urban_data(year: Optional[int] = None):
    urban_data = data.get("output", {}).get("urban-outout", [])
    if year:
        filtered = [item for item in urban_data if item.get("Registration Year") == year]
        return filtered
    return urban_data

@app.get("/input")
def get_input_data():
    return data.get("input", {})

@app.get("/output")
def get_output_data(category: Optional[str] = None):
    output = data.get("output", {})
    if category:
        if category not in output:
            raise HTTPException(status_code=404, detail=f"{category} not found in output")
        return output[category]
    return output

@app.get("/datalink")
def get_datalink(property_id: Optional[str] = None):
    datalink = data.get("Datalink", {}).get("property_id_map", {})
    if property_id:
        if property_id not in datalink:
            raise HTTPException(status_code=404, detail="Property ID not found")
        return datalink[property_id]
    return datalink

# ✅ THIS is the missing route
@app.get("/search/urban")
def search_urban_properties(
    sro: Optional[str] = Query(None),
    reg_year: Optional[int] = Query(None),
    party_name: Optional[str] = Query(None)
):
    urban_data = data.get("output", {}).get("urban-outout", [])

    def match(item):
        if sro and item.get("SRO") != sro:
            return False
        if reg_year and item.get("Registration Year") != reg_year:
            return False
        if party_name:
            if party_name != item.get("First Party Name") and party_name != item.get("Second Party Name"):
                return False
        return True

    results = [item for item in urban_data if match(item)]
    return results
