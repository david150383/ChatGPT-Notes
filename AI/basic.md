# LLM & Generative AI — Practical Guide with Examples

Since you already have experience with Node.js, Express, NestJS, Python, and FastAPI, I'll explain these concepts from a backend engineering and production-system perspective, with practical examples and code where useful.

We'll use one example throughout: ShopSphere, an e-commerce application where customers can ask questions such as:

- "What is your return policy?"
- "Recommend a laptop under ₹70,000."
- "Where is my order?"
- "Compare these two products."

A production AI system might look like this:

React / Web / Mobile Client

FastAPI / Node.js AI Backend

Authentication · API · Guardrails · Workflow

RAG

Embeddings + Vector DB

Tools

Order API · Product API

LLM Provider

Model · Inference · Token generation

This architecture uses several of the concepts you listed. They solve different problems, so it's important to understand both each concept individually and how they fit together.

## 1. LLM (Large Language Model)

An LLM is a machine learning model trained on large amounts of data to understand and generate language. Depending on its capabilities, it can also work with images, audio, and structured data.

Examples include GPT, Claude, and Gemini.

### How it works

At a simplified level, an LLM receives input, processes the tokens, and predicts the next token repeatedly until it produces a response.

Suppose you send:

> Explain dependency injection in NestJS.

The model generates a response token by token, using the input and its learned parameters to determine what comes next.

### Example: calling an LLM from Python

```
from openai import OpenAIclient = OpenAI()response = client.responses.create(    model="YOUR_MODEL_NAME",    input="Explain dependency injection in NestJS.")print(response.output_text)
```

`YOUR_MODEL_NAME` is a placeholder; use a model available to your account. The SDK handles the HTTP API request.

Backend perspective: An LLM is not your database, business logic, or source of truth. It generates outputs based on learned patterns and provided context. Your application still needs validation, authorization, and reliable data access.

## 2. Tokens

Tokens are the units of text the model processes and generates. A token may be a whole word, part of a word, punctuation, or another text unit.

For example:

```
Input: "Unbelievable performance!"
```

A tokenizer might split this into pieces resembling:

```
["Un", "believ", "able", " performance", "!"]
```

This is illustrative only; the actual split depends on the model's tokenizer.

### Why tokens matter

- Cost: Many model APIs charge based on input and output tokens.
- Context limits: The model can process only a limited amount of context per request.
- Latency: Processing and generating more tokens can increase response time.
- Output limits: A model or API may limit the number of generated tokens.

Example:

| Component            | Tokens (illustrative) |
| -------------------- | --------------------- |
| System instructions  | 200                   |
| User question        | 50                    |
| Retrieved documents  | 2,000                 |
| Conversation history | 1,000                 |
| Total input          | 3,250                 |
| Generated response   | 400                   |

Here, the request uses 3,250 input tokens and generates 400 output tokens.

The exact cost depends on the selected model and its pricing.

Production tip: Monitor token usage per request and per customer. A large conversation history or excessive RAG retrieval can increase costs substantially.

## 3. Context window

The context window is the amount of information a model can process in a single request, measured in tokens.

Think of it as the model's working space for the current interaction.

Suppose a model supports a context window of 128,000 tokens. The request may need to accommodate:

- System and developer instructions
- User messages
- Conversation history
- Retrieved documents
- Tool results
- The output budget, depending on the model and API

You cannot necessarily use all 128,000 tokens as input and still generate a large response.

### Example

Imagine a customer has a long conversation about buying a laptop.

| Context component    | Tokens |
| -------------------- | ------ |
| Instructions         | 2,000  |
| Conversation history | 30,000 |
| Product documents    | 15,000 |
| Current question     | 500    |
| Total before output  | 47,500 |

A model with a 32,000-token context limit cannot accommodate this request as shown.

### How to handle this in production

1. Remove irrelevant conversation history.
2. Summarize older messages.
3. Retrieve only the relevant documents using RAG.
4. Set output limits.
5. Monitor context usage.

Important: A larger context window does not guarantee better answers. Relevant, well-organized context is often more useful than a large amount of unrelated information.

## 4. Inference

Inference is the process of using a trained model to produce a prediction or response.

Training and inference are different activities:

- Training: The model learns patterns by adjusting its parameters.
- Fine-tuning: An already-trained model is further trained on a targeted dataset.
- Inference: You send an input to a model and receive its output.

