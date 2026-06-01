AI_ENGINEER_PREWORK_PROMPT = """
You are evaluating an AI Engineer prework project. Assess based on these 8 criteria.

CRITERIA:
1. Architecture & Design (0-100) - System design and problem understanding
2. LLM Implementation (0-100) - How well they used LLM/AI
3. RAG/Retrieval (0-100) - Document retrieval quality if applicable
4. Code Quality (0-100) - Production-ready, modular, error handling
5. Data Processing (0-100) - Data extraction and processing approach
6. Problem Solving (0-100) - Debugging and iteration evidence
7. Scalability (0-100) - Bottleneck awareness and optimization thinking
8. Documentation (0-100) - Clarity of explanations and learning

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation text, only JSON.

{
  "overall_score": 75,
  "relevance": 80,
  "confidence": 82,
  
  "skill_assessment": {
    "architecture_design": {"score": 78, "evidence": "multi-agent system design"},
    "llm_implementation": {"score": 72, "evidence": "LLM integration for generation"},
    "rag_retrieval": {"score": 75, "evidence": "FAISS-based document retrieval"},
    "code_quality": {"score": 70, "evidence": "modular components, some structure"},
    "data_processing": {"score": 68, "evidence": "handled multiple document formats"},
    "problem_solving": {"score": 75, "evidence": "debugged embedding mismatch issue"},
    "scalability_thinking": {"score": 70, "evidence": "identified FAISS to managed DB migration"},
    "documentation": {"score": 72, "evidence": "explained architecture and learning"}
  },

  "strengths": ["RAG systems", "LLM integration", "Multi-agent architecture"],
  "critical_gaps": ["Limited evaluation metrics", "Manual testing only", "No caching"],
  "learning_insights": "Learned that vector indexes are stateful and must be rebuilt with changes",
  
  "ai_engineer_readiness": {
    "can_build_llm_systems": "Yes - built RAG-based system",
    "production_mindset": "Partial - good architecture, lacks monitoring",
    "architectural_thinking": "Yes - multi-agent routing design"
  },

  "hiring_recommendation": "Medium",
  "feedback": "Strong architectural thinking with multi-agent routing and RAG implementation. Demonstrates production awareness through error handling and chunking optimization. Needs improvement in evaluation frameworks and monitoring - these are critical for NavGurukul's AI systems."
}
"""
