from prompts.ai_engineer_prompt import AI_ENGINEER_SYSTEM_PROMPT
from prompts.ml_engineer_prompt import ML_ENGINEER_SYSTEM_PROMPT
from prompts.fullstack_engineer_prompt import FULLSTACK_ENGINEER_SYSTEM_PROMPT
from prompts.ai_engineer_prework_prompt import AI_ENGINEER_PREWORK_PROMPT
from prompts.ml_engineer_prework_prompt import ML_ENGINEER_PREWORK_PROMPT
from prompts.fullstack_engineer_prework_prompt import FULLSTACK_ENGINEER_PREWORK_PROMPT
from prompts.ai_engineer_repo_prompt import AI_ENGINEER_REPO_PROMPT
from prompts.ml_engineer_repo_prompt import ML_ENGINEER_REPO_PROMPT
from prompts.fullstack_engineer_repo_prompt import FULLSTACK_ENGINEER_REPO_PROMPT

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

# Repository/GitHub code evaluation prompts
REPO_PROMPTS = {
    "ai": AI_ENGINEER_REPO_PROMPT,
    "ml": ML_ENGINEER_REPO_PROMPT,
    "fullstack": FULLSTACK_ENGINEER_REPO_PROMPT
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
    if evaluation_type == "repo":
        return REPO_PROMPTS.get(track, REPO_PROMPTS["ai"])
    elif evaluation_type in ["prework"]:
        return PREWORK_PROMPTS.get(track, PREWORK_PROMPTS["ai"])
    else:  # resume
        return RESUME_PROMPTS.get(track, RESUME_PROMPTS["ai"])