### Example

Your ShopSphere application sends:

```
{
  "question": "What is the return policy for laptops?"
}
```

The backend retrieves the relevant policy, sends the question and context to the model, and receives a generated answer.

That model execution is inference.

### Inference scaling

Suppose your application receives 10 requests per second initially, then grows to 1,000 requests per second.

You may need to scale inference by:

- Using multiple model-serving replicas.
- Batching requests where supported.
- Using GPUs efficiently for self-hosted models.
- Routing simpler requests to smaller models.
- Caching repeatable responses.
- Limiting concurrent requests and applying backpressure.

For hosted models, you also need to consider provider rate limits, quotas, and capacity.

Interview point: Inference scaling means increasing the capacity and efficiency of model serving to handle greater demand while controlling latency and cost.

## 5. API (Application Programming Interface)

An API allows your application to communicate with another system. In generative AI, your backend commonly calls a model provider's API.

The architecture is similar to calling a payment gateway, shipping service, or any other external REST API.

### Example: FastAPI endpoint

```
from fastapi import FastAPIfrom pydantic import BaseModelapp = FastAPI()class ChatRequest(BaseModel):    question: str@app.post("/ai/chat")async def chat(request: ChatRequest):    # In production, call the LLM service here.    return {        "question": request.question,        "answer": "Example response from the AI service"    }
```

The endpoint is your API. The LLM provider's API is a separate interface your backend can call.

### Production considerations

- Authentication and authorization
- Request validation
- Rate limiting
- Timeouts and retries
- Error handling
- Token and cost tracking
- Streaming responses where useful

Never expose a private model-provider API key in React or another browser-based client. Keep it on the backend.

## 6. System prompt

A system prompt provides high-level instructions that shape how the model should behave.

For example, your ShopSphere assistant might need to act as a customer-support assistant rather than a general-purpose chatbot.

```
SYSTEM_PROMPT = """You are the ShopSphere customer-support assistant.Rules:- Answer questions about ShopSphere products and policies.- Use the supplied policy documents when answering policy questions.- Do not invent prices, order statuses, or delivery dates.- If information is missing, say that you do not know.- Do not disclose another customer's personal information."""
```

Your backend sends these instructions along with the user message and any relevant context.

### System prompt versus user prompt

| System prompt                                     | User prompt                        |
| ------------------------------------------------- | ---------------------------------- |
| Defines the assistant's role and general behavior | Defines the user's current request |
| Usually controlled by the application             | Usually supplied by the user       |
| Applies across requests or a conversation         | Changes from request to request    |

Security warning: A system prompt is not a security boundary. A model can still make mistakes or be manipulated by hostile input. Enforce permissions, data access, and business rules in your backend.

## 7. Temperature

Temperature is a model-generation parameter that influences how predictable or varied the output is.

A lower temperature generally favors more predictable outputs. A higher temperature generally permits more variation.

Temperature

## 0.3

0 · Lower variation

0.7 · Moderate

1.5 · Higher variation

Typical behavior: A balance of predictability and variety.

Illustration only. Actual behavior depends on the model; temperature is not a direct measure of answer quality or correctness.

### Example use cases

| Use case                    | Starting point     |
| --------------------------- | ------------------ |
| Structured extraction       | Low temperature    |
| Customer-support answers    | Low to moderate    |
| Product-description writing | Moderate           |
| Creative brainstorming      | Moderate to higher |

The correct setting depends on the model and task. Some models do not support temperature, or restrict which values you can use.

Important: Lowering temperature does not eliminate hallucinations. A model can confidently produce incorrect information even at a low temperature.

## 8. Embeddings

An embedding is a numerical representation of content, typically a vector of numbers, designed to capture useful semantic relationships.

For example, these sentences have different wording but similar meanings:

- "How can I return a laptop?"
- "What is the laptop refund process?"

An embedding model may represent these sentences as vectors that are close together in vector space.

Illustrative vectors:

```
"How can I return a laptop?"
[0.21, -0.14, 0.82, 0.35, ...]

"What is the laptop refund process?"
[0.19, -0.11, 0.79, 0.38, ...]
```

These are made-up values to explain the concept, not actual model outputs.

### Why embeddings matter

Embeddings are useful for:

