Agentic Customer Support Assistant (RAG + Multi-Agent System)

Context
I built an Agentic Customer Support Assistant designed to answer internal HR and policy-related
queries using enterprise documents. Instead of sending every query directly to an LLM, I structured
the system so that each request is first classified by intent and then routed to a specialized
component. Depending on the type of query, it may go to a RAG-based knowledge agent, a
deterministic policy agent, or an escalation handler. The main idea behind this project was that
answering questions is not the hard part — retrieving the right information first is. I wanted the
system to rely on trusted document retrieval before using generation, which reduces hallucination
and makes the responses more reliable.
Primary technical constraints:
• Needed to avoid hallucination for sensitive HR queries
• Built without enterprise infrastructure (local FAISS + Streamlit setup)
• LLM API rate limits and token limits
• Mixed document formats (PDF, DOCX, TXT)
• Had to keep the architecture modular but not overcomplicated
Technical Implementation
Architecture Overview
User Query
↓
Intent Agent
↓
Router
↓-------------------------------
| Knowledge Agent (RAG + LLM) |
| Policy Agent (Rule-based)   |
| Escalation Agent            |-------------------------------
↓
Logging Layer
↓
Final Answer + Sources
The query first goes through a lightweight intent classifier. Based on the detected intent, the router
forwards it to the appropriate agent. The Knowledge Agent performs embedding-based retrieval
using FAISS and optionally calls the LLM. The Policy Agent returns deterministic responses for
compliance-related queries. The Escalation Agent handles unknown or unsupported queries and
simulates human handoff.
Code Walkthrough – Retrieval Logic
def retrieve(query, index, embed_model, metadata, top_k=3):
    query_vector = embed_model.encode([query])
    distances, indices = index.search(query_vector, top_k)
    results = []
    for i in indices[0]:
        results.append(metadata[i])
    return results
This function converts the user query into an embedding and searches the FAISS index for the
most similar document chunks. The quality of this step directly impacts answer quality, so I spent
significant time debugging chunking and indexing rather than focusing only on prompts.
Data Flow (Knowledge Agent Path)
• User submits a query via the Streamlit interface
• Intent is detected using rule-based logic
• Router selects the Knowledge Agent
• Query embedding is generated
• FAISS returns top-K relevant chunks
• Retrieved context is added to the prompt
• LLM generates a grounded answer
• Answer and source metadata are returned
• Query details are logged for analysis
Technical Decisions
Keeping Intent Classification Rule-Based
I considered using an LLM for intent classification but decided against it. For structured HR queries,
rule-based classification was sufficient, faster, and easier to debug. The trade-off is that rule-based
systems are less flexible. However, for this use case, determinism and simplicity were more
important than adaptability.
Separating Policy Agent from RAG Agent
Some queries related to compliance or disciplinary rules should not rely on generative responses.
Instead of routing everything through the LLM, I created a Policy Agent that returns predefined
structured answers. This slightly increased architectural complexity but reduced hallucination risk
and improved reliability.
Scaling Bottleneck
Initially, I faced an issue where certain large documents dominated the retrieval results. This was
caused by uneven chunking and inconsistent embedding handling. To address this:
• I controlled chunk size (around 300–500 tokens)
• Introduced overlap between chunks
• Ensured embedding normalization before indexing
If scaling further, I would migrate from local FAISS to a managed vector database and implement
background indexing jobs instead of manual rebuilds.
Learning & Iteration
Technical Mistake
At one stage, I modified the chunking logic but reused the existing FAISS index. This caused
runtime errors because the stored embeddings no longer matched the updated metadata structure.
From this, I learned that vector indexes are stateful artifacts and must be rebuilt whenever upstream
preprocessing changes. It helped me better understand reproducibility and pipeline consistency in
ML systems.
What I Would Improve
• Add retrieval evaluation metrics instead of relying only on manual testing
• Implement structured monitoring instead of JSON logs
• Add caching for repeated queries
• Package the project more cleanly to avoid manual import path fixes
This project helped me understand that building reliable AI systems requires careful system design,
modular thinking, and failure handling — not just calling an LLM API.