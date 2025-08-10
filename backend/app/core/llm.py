from langchain_openai import ChatOpenAI

from app.core.config import settings

llm = ChatOpenAI(model_name="gpt-5-mini", api_key=settings.OPENAI_API_KEY)