- Semantic search
- Retrieval-augmented generation (RAG)
- Document recommendations
- Finding similar products or support tickets
- Clustering and classification

### Typical workflow

1. Convert documents into text chunks.
2. Generate an embedding for each chunk.
3. Store the vectors with document metadata.
4. Embed the user's question.
5. Find semantically similar document vectors.
6. Use the matching text as context for the LLM.

Key distinction: An embedding model converts content into vectors. An LLM generates answers. Some model families support both tasks, but they are different operations.

## 9. Hallucination

A hallucination occurs when an AI model generates information that is false, unsupported, or fabricated, sometimes while presenting it confidently.

### E-commerce example

Customer:

> Is my order arriving tomorrow?

The model replies:

> Yes, your order will arrive tomorrow at 2 PM.

But the system never retrieved the customer's order details or delivery estimate.

That answer is a hallucination because the model invented a specific delivery commitment.

### Why hallucinations happen

- The model lacks the required information.
- The prompt encourages an answer despite uncertainty.
- Retrieved documents are irrelevant or incomplete.
- The model misinterprets its context.
- The task requires current or private data that the model cannot access.

### How to reduce hallucinations

- Retrieve trusted documents with RAG.
- Use tools to fetch current order or inventory data.
- Tell the model to acknowledge missing information.
- Validate structured outputs.
- Require citations or supporting evidence where appropriate.
- Evaluate answers against known correct results.

For sensitive operations, do not rely on the model's confidence or wording. Verify the underlying facts and enforce the decision in application code.

## 10. Chunking

Chunking means splitting a large document into smaller pieces so that each piece can be embedded, retrieved, and supplied to a model efficiently.

Suppose your return policy contains 10,000 words. Embedding the whole document as one unit may make precise retrieval less effective.

Instead, you could split it into sections such as:

- Eligibility for returns
- Return time limits
- Refund processing
- Damaged products
- Excluded items

Original document

Return policy · 10,000 words

Chunk 1

Return eligibility

Chunk 2

Return deadlines

Chunk 3

Refund processing

Chunk 4

Damaged products

Illustrative structure; real chunk sizes depend on document content and retrieval needs.

### Common chunking strategies

| Strategy        | How it works                            | Suitable for                            |
| --------------- | --------------------------------------- | --------------------------------------- |
| Fixed-size      | Split by a target token count           | Simple documents                        |
| Overlapping     | Adjacent chunks share some text         | Preserving context across boundaries    |
| Semantic        | Split based on meaning or topic         | Policies, articles, documentation       |
| Structure-aware | Split by headings, sections, or records | Markdown, HTML, technical documentation |

Example:

```
def chunk_text(text: str, chunk_size: int = 500):    words = text.split()    return [        " ".join(words[i:i + chunk_size])        for i in range(0, len(words), chunk_size)    ]
```

This is a simple word-based demonstration, not a production token-aware chunker. For RAG, use token-aware sizing, preserve headings and metadata, and consider overlap when needed.

Trade-off: Tiny chunks can lose context; oversized chunks can introduce irrelevant content and consume more tokens. There is no universally optimal chunk size.

## 11. Vector database

A vector database stores and searches vector embeddings. It helps retrieve items that are semantically similar to a query.

Examples include Pinecone, Qdrant, Weaviate, and Chroma. PostgreSQL can also support vector search using the pgvector extension.

### How it works

Suppose your database contains these documents:

| ID | Document                     |
| -- | ---------------------------- |
| 1  | Laptop return policy         |
| 2  | Smartphone warranty terms    |
| 3  | Shipping and delivery policy |

A user asks:

> Can I send my laptop back within 10 days?

The system embeds the question, searches for similar vectors, and retrieves document 1 if it matches the query and its metadata filters.

A simplified vector record might look like this:

```
{
  "id": "return-policy-001",
  "text": "Laptops can be returned within 14 days...",
  "embedding": [0.21, -0.14, 0.82],
  "metadata": {
    "category": "returns",
    "document_version": "v3"
  }
}
```

The three-number embedding above is illustrative. Actual embeddings typically have many more dimensions.

### Vector database versus relational database

| Relational database                          | Vector database                        |
| -------------------------------------------- | -------------------------------------- |
| Exact filters, joins and transactions        | Similarity-based retrieval             |
| `WHERE order_id = 123`                       | Find semantically similar content      |
| Stores structured business data              | Stores vectors and associated metadata |
| Authoritative source for orders and payments | Retrieval layer for relevant knowledge |

