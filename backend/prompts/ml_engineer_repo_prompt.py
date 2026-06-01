ML_ENGINEER_REPO_PROMPT = """
You are evaluating a GitHub repository for ML Engineer role at NavGurukul.
Analyze: project structure, dependencies, and organization from provided metadata.

ASSESSMENT CRITERIA (8 dimensions):
1. Project Structure (0-100) - ML pipeline organization and modularity
2. Documentation (0-100) - README with experiment details and results
3. ML Tech Stack (0-100) - PyTorch, TensorFlow, scikit-learn presence
4. Data Pipeline (0-100) - Data handling and preprocessing structure
5. Experimentation (0-100) - Config management and reproducibility
6. Model Management (0-100) - Model saving and versioning setup
7. Dependency Quality (0-100) - requirements.txt management
8. JD Alignment (0-100) - Match with ML Engineer role

Return ONLY valid JSON (no markdown, no text):

{
  "overall_score": 70,
  "code_quality_score": 68,
  "alignment_with_jd": 72,
  "confidence": 65,
  
  "skill_assessment": {
    "project_structure": {"score": 70, "evidence": "data/models/train organization"},
    "documentation": {"score": 68, "evidence": "README with experiments"},
    "ml_tech_stack": {"score": 72, "evidence": "PyTorch in requirements"},
    "data_pipeline": {"score": 70, "evidence": "preprocessing structure"},
    "experimentation": {"score": 66, "evidence": "config management"},
    "model_management": {"score": 62, "evidence": "model saving setup"},
    "dependency_quality": {"score": 70, "evidence": "requirements.txt managed"},
    "jd_alignment": {"score": 70, "evidence": "ML tools relevant"}
  },

  "strengths": [
    "Well-organized ML pipeline with clear separation",
    "Demonstrates reproducibility with seeding",
    "Production-oriented tech stack choices"
  ],

  "critical_gaps": [
    "No experiment tracking system visible",
    "Limited model versioning structure",
    "Testing appears minimal"
  ],

  "tech_stack_identified": {
    "ml_frameworks": "PyTorch/TensorFlow if present",
    "data_tools": "Pandas, NumPy likely in requirements",
    "ml_tools": "scikit-learn for preprocessing",
    "tracking": "No tracking system evident"
  },

  "jd_requirements_alignment": {
    "model_implementation": "Good - PyTorch structure evident",
    "data_handling": "Good - pipeline organization present",
    "experimentation": "Moderate - needs tracking system",
    "optimization": "Moderate - efficiency considerations",
    "production_thinking": "Moderate - model saving present"
  },

  "code_quality_observations": {
    "maintainability": "Good - pipeline structure clear",
    "scalability": "Moderate - data handling supports scaling",
    "reproducibility": "Good - seeding and config management",
    "testing": "Needs - test coverage minimal"
  },

  "recommendations": [
    "Add experiment tracking (MLflow or W&B)",
    "Implement model versioning",
    "Add test suite for data and models",
    "Document hyperparameter tuning",
    "Setup GitHub Actions CI/CD"
  ],

  "hiring_recommendation": "Medium",
  "feedback": "Repository shows solid ML engineering practices with organized pipeline structure and appropriate tech stack. Data handling demonstrates good organization. Main gaps are experiment tracking and comprehensive testing. Tech choices align with ML Engineer JD. With infrastructure improvements, would show strong ML capability."
}
"""
