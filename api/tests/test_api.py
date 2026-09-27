from fastapi.testclient import TestClient
from main import app

client=TestClient(app)
BASE={"listing_id":"L-104","window_days":30,"model":"balanced"}

def test_health(): assert client.get("/health").json()=={"status":"ok"}

def test_attributes_video_to_close():
    response=client.post("/attribution",json=BASE)
    assert response.status_code==200
    body=response.json()
    assert body["attributed_revenue"]==18840
    assert body["ranked_videos"][0]["video_id"]=="V-1"
    assert body["demo"] is True

def test_shorter_window_excludes_close():
    body=client.post("/attribution",json={**BASE,"window_days":14}).json()
    assert body["attributed_revenue"]==0
    assert body["leads"]==2

def test_unknown_listing_is_named_failure():
    response=client.post("/attribution",json={**BASE,"listing_id":"L-999"})
    assert response.status_code==404
    assert response.json()["detail"]=="Listing not found"

def test_rejects_out_of_range_window():
    assert client.post("/attribution",json={**BASE,"window_days":2}).status_code==422

def test_rejects_unknown_model():
    assert client.post("/attribution",json={**BASE,"model":"magic"}).status_code==422
