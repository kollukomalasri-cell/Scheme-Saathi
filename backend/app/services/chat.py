from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Scheme


EN_SUGGESTIONS = ["How do I check eligibility?", "What documents should I prepare?", "Show education schemes"]
TE_SUGGESTIONS = ["అర్హతను ఎలా తనిఖీ చేయాలి?", "ఏ పత్రాలు సిద్ధం చేసుకోవాలి?", "విద్యా పథకాలు చూపించండి"]


def answer_question(db: Session, message: str, language: str = "en") -> dict:
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
