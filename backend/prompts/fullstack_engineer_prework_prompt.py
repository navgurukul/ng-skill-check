FULLSTACK_ENGINEER_PREWORK_PROMPT = """
You are evaluating a Full Stack Engineer prework project. Assess based on these 9 criteria.

CRITERIA:
1. Requirements Understanding (0-100) - Problem comprehension and scope management
2. Frontend Implementation (0-100) - Component architecture and state management
3. Backend Implementation (0-100) - API design and business logic quality
4. Database Design (0-100) - Schema design and relationships
5. API Design (0-100) - RESTful principles and error handling
6. Code Quality (0-100) - Modularity, naming, DRY principle
7. Security Awareness (0-100) - Input validation and authentication thinking
8. System Architecture (0-100) - Overall design and separation of concerns
9. Production Mindset (0-100) - Deployment readiness and configuration

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation text, only JSON.

{
  "overall_score": 71,
  "relevance": 73,
  "confidence": 76,
  
  "skill_assessment": {
    "requirements_understanding": {"score": 72, "evidence": "clear user flow"},
    "frontend_implementation": {"score": 70, "evidence": "React components with hooks"},
    "backend_implementation": {"score": 68, "evidence": "Express REST API"},
    "database_design": {"score": 72, "evidence": "normalized schema with relations"},
    "api_design": {"score": 70, "evidence": "consistent endpoints, error responses"},
    "code_quality": {"score": 68, "evidence": "modular structure, some duplication"},
    "security_awareness": {"score": 65, "evidence": "input validation, basic auth"},
    "system_architecture": {"score": 72, "evidence": "clear frontend-backend separation"},
    "production_mindset": {"score": 66, "evidence": "environment config, lacks monitoring"}
  },

  "strengths": ["React", "Node.js/Express", "Database design"],
  "critical_gaps": ["No comprehensive error handling", "Limited testing", "Scaling not addressed"],
  "learning_insights": "Learned importance of proper API error response formats from user feedback",
  
  "fullstack_engineer_readiness": {
    "frontend_backend_integration": "Yes - clean API contracts",
    "system_design_thinking": "Yes - good separation of concerns",
    "production_mindset": "Partial - env config present, monitoring missing",
    "security_consciousness": "Partial - basic validation, needs depth",
    "full_stack_coordination": "Yes - smooth integration"
  },

  "hiring_recommendation": "Medium",
  "feedback": "Good full-stack coordination with clear API contracts and component separation. React hooks well-implemented and Express API has proper error responses. Needs improvement in comprehensive error handling and monitoring - critical for NavGurukul's production systems. Consider adding integration tests and scalability analysis for future projects."
}
"""
