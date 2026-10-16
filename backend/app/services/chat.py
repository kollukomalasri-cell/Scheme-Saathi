import os

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Scheme


EN_SUGGESTIONS = ["How do I check eligibility?", "What documents should I prepare?", "Show education schemes"]
TE_SUGGESTIONS = ["అర్హతను ఎలా తనిఖీ చేయాలి?", "ఏ పత్రాలు సిద్ధం చేసుకోవాలి?", "విద్యా పథకాలు చూపించండి"]
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_ENABLED = os.getenv("SCHEME_SAATHI_USE_OLLAMA", "auto").lower() not in {"false", "0", "no", "off"}


def _rule_based_answer(db: Session, message: str, language: str = "en") -> dict:
    text = message.casefold()
    te = language == "te"
    schemes = db.scalars(select(Scheme).where(Scheme.is_active.is_(True))).all()
    if any(word in text for word in ("hello", "hi", "namaste", "నమస్క", "హలో")):
        reply = "నమస్కారం! పథకాలను కనుగొనడం, అర్హత సూచనలు, దరఖాస్తు దశల గురించి అడగండి." if te else "Hello! Ask me about finding schemes, eligibility clues, or application steps."
    elif any(word in text for word in ("document", "documents", "పత్ర", "డాక్యుమెంట్")):
        reply = "అవసరమైన పత్రాలు పథకాన్ని బట్టి మారుతాయి. వివరాల పేజీలోని పత్రాల జాబితాను చూసి, అధికారిక పోర్టల్‌లో మళ్లీ నిర్ధారించండి." if te else "Required documents vary by scheme. Check the documents list on its detail page, then confirm it on the official portal."
    elif any(word in text for word in ("eligib", "qualify", "అర్హత", "అర్హుడ")):
        reply = "మీ వివరాలతో ‘Find schemes’లో సూచనలు పొందండి. ఇది ప్రాథమిక సరిపోలిక మాత్రమే; తుది అర్హతను సంబంధిత శాఖే నిర్ణయిస్తుంది." if te else "Use Find schemes to see preliminary matches based on your details. This is not an eligibility decision; the responsible department decides."
    elif any(word in text for word in ("education", "scholar", "విద్య", "స్కాలర్")):
        found = [item for item in schemes if item.category.casefold() == "education"]
        names = ", ".join(item.name_te if te else item.name for item in found)
        reply = f"విద్యా సంబంధిత జాబితా: {names or 'ప్రస్తుతం జాబితా లేదు'}." if te else f"Education-related listings: {names or 'none in the current directory'}. Check each programme's official criteria."
    elif any(word in text for word in ("apply", "application", "దరఖాస్తు")):
        reply = "పథకం వివరాలను తెరిచి దరఖాస్తు దశలను చూడండి. అధికారిక వెబ్‌సైట్ లేదా స్థానిక అధికారిక కార్యాలయం ద్వారానే దరఖాస్తు చేయండి." if te else "Open a scheme's details to review its application steps. Apply only through its official website or an authorised local office."
    else:
        reply = "మీరు ఏ రాష్ట్రం, అంశం లేదా పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు? వ్యక్తిగత/ఆర్థిక సున్నిత వివరాలు చాట్‌లో పంచుకోవద్దు." if te else "Which state, topic, or scheme would you like to explore? Please do not share sensitive personal or financial details in chat."
    return {"reply": reply, "suggestions": TE_SUGGESTIONS if te else EN_SUGGESTIONS}


def _ask_ollama(db: Session, message: str, language: str = "en") -> dict | None:
    if not OLLAMA_ENABLED:
        return None

    schemes = db.scalars(select(Scheme).where(Scheme.is_active.is_(True))).all()
    scheme_items = "\n".join(
        f"- {scheme.name} ({scheme.category}): {scheme.summary[:180]}" for scheme in schemes[:12]
    )
    language_name = "Telugu" if language == "te" else "English"
    prompt = (
        f"You are SchemeSaathi, a helpful and cautious government-scheme guide for India. "
        f"Answer in {language_name}. Do not ask for Aadhaar, bank details, passwords or OTPs. "
        f"Keep the answer short and practical. Explain the user question using this directory:\n{scheme_items}\n\n"
        f"User question: {message}"
    )

    try:
        response = httpx.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=20.0,
        )
        if response.status_code >= 400:
            return None
        payload = response.json()
        reply = (payload.get("response") or "").strip()
        if not reply:
            return None
        return {"reply": reply, "suggestions": TE_SUGGESTIONS if language == "te" else EN_SUGGESTIONS}
    except Exception:
        return None


def answer_question(db: Session, message: str, language: str = "en") -> dict:
    ollama_answer = _ask_ollama(db, message, language)
    if ollama_answer is not None:
        return ollama_answer
    return _rule_based_answer(db, message, language)