They can complement one another. Keep order status and payment records in your transactional database; use vector search for relevant policy documents and product descriptions.

## 12. Fine-tuning

Fine-tuning means taking a pretrained model and training it further on a targeted dataset to influence its behavior or improve performance on a specific task.

For example, ShopSphere may have thousands of high-quality examples of customer-support conversations. You could use suitable examples to fine-tune a supported model to follow your desired response patterns.

### Example training data

```
{"messages":[
  {"role":"user","content":"My product arrived damaged."},
  {"role":"assistant","content":"I'm sorry your product arrived damaged. I can help you start a replacement or refund request."}
]}
```

This is an illustrative conversation record; the exact training format depends on the model provider.

### What fine-tuning can improve

- Consistent response style and format
- Specialized task performance
- Domain-specific classification or extraction
- Following examples of a desired response pattern
- Reducing the need for lengthy behavioral examples in every prompt

### What fine-tuning does not automatically solve

- Access to live inventory or order status
- Knowledge of policy changes made after training
- Hallucinations in every situation
- User authorization or data privacy
- The need for external tools

If the return policy changes next week, fine-tuning alone does not automatically update the model's knowledge.

### Fine-tuning versus RAG

| Fine-tuning                                             | RAG                                                      |
| ------------------------------------------------------- | -------------------------------------------------------- |
| Changes model parameters through training               | Supplies retrieved information at inference time         |
| Useful for task behavior and consistent output patterns | Useful for current or private reference information      |
| Requires training data and a training workflow          | Requires document ingestion and retrieval infrastructure |
| Updates require another training or adaptation step     | Documents can be re-indexed as content changes           |

Production recommendation: Establish a baseline with prompting and RAG first. Fine-tune when evaluations show a repeatable behavior or task-performance gap that fine-tuning is suited to address.

## 13. RAG (Retrieval-Augmented Generation)

RAG combines information retrieval with LLM generation. Instead of asking the model to answer from its learned parameters alone, your application retrieves relevant external information and supplies it as context.

### RAG workflow

1\. User asks a question

"What is the return period for laptops?"

2\. Embed the question

Convert text into a vector

3\. Retrieve relevant chunks

Search vector database and apply metadata filters

4\. Construct the LLM request

Instructions + question + retrieved policy

5\. Generate a grounded answer

Answer using the retrieved evidence

### Example

Retrieved document:

```
Laptop returns are accepted within 14 days
of delivery, subject to eligibility conditions.
```

User question:

```
Can I return my laptop after 10 days?
```

Possible answer:

> Yes, the standard return window is 14 days from delivery, subject to eligibility conditions.

The response is grounded in the supplied document, assuming the document is current and applies to the customer's product.

### Simplified RAG prompt

```
prompt = f"""Answer using the context provided below.If the context does not contain the answer, say so.Context:{returned_documents}Question:{user_question}"""
```

Your backend would send this prompt to the model.

### Production concerns

- Document ingestion and re-indexing
- Chunk quality and embedding-model selection
- Retrieval relevance and reranking
- Source attribution
- Access-control filtering
- Handling stale or contradictory documents
- Evaluating answer quality

Important: RAG reduces some hallucination risks, but it does not guarantee correctness. The model can misread retrieved content, and retrieval itself can return the wrong information.

## 14. Guardrails

Guardrails are mechanisms that help keep AI inputs, outputs, tool calls, and application behavior within defined boundaries.

They can include deterministic code, policy checks, model-based classifiers, schema validation, access control, and human approval.

### Example: customer-support guardrails

Suppose a user asks:

> Show me another customer's order details.

Your backend should reject the unauthorized request before any private order data is retrieved or returned.

Other examples include:

- Blocking prohibited content for your use case.
- Preventing the model from returning invalid JSON.
- Detecting prompt-injection attempts.
- Checking that a generated discount is within allowed limits.
- Requiring confirmation before issuing a refund.

### Example: validate generated data

```
from pydantic import BaseModel, Fieldclass ProductRecommendation(BaseModel):    product_id: str    reason: str    confidence: float = Field(ge=0, le=1)
```

After receiving structured output, validate it against your schema. Then verify that the product exists, is eligible for the customer, and meets the relevant business constraints.

