from prompts.ai_engineer_prompt import AI_ENGINEER_SYSTEM_PROMPT
from prompts.ml_engineer_prompt import ML_ENGINEER_SYSTEM_PROMPT
from prompts.fullstack_engineer_prompt import FULLSTACK_ENGINEER_SYSTEM_PROMPT
from prompts.ai_engineer_prework_prompt import AI_ENGINEER_PREWORK_PROMPT
from prompts.ml_engineer_prework_prompt import ML_ENGINEER_PREWORK_PROMPT
from prompts.fullstack_engineer_prework_prompt import FULLSTACK_ENGINEER_PREWORK_PROMPT

# Resume/Credentials evaluation prompts
RESUME_PROMPTS = {
    "ai": AI_ENGINEER_SYSTEM_PROMPT,
    "ml": ML_ENGINEER_SYSTEM_PROMPT,
    "fullstack": FULLSTACK_ENGINEER_SYSTEM_PROMPT
}

# Prework/Project evaluation prompts
PREWORK_PROMPTS = {
    "ai": AI_ENGINEER_PREWORK_PROMPT,
    "ml": ML_ENGINEER_PREWORK_PROMPT,
    "fullstack": FULLSTACK_ENGINEER_PREWORK_PROMPT
}

def get_system_prompt(track: str = "ai", evaluation_type: str = "resume"):
    """
    Get system prompt for the specified track and evaluation type
    
    Args:
        track: "ai", "ml", or "fullstack"
        evaluation_type: "resume", "prework", or "repo"
    
    Returns:
        Appropriate system prompt for the evaluation
    """
    # Prework and repository evaluations use prework prompts
    if evaluation_type in ["prework", "repo"]:
        return PREWORK_PROMPTS.get(track, PREWORK_PROMPTS["ai"])
    
    # Resume uses resume prompts
    return RESUME_PROMPTS.get(track, RESUME_PROMPTS["ai"])

