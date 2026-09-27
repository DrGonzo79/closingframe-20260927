import json
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

DATA=json.loads((Path(__file__).parent.parent/"data"/"demo.json").read_text())
app=FastAPI(title="ClosingFrame demo API",version="0.1.0")

class AttributionRequest(BaseModel):
    listing_id: str=Field(min_length=3,max_length=20,pattern=r"^[A-Z0-9-]+$")
    window_days: int=Field(ge=7,le=90)
    model: Literal["balanced","outcomes","reach"]="balanced"

def build_attribution(item:AttributionRequest):
    listing=next((row for row in DATA["listings"] if row["id"]==item.listing_id),None)
    if not listing:
        raise HTTPException(status_code=404,detail="Listing not found")
    videos=[row for row in DATA["videos"] if row["listingId"]==item.listing_id]
    events=[row for row in DATA["events"] if row["listingId"]==item.listing_id and row["daysAfter"]<=item.window_days]
    if not events:
        raise HTTPException(status_code=409,detail="No linked outcomes inside attribution window")
    model_weight={"balanced":1.0,"outcomes":1.45,"reach":0.65}[item.model]
    rows=[]
    for video in videos:
        outcomes=[event for event in events if event["videoId"]==video["id"]]
        event_value=sum(12 if event["type"]=="close" else 4 if event["type"]=="showing" else 1 for event in outcomes)
        engagement=video["saves"]/video["views"]*100
        rows.append({"video_id":video["id"],"title":video["title"],"outcomes":len(outcomes),"score":min(99,round(event_value*9*model_weight+engagement*6))})
    rows.sort(key=lambda row:row["score"],reverse=True)
    return {"listing_id":listing["id"],"window_days":item.window_days,"leads":sum(e["type"]=="lead" for e in events),"showings":sum(e["type"]=="showing" for e in events),"attributed_revenue":sum(e["value"] for e in events if e["type"]=="close"),"confidence":min(96,58+len(events)*7),"ranked_videos":rows,"demo":True}

@app.get("/health")
def health(): return {"status":"ok"}

@app.post("/attribution")
def attribution(item:AttributionRequest): return build_attribution(item)
