## 7. No Code-Level Assistance to the LLM During Graph Pipeline Runs.

- When an LLM is used inside a pipeline node (graph run), **all understanding, parsing, sanitizing, and decision-making must be left entirely to the LLM**.
- Do **NOT** write code that pre-processes, hints, regex-matches, keyword-maps, or otherwise "helps" the LLM figure out the user's intent or extract dimensions/filters/values.
- The whole point of having an LLM in the pipeline is that it handles language understanding autonomously. Any such assistance belongs **only in the prompt/config** (system prompt, examples, instructions), never in code.
- If the LLM is not producing the correct output, fix it by improving the **prompt, worked examples, or model choice** — not by adding code that does part of the LLM's job.

## 8. Editing Agent's System Prompts
- System prompts stands only for giving instructions to the model. The model should never do any calculations or anything that can be done by code.
- Examples in the system prompts must be generic, never include specific values. Examples from my prespective stands for showing the model the structure and types.
