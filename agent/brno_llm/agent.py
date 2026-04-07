import os
from google.adk.agents.llm_agent import Agent
from google.adk.sessions import DatabaseSessionService
from google.adk.runners import Runner
import httpx
from dotenv import load_dotenv

load_dotenv()


async def get_weather_in_brno():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/Pr%C5%AFm%C4%9Brn%C3%A9_aktu%C3%A1ln%C3%AD_teploty_vzduchu_Average_air_temperaturatures_NOV%C3%89/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson")
        return response.json()


root_agent = Agent(
    model='gemini-2.5-flash',
    name='brno_llm',
    description='Tells temperature in city of Brno',
    instruction='You are a helpful assistant that tells people the temperature in Brno',
    tools=[get_weather_in_brno],
)


# def build_db_url() -> str:
#     user     = os.getenv("POSTGRES_USER")
#     password = os.getenv("POSTGRES_PASSWORD")
#     host     = os.getenv("POSTGRES_HOST", "localhost")
#     port     = os.getenv("POSTGRES_PORT", "5432")
#     db       = os.getenv("POSTGRES_DB")

#     missing = [k for k, v in {"POSTGRES_USER": user, "POSTGRES_PASSWORD": password, "POSTGRES_DB": db}.items() if not v]
#     if missing:
#         raise EnvironmentError(f"Missing required env vars: {', '.join(missing)}")

#     return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}"

# session_service = DatabaseSessionService(db_url=build_db_url())

# runner = Runner(
#     agent=root_agent,
#     app_name="my_agent",
#     session_service=session_service
# )
