"""Gemini-powered source-code bug analysis helpers."""

import json
import os
import re
from typing import Any

from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()


SYSTEM_PROMPT = """You are an expert software engineer, debugger, security reviewer,
and code-quality analyst. Analyze only genuine issues in the supplied source code.
Check syntax, runtime, logic, security, performance, exception handling, API usage,
edge cases, and code quality. Do not invent bugs and never execute the source code.

Return ONLY valid JSON, with no Markdown fences or commentary, matching this shape:
{{
  "summary": "short human-readable summary",
  "total_bugs": 0,
  "critical": 0,
  "high": 0,
  "medium": 0,
  "low": 0,
  "quality_score": null,
  "bugs": [
    {{
      "type": "Runtime Error",
      "severity": "HIGH",
      "location": "Line 3",
      "problem": "what is wrong",
      "explanation": "why it happens",
      "impact": "what it causes",
      "suggested_fix": "how to fix it",
      "corrected_code": "complete corrected source code"
    }}
  ]
}}

Severity must be exactly LOW, MEDIUM, HIGH, or CRITICAL. Include every required
field for each bug. If there are no genuine bugs, return an empty bugs array and
say "No bugs detected." in summary. quality_score must be an integer from 0 to 100
only when you can reasonably assess it; otherwise use null. Preserve the language.
"""


def is_api_key_configured() -> bool:
    """Return whether a non-placeholder Gemini key is available."""
    api_key = os.getenv("GOOGLE_API_KEY")
    return bool(api_key and api_key != "YOUR_GEMINI_API_KEY")


def describe_api_error(error: Exception) -> str:
    """Turn a Gemini API exception into a safe, actionable UI message."""
    status_code = getattr(error, "status_code", None)
    message = str(error).lower()

    if status_code in (401, 403) or "api key" in message or "permission" in message:
        return "Gemini rejected the API key. Add a valid key to .env and enable the Gemini API for it."
    if status_code == 429 or "resource exhausted" in message or "quota" in message:
        return "Gemini quota or rate limit reached. Wait a moment or check your Gemini API quota."
    if status_code == 404 or "not found" in message:
        return "The configured Gemini model is unavailable for this API key. Verify model access in Google AI Studio."
    if "timeout" in message or "connection" in message or "network" in message:
        return "Could not reach Gemini. Check your internet connection and try again."

    safe_detail = re.sub(r"AIza[\w-]+", "[REDACTED]", str(error))
    return f"Gemini API request failed: {safe_detail[:300]}"


def extract_generated_text(content: object) -> str:
    """Return only Gemini text blocks, omitting signatures and response metadata."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text_blocks = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                text = block.get("text")
            elif getattr(block, "type", None) == "text":
                text = getattr(block, "text", None)
            else:
                text = None
            if isinstance(text, str):
                text_blocks.append(text)
        return "\n".join(text_blocks)
    return ""


def parse_dashboard_report(text: str) -> dict[str, Any] | None:
    """Parse Gemini JSON, including a harmless Markdown-fence fallback."""
    candidates = [text.strip()]
    fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL | re.IGNORECASE)
    if fenced:
        candidates.append(fenced.group(1).strip())

    for candidate in candidates:
        try:
            report = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(report, dict) and isinstance(report.get("bugs", []), list):
            return report
    return None


class BugDetector:
    """Send one source-code review request to Google Gemini through LangChain."""

    def __init__(self) -> None:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not is_api_key_configured():
            raise ValueError("Google Gemini API key is not configured. Please check your .env file.")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
            google_api_key=api_key,
        )
        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                (
                    "human",
                    "Programming Language: {language}\n\n"
                    "Source Code:\n```{language}\n{code}\n```\n\n"
                    "Return the JSON bug analysis now.",
                ),
            ]
        )

    def analyze(self, language: str, code: str) -> str:
        """Return clean generated text for the supplied code, without metadata."""
        messages = self.prompt.format_messages(language=language, code=code)
        response = self.llm.invoke(messages)
        analysis = extract_generated_text(response.content)
        if not analysis:
            raise RuntimeError("Gemini returned no readable analysis text.")
        return analysis
