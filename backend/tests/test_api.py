from fastapi.testclient import TestClient
import pytest

from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_meta_describes_sample_directory(client):
    response = client.get("/api/meta")
    assert response.status_code == 200
    assert response.json()["scheme_count"] >= 8
    assert response.json()["directory_type"] == "illustrative_sample"


def test_scheme_list_and_detail(client):
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 5
    detail = client.get("/api/schemes/pm-kisan")
    assert detail.status_code == 200
    assert detail.json()["official_url"].startswith("https://")


def test_missing_scheme_is_404(client):
    assert client.get("/api/schemes/not-a-scheme").status_code == 404


def test_match_returns_explanation_and_respects_age(client):
    response = client.post("/api/eligibility/match", json={"age": 17, "state": "Telangana", "gender": "male", "occupation": "student", "annual_income": 100000})
    assert response.status_code == 200
    matches = response.json()
    assert matches
    assert all("reasons" in item and "score" in item for item in matches)
    assert "stand-up-india" not in {item["scheme"]["slug"] for item in matches}


def test_chat_supports_telugu_and_documents_question(client):
    response = client.post("/api/chat", json={"message": "ఏ పత్రాలు అవసరం?", "language": "te"})
    assert response.status_code == 200
    assert "పత్రాలు" in response.json()["reply"]
