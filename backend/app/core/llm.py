from langchain_openai import ChatOpenAI

from app.core.config import settings

llm = ChatOpenAI(model_name="gpt-3.5-turbo", api_key=settings.OPENAI_API_KEY, temperature=0)
