from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Scheme
from ..schemas import ProfileIn


OCCUPATION_ALIASES = {
    "farmer": {"farmer", "agriculture"},
    "student": {"student", "pupil"},
    "entrepreneur": {"entrepreneur", "business"},
}


def match_schemes(db: Session, profile: ProfileIn) -> list[dict]:
    schemes = db.scalars(select(Scheme).where(Scheme.is_active.is_(True))).all()
    matches: list[dict] = []
    state = profile.state.strip().casefold()
    gender = profile.gender.strip().casefold()
    occupation = profile.occupation.strip().casefold()
    for scheme in schemes:
        reasons: list[str] = []
        reasons_te: list[str] = []
        if scheme.states and state not in {item.casefold() for item in scheme.states}:
            continue
        if scheme.min_age is not None and profile.age < scheme.min_age:
            continue
        if scheme.max_age is not None and profile.age > scheme.max_age:
            continue
        if scheme.target_genders and gender not in {item.casefold() for item in scheme.target_genders}:
            continue
        if scheme.max_income is not None and profile.annual_income is not None and profile.annual_income > scheme.max_income:
            continue
        score = 55
        if not scheme.states:
            score += 10
            reasons.append("The scheme is listed as central and is not limited to a state in this directory.")
            reasons_te.append("ఈ డైరెక్టరీలో ఈ కేంద్ర పథకం ఒక రాష్ట్రానికి మాత్రమే పరిమితం కాలేదు.")
        else:
            reasons.append(f"Your state, {profile.state.strip()}, is listed.")
            reasons_te.append(f"మీ రాష్ట్రం {profile.state.strip()} జాబితాలో ఉంది.")
            score += 20
        if scheme.min_age is not None or scheme.max_age is not None:
            reasons.append("Your age falls within the directory's recorded age range.")
            reasons_te.append("డైరెక్టరీలో నమోదైన వయోపరిమితిలో మీ వయస్సు ఉంది.")
            score += 15
        if scheme.target_occupations:
            related = set().union(*(OCCUPATION_ALIASES.get(item.casefold(), {item.casefold()}) for item in scheme.target_occupations))
            if occupation in related:
                reasons.append("Your occupation matches a listed audience for this scheme.")
                reasons_te.append("ఈ పథకం కోసం జాబితా చేసిన వర్గంతో మీ వృత్తి సరిపోతుంది.")
                score += 15
            else:
                reasons.append("Occupation requirements may apply; review the official criteria.")
                reasons_te.append("వృత్తి సంబంధిత నిబంధనలు ఉండవచ్చు; అధికారిక అర్హతను పరిశీలించండి.")
                score -= 10
        if profile.annual_income is None:
            reasons.append("Income was not provided, so income-related rules could not be assessed.")
            reasons_te.append("ఆదాయం ఇవ్వలేదు కాబట్టి ఆదాయ నిబంధనలను పరిశీలించలేకపోయాం.")
        score = max(40, min(95, score))
        if profile.category and profile.category.casefold() != scheme.category.casefold():
            score -= 15
        matches.append({"scheme": scheme, "score": score, "reasons": reasons, "reasons_te": reasons_te})
    return sorted(matches, key=lambda item: item["score"], reverse=True)
