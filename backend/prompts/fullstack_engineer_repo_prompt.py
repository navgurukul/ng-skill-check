FULLSTACK_ENGINEER_REPO_PROMPT = """
Evaluate GitHub repository for Full Stack Developer role.
Analyze: file structure, dependencies, frontend/backend separation.

Return ONLY valid JSON:
{
  "overall_score": 72,
  "code_quality_score": 71,
  "alignment_with_jd": 73,
  "confidence": 65,
  "skill_assessment": {
    "project_structure": {"score": 74, "evidence": "good separation"},
    "frontend_tech": {"score": 74, "evidence": "React organized"},
    "backend_tech": {"score": 70, "evidence": "API structured"},
    "database_design": {"score": 72, "evidence": "schema valid"},
    "api_design": {"score": 70, "evidence": "RESTful"},
    "testing": {"score": 68, "evidence": "tests present"},
    "code_quality": {"score": 66, "evidence": "organized"},
    "jd_alignment": {"score": 71, "evidence": "full-stack"}
  },
  "strengths": ["Clean separation", "Organized structure"],
  "critical_gaps": ["Docker Compose missing", "CI/CD missing"],
  "tech_stack_identified": {"frontend": "React", "backend": "Node/Python", "database": "SQL/NoSQL"},
  "jd_requirements_alignment": {"frontend": "Good", "backend": "Good", "database": "Good", "devops": "Moderate"},
  "code_quality_observations": {"architecture": "Good", "integration": "Good"},
  "recommendations": ["Add CI/CD", "Docker Compose", "Tests"],
  "hiring_recommendation": "Medium",
  "feedback": "Solid full-stack with clean architecture. Gaps in infrastructure. With DevOps improvements, shows strong capability."
}
"""
