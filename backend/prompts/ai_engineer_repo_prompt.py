AI_ENGINEER_REPO_PROMPT = """
You are evaluating a GitHub repository for AI Engineer role at NavGurukul.
Analyze: project structure, README, dependencies, and organization from provided metadata.

ASSESSMENT CRITERIA (8 dimensions):
1. Project Structure (0-100) - Organization and modularity
2. Documentation (0-100) - README clarity and completeness
3. AI Tech Stack (0-100) - LLM, RAG, vector DB presence
4. Production Mindset (0-100) - Config, .env, deployment setup
5. Testing Setup (0-100) - Test directory presence
6. Dependency Quality (0-100) - requirements.txt/package.json
7. Code Patterns (0-100) - Modular architecture evidence
8. JD Alignment (0-100) - Match with AI Engineer needs

Return ONLY valid JSON (no markdown, no text):

{
  "overall_score": 72,
  "code_quality_score": 70,
  "alignment_with_jd": 74,
  "confidence": 65,
  
  "skill_assessment": {
    "project_structure": {"score": 74, "evidence": "clear src/ organization"},
    "documentation": {"score": 70, "evidence": "README with architecture"},
    "ai_tech_stack": {"score": 75, "evidence": "LangChain, FAISS in requirements"},
    "production_mindset": {"score": 68, "evidence": ".env.example and config present"},
    "testing_setup": {"score": 65, "evidence": "tests/ directory structure"},
    "dependency_quality": {"score": 70, "evidence": "well-managed requirements.txt"},
    "code_patterns": {"score": 72, "evidence": "modular organization evident"},
    "jd_alignment": {"score": 71, "evidence": "AI tools match JD requirements"}
  },

  "strengths": [
    "Well-organized project with clear module separation",
    "Uses LangChain for LLM orchestration and RAG",
    "Production-focused with env management setup"
  ],

  "critical_gaps": [
    "No GitHub Actions CI/CD configuration",
    "Limited test coverage structure visible",
    "Docker setup not evident"
  ],

  "tech_stack_identified": {
    "ai_frameworks": "LangChain for LLM applications",
    "vector_databases": "FAISS for embeddings",
    "backend": "FastAPI for API layer",
    "other_tools": "PyTorch/transformers likely in requirements"
  },

  "jd_requirements_alignment": {
    "llm_nlp_mastery": "Good - LangChain usage shows LLM experience",
    "rag_systems": "Good - FAISS integration for RAG",
    "api_development": "Good - FastAPI backend present",
    "production_practices": "Moderate - config good, CI/CD missing",
    "vector_databases": "Good - FAISS implementation evident"
  },

  "code_quality_observations": {
    "maintainability": "Good - modular structure evident",
    "scalability": "Moderate - API design supports scaling",
    "security": "Moderate - .env management present",
    "testing": "Needs - test structure minimal"
  },

  "recommendations": [
    "Add GitHub Actions for CI/CD pipeline",
    "Implement comprehensive test suite",
    "Add Docker and docker-compose",
    "Document prompt engineering decisions",
    "Setup model versioning strategy"
  ],

  "hiring_recommendation": "Medium",
  "feedback": "Repository demonstrates solid AI engineering fundamentals with appropriate tech stack (LangChain, FAISS, FastAPI). Project organization shows production mindset. Main gaps are infrastructure (CI/CD, Docker) and comprehensive testing. Tech choices align well with AI Engineer role. With production improvements, would show strong engineering capability."
}
"""
