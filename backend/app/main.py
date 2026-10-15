from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Scheme
from .schemas import ChatIn, ChatOut, MatchOut, ProfileIn, SchemeOut
from .seed import seed_missing_schemes
from .services.chat import answer_question
from .services.eligibility import match_schemes


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        seed_missing_schemes(db)
    yield


app = FastAPI(
    title="SchemeSaathi API",
    version="1.0.0",
    description="Informational scheme directory and preliminary matching API.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "SchemeSaathi"}


@app.get("/api/meta")
def metadata():
    with Session(engine) as db:
        count = db.scalar(select(func.count(Scheme.id)).where(Scheme.is_active.is_(True)))
    return {"scheme_count": count or 0, "directory_type": "illustrative_sample", "last_verified": None}


@app.get("/api/schemes", response_model=list[SchemeOut])
def list_schemes(
    q: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=80),
    state: str | None = Query(default=None, max_length=80),
    db: Session = Depends(get_db),
):
    query = select(Scheme).where(Scheme.is_active.is_(True))
    if q and q.strip():
        pattern = f"%{q.strip()}%"
        query = query.where(or_(Scheme.name.ilike(pattern), Scheme.name_te.ilike(pattern), Scheme.summary.ilike(pattern), Scheme.category.ilike(pattern)))
    if category and category.casefold() != "all":
        query = query.where(Scheme.category.ilike(category.strip()))
    rows = db.scalars(query.order_by(Scheme.name)).all()
    if state and state.strip():
        selected_state = state.strip().casefold()
        rows = [row for row in rows if not row.states or selected_state in {item.casefold() for item in row.states}]
    return rows


@app.get("/api/schemes/{slug}", response_model=SchemeOut)
def get_scheme(slug: str, db: Session = Depends(get_db)):
    scheme = db.scalar(select(Scheme).where(Scheme.slug == slug, Scheme.is_active.is_(True)))
    if scheme is None:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@app.post("/api/eligibility/match", response_model=list[MatchOut])
def find_matches(profile: ProfileIn, db: Session = Depends(get_db)):
    return match_schemes(db, profile)


@app.post("/api/chat", response_model=ChatOut)
def chat(payload: ChatIn, db: Session = Depends(get_db)):
    return answer_question(db, payload.message, payload.language)
