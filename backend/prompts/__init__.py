from prompts.ai_engineer_prompt import AI_ENGINEER_SYSTEM_PROMPT
from prompts.ml_engineer_prompt import ML_ENGINEER_SYSTEM_PROMPT
from prompts.fullstack_engineer_prompt import FULLSTACK_ENGINEER_SYSTEM_PROMPT

SYSTEM_PROMPTS = {
    "ai": AI_ENGINEER_SYSTEM_PROMPT,
    "ml": ML_ENGINEER_SYSTEM_PROMPT,
    "fullstack": FULLSTACK_ENGINEER_SYSTEM_PROMPT
}

def get_system_prompt(track: str = "ai"):
    """Get system prompt for the specified track"""
    return SYSTEM_PROMPTS.get(track, SYSTEM_PROMPTS["ai"])
