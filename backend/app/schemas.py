from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class SchemeOut(BaseModel):
    id: int
    slug: str
    name: str
    name_te: str
    summary: str
    summary_te: str
    description: str
    description_te: str
    category: str
    level: str
    states: list[str]
    benefits: list[str]
    benefits_te: list[str]
    eligibility: list[str]
    eligibility_te: list[str]
    documents: list[str]
    documents_te: list[str]
    application_steps: list[str]
    application_steps_te: list[str]
    official_url: HttpUrl
    last_verified: str | None

    model_config = ConfigDict(from_attributes=True)


class ProfileIn(BaseModel):
    age: int = Field(ge=0, le=120)
    state: str = Field(min_length=2, max_length=80)
    gender: str = Field(default="Prefer not to say", max_length=40)
    occupation: str = Field(default="Any", max_length=80)
    annual_income: float | None = Field(default=None, ge=0)
    category: str | None = None


class MatchOut(BaseModel):
    scheme: SchemeOut
    score: int
    reasons: list[str]
    reasons_te: list[str]


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    language: str = Field(default="en", pattern="^(en|te)$")


class ChatOut(BaseModel):
    reply: str
    suggestions: list[str] = Field(default_factory=list)
