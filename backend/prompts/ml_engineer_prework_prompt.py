ML_ENGINEER_PREWORK_PROMPT = """
You are evaluating an ML Engineer prework project. Assess based on these 8 criteria.

CRITERIA:
1. Problem Framing (0-100) - ML problem understanding and EDA quality
2. Model Implementation (0-100) - Model selection and PyTorch/TensorFlow quality
3. Data Handling (0-100) - Preprocessing pipeline and feature engineering
4. Evaluation Rigor (0-100) - Metrics, cross-validation, and experimentation
5. Optimization Awareness (0-100) - Model size/latency tradeoffs and efficiency
6. Code Quality (0-100) - Modularity, reproducibility, error handling
7. Problem Solving (0-100) - Debugging and systematic iteration
8. Production Thinking (0-100) - Model saving, inference pipeline, monitoring

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation text, only JSON.

{
  "overall_score": 72,
  "relevance": 75,
  "confidence": 78,
  
  "skill_assessment": {
    "problem_framing": {"score": 72, "evidence": "did EDA on dataset"},
    "model_implementation": {"score": 70, "evidence": "used PyTorch LSTM"},
    "data_handling": {"score": 68, "evidence": "normalization and train-test split"},
    "evaluation_rigor": {"score": 75, "evidence": "5-fold cross-validation used"},
    "optimization_awareness": {"score": 62, "evidence": "noted model size concerns"},
    "code_quality": {"score": 70, "evidence": "modular class structure"},
    "problem_solving": {"score": 74, "evidence": "debugged gradient issues"},
    "production_thinking": {"score": 65, "evidence": "model checkpointing implemented"}
  },

  "strengths": ["Deep Learning", "PyTorch", "Experiment tracking"],
  "critical_gaps": ["No quantization explored", "Limited error analysis", "Monitoring missing"],
  "learning_insights": "Learned importance of proper train-test split after overfitting",
  
  "ml_engineer_readiness": {
    "can_build_ml_systems": "Yes - built end-to-end pipeline",
    "experimental_rigor": "Yes - systematic evaluation",
    "optimization_mindset": "Partial - basic efficiency thinking",
    "production_awareness": "Partial - has persistence, needs monitoring"
  },

  "hiring_recommendation": "Medium",
  "feedback": "Good experimental rigor with 5-fold CV and clear evaluation metrics. Strong PyTorch implementation with proper model management. Needs improvement in optimization mindset - important for NavGurukul's on-device deployment focus. Consider quantization and pruning strategies for future projects."
}
"""
