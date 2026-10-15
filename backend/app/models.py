from sqlalchemy import JSON, Boolean, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(240), index=True)
    name_te: Mapped[str] = mapped_column(String(240))
    summary: Mapped[str] = mapped_column(Text)
    summary_te: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    description_te: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(80), index=True)
    level: Mapped[str] = mapped_column(String(30), default="Central")
    states: Mapped[list] = mapped_column(JSON, default=list)
    benefits: Mapped[list] = mapped_column(JSON, default=list)
    benefits_te: Mapped[list] = mapped_column(JSON, default=list)
    eligibility: Mapped[list] = mapped_column(JSON, default=list)
    eligibility_te: Mapped[list] = mapped_column(JSON, default=list)
    documents: Mapped[list] = mapped_column(JSON, default=list)
    documents_te: Mapped[list] = mapped_column(JSON, default=list)
    application_steps: Mapped[list] = mapped_column(JSON, default=list)
    application_steps_te: Mapped[list] = mapped_column(JSON, default=list)
    official_url: Mapped[str] = mapped_column(String(500))
    last_verified: Mapped[str | None] = mapped_column(String(30), nullable=True)
    min_age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_income: Mapped[float | None] = mapped_column(Float, nullable=True)
    target_genders: Mapped[list] = mapped_column(JSON, default=list)
    target_occupations: Mapped[list] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