Schema validation only checks structure and constraints; it does not prove that the recommendation is factually correct.

### A layered guardrail architecture

| Layer          | Example                                              |
| -------------- | ---------------------------------------------------- |
| Input          | Validate request size and detect abuse               |
| Identity       | Authenticate the customer                            |
| Retrieval      | Filter documents by permissions                      |
| Model          | Supply instructions and output constraints           |
| Tool execution | Validate arguments and authorize actions             |
| Output         | Check schemas and sensitive data                     |
| Monitoring     | Log failures, policy violations and unusual behavior |

Security principle: The LLM should not be the final authority on permissions, payment amounts, refunds, or other consequential business actions. Enforce those rules in trusted application code.

## 15. Latency

Latency is the time taken to complete an operation. In an AI application, it is useful to measure both the total request duration and the individual stages.

For example, a customer asks a product question and waits 2.4 seconds for the response.

An illustrative latency breakdown could be:

| Stage                               | Time     |
| ----------------------------------- | -------- |
| Backend processing                  | 50 ms    |
| Embedding generation                | 100 ms   |
| Vector retrieval                    | 80 ms    |
| LLM first-token wait and generation | 1,900 ms |
| Validation and response handling    | 270 ms   |
| Total                               | 2,400 ms |

These are example values, not benchmark results. In a real system, stages may overlap or be measured differently.

### How to reduce latency

- Use a smaller model when quality is sufficient.
- Reduce unnecessary context and output length.
- Improve retrieval and database performance.
- Stream responses to improve perceived responsiveness.
- Run independent operations in parallel.
- Reuse cached results where appropriate.
- Set deadlines and timeouts for external calls.

### Two useful measurements

- TTFT (time to first token): How long before the first generated token arrives.
- End-to-end latency: How long until the complete response is ready.

Streaming can improve perceived responsiveness without necessarily reducing total generation time.

Production tip: Track p50, p95 and p99 latency, not just average latency. A good average can hide a poor experience for a significant minority of users.

## 16. Model routing

Model routing is the process of choosing which model should handle a request based on its requirements, complexity, cost, latency, or available capabilities.

Instead of sending every request to the same expensive model, your backend selects an appropriate model for each task.

### Example

ShopSphere receives three types of requests:

| Request                                               | Possible routing decision    |
| ----------------------------------------------------- | ---------------------------- |
| "Classify this message as a complaint or inquiry"     | Small, fast model            |
| "Explain the return policy using retrieved documents" | Efficient model with RAG     |
| "Analyze a complex product comparison"                | More capable reasoning model |

The exact model choices depend on your quality requirements and provider capabilities.

### Example: Node.js model router

```
type Task = "classification" | "support" | "complex";

function selectModel(task: Task): string {
  switch (task) {
    case "classification":
      return "FAST_MODEL";

    case "support":
      return "STANDARD_MODEL";

    case "complex":
      return "ADVANCED_MODEL";
  }
}

const task: Task = "support";
const model = selectModel(task);

console.log(model);
```

This is a routing demonstration; it selects a model identifier but does not make an API call.

### More advanced routing

A production router might consider:

- Task type and estimated complexity
- Required context length
- Whether image or audio input is needed
- Model availability and rate limits
- Cost budgets
- Recent evaluation results
- Fallback models during provider failures

Important: Route based on measured quality, not just model size. A cheap model that frequently fails may cost more overall because of retries, escalations, and user dissatisfaction.

## 17. Evals (Evaluations)

Evals are systematic tests used to measure how well an AI system performs on a defined set of tasks.

Traditional unit tests usually check exact, deterministic behavior. LLM outputs can vary, so AI systems often require a combination of conventional tests and quality evaluations.

### Example

You update the ShopSphere return-policy documents or change the model.

You need to determine whether the new version still answers questions correctly.

Create a test dataset:

```
test_cases = [    {        "question": "What is the laptop return window?",        "expected_answer": "14 days, subject to eligibility",    },    {        "question": "Can I return a laptop after 30 days?",        "expected_answer": "The standard window is 14 days",    },]
```

These expected answers are illustrative test fixtures.

Run your AI pipeline against each question, then evaluate the output against the expected result and the source evidence.

### Common evaluation dimensions

