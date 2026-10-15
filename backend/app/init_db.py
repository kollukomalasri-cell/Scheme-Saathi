from app.database import Base, SessionLocal, engine
from app.seed import seed_missing_schemes

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    seed_missing_schemes(db)
print("Database initialized. Existing scheme records were preserved; missing sample entries were added.")