| Metric              | What it measures                                  |
| ------------------- | ------------------------------------------------- |
| Correctness         | Does the answer match the expected facts?         |
| Faithfulness        | Is the answer supported by the retrieved context? |
| Retrieval recall    | Did retrieval find the relevant evidence?         |
| Retrieval precision | How much of the retrieved material is relevant?   |
| Tool accuracy       | Did the model choose and use the correct tool?    |
| Safety              | Did the system respect its safety requirements?   |
| Latency             | Did the system meet performance targets?          |
| Cost                | Was the response generated within the budget?     |

For retrieval, precision and recall can be measured against labeled relevant documents. For generated answers, exact string matching is often insufficient; use domain-specific checks, reference answers, or carefully validated model-based judges.

### How evals fit into CI/CD

Code or prompt change

Run unit, integration and AI eval tests

Pass

Continue deployment

Fail

Block or investigate

For your GitHub Actions workflows, you can run a curated evaluation dataset on pull requests and a larger suite before production releases.

Not every eval needs to block deployment. Define thresholds for correctness, safety, latency and cost based on the application's risk.

## 18. Tool calling

Tool calling allows a model to request that your application execute a predefined function or external operation.

The model does not automatically gain access to your database or APIs. Your application implements the tools and decides whether a requested call is allowed.

### Example: checking an order

Customer:

> Where is my order 12345?

Your application exposes a tool such as:

```
type OrderStatus = {
  orderId: string;
  status: string;
  estimatedDelivery: string | null;
};

async function getOrderStatus(
  orderId: string,
  authenticatedCustomerId: string
): Promise<OrderStatus> {
  // Query the database after verifying ownership.
  // This is illustrative, not a complete implementation.
  throw new Error("Implement database access");
}
```

The typical flow is:

1. The user asks about an order.
2. The model determines that it needs the order-status tool.
3. The model returns a structured tool-call request.
4. Your backend validates the arguments.
5. Your backend authenticates the customer and authorizes access to that order.
6. Your backend executes the function and returns its result to the model.
7. The model generates a human-readable response.

The model might produce a request resembling:

```
{
  "name": "get_order_status",
  "arguments": {
    "order_id": "12345"
  }
}
```

This is an illustrative representation; actual API formats vary.

### Tool calling versus ordinary API calls

| Ordinary API call                            | LLM tool calling                                        |
| -------------------------------------------- | ------------------------------------------------------- |
| Your code directly chooses the function      | The model proposes a tool and its arguments             |
| Execution is controlled by application logic | Execution still must be controlled by application logic |
| Suitable for predictable workflows           | Useful when the next action depends on user intent      |

### What about side effects?

A tool that reads order status is relatively straightforward. A tool that refunds ₹50,000, cancels an order, or changes a shipping address is more consequential.

For side-effecting tools, use strict argument validation, authorization, idempotency where applicable, transaction handling, and explicit user confirmation when appropriate.

Key principle: The model proposes an action; the backend decides whether that action is permitted and executes it.

## 19. MCP (Model Context Protocol)

MCP is an open protocol for connecting AI applications to external tools, resources, and prompts through a standardized interface.

Think of it as a common integration protocol that can reduce the need for a different custom integration for every AI client and external service.

### Without MCP

Suppose your AI assistant needs access to:

- PostgreSQL-backed business data
- GitHub issues
- Internal documentation
- A filesystem
- Monitoring dashboards

You might build separate integrations for each AI application.

### With MCP

You can implement compatible MCP servers that expose selected capabilities. An MCP-capable client can discover and use those capabilities according to the protocol and the permissions granted.

AI application / MCP host

Model + conversation + tool selection

MCP client

Communicates with MCP servers

Database

MCP server

GitHub

MCP server

Docs

MCP server

### MCP terminology

- Host: The AI application that manages the interaction.
- Client: The component that communicates with an MCP server.
- Server: Exposes capabilities such as tools, resources and prompts.
- Tools: Operations the AI application can request.
- Resources: Data or content the application can access.
- Prompts: Reusable prompt templates exposed by a server.

### MCP versus tool calling

| Tool calling                              | MCP                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A model interaction capability            | A protocol for connecting applications to external capabilities                                              |
| Defines how the model requests a function | Defines how an application discovers and communicates with tools and other server capabilities               |
| The backend executes the tool             | The MCP client/server participate in the integration; execution and permissions depend on the implementation |

They are complementary, not competitors. A model can use tool calling within an application that obtains its available tools through MCP.

Security note: An MCP server is not automatically safe just because it follows a standard protocol. Authenticate connections, limit permissions, validate inputs, and carefully control access to sensitive resources.

## 20. AI workflow

An AI workflow is the complete sequence of operations used to accomplish a task with one or more AI models, external tools, and conventional application logic.

It can be a simple pipeline or a multi-step process with branching, retries, validation and human approval.

### Example: ShopSphere customer-support workflow

Customer asks:

> My order arrived damaged. Can you arrange a replacement?

A production workflow could be:

1\. Receive request

Validate input and authenticate user

2\. Classify intent

Identify a damaged-item replacement request

3\. Retrieve relevant information

Replacement policy + customer's order

4\. Check eligibility

Apply deterministic business rules

5\. Branch on the result

Eligible for replacement

Needs manual review

Not eligible

6\. Request replacementCheck inventory, execute the authorized operation, and return a confirmation.

The branch above is illustrative. The actual eligibility result must come from trusted order data and business rules, not from the model making up a decision.

### Common AI workflow patterns

| Pattern           | Description                                         | Example                                     |
| ----------------- | --------------------------------------------------- | ------------------------------------------- |
| Sequential        | Steps run in a fixed order                          | Retrieve documents, then generate an answer |
| Parallel          | Independent tasks run simultaneously                | Retrieve policy and product information     |
| Conditional       | Choose a path based on a result                     | Route a complaint to a specialist           |
| Retry             | Repeat a failed operation within limits             | Retry a transient model timeout             |
| Human-in-the-loop | A person reviews or approves an action              | Approve a high-value refund                 |
| Agentic           | Model-driven iteration selects tools and next steps | Research a complex product comparison       |

### AI workflow versus AI agent

An AI workflow can be completely deterministic: your code defines every step.

An AI agent typically has more autonomy to choose tools, determine subsequent steps, and iterate toward a goal.

For production systems, use a deterministic workflow when the process is predictable. Introduce agentic behavior where dynamic decision-making provides a measurable benefit, with bounded iterations, permissions and budgets.

# How all 20 concepts fit together

Here is a practical way to remember the relationships.

| Concept         | Main question it answers                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| LLM             | Which model generates or understands the response?                                    |
| Tokens          | How is text represented and measured?                                                 |
| Context window  | How much information can fit into a request?                                          |
| Inference       | How does the model produce a response at runtime?                                     |
| API             | How does your application communicate with a model or service?                        |
| System prompt   | What behavior should the model follow?                                                |
| Temperature     | How much variation should generation allow?                                           |
| Embeddings      | How can text be represented for semantic similarity?                                  |
| Hallucination   | How can a model produce unsupported information?                                      |
| Chunking        | How should documents be split for retrieval?                                          |
| Vector database | Where can embeddings be stored and searched?                                          |
| Fine-tuning     | How can training adapt a model to a task?                                             |
| RAG             | How can external information ground generated answers?                                |
| Guardrails      | How do you enforce safety and application constraints?                                |
| Latency         | How long does the operation take?                                                     |
| Model routing   | Which model should handle a request?                                                  |
| Evals           | How do you measure quality and detect regressions?                                    |
| Tool calling    | How can the model request application functions?                                      |
| MCP             | How can AI applications connect to external capabilities through a standard protocol? |
| AI workflow     | How do all these steps combine to solve a real task?                                  |

## Recommended learning order

Given your backend engineering experience, I recommend learning these concepts in the following practical order:

1. LLM APIs, tokens, context windows, inference and temperature. Build a basic chat endpoint in FastAPI or Node.js.
2. Embeddings, chunking, vector databases and RAG. Build a documentation assistant that answers questions from your own files.
3. Tool calling, guardrails and AI workflows. Connect the assistant to read-only product and order APIs, then add controlled write operations.
4. Evals, latency, model routing and inference scaling. Add automated quality tests, tracing, cost monitoring and failure handling.
5. Fine-tuning and MCP. Explore fine-tuning when evaluations justify it, and MCP when you need standardized tool integrations across AI clients.

A good first project would be a production-oriented RAG assistant for your ShopSphere application, using FastAPI or Node.js, PostgreSQL with pgvector, an LLM API, automated evaluations, and proper authentication. It will let you practice most of these concepts in one realistic system.