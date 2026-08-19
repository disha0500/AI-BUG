import time
from datetime import datetime
from typing import Any

import streamlit as st

from core.detector import BugDetector, describe_api_error, is_api_key_configured, parse_dashboard_report


LANGUAGES = ["Python", "Java", "C", "C++", "JavaScript", "TypeScript"]
EXAMPLES = {
    "Python": """def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)

print(calculate_average([]))
""",
    "Java": """public class Main {
    public static void main(String[] args) {
        String name = null;
        System.out.println(name.length());
    }
}
""",
    "C++": """#include <iostream>
int main() {
    int divisor = 0;
    std::cout << 10 / divisor;
}
""",
    "JavaScript": """function getUserName(user) {
  return user.name.toUpperCase();
}
console.log(getUserName(null));
""",
}


st.set_page_config(page_title="AI Bug Detection Dashboard", page_icon="🐛", layout="wide")
st.markdown(
    """<style>
    .stApp { background: radial-gradient(circle at 75% -20%, #192b62 0, #07101f 36%, #050b16 100%); color: #eef2ff; }
    [data-testid="stHeader"] { background: rgba(5, 11, 22, .78); }
    [data-testid="stSidebar"] { background: linear-gradient(180deg, #0b1325, #080f1d); border-right: 1px solid #1e2b45; }
    [data-testid="stSidebar"] .stRadio label { padding: .72rem .9rem; border-radius: .7rem; margin: .18rem 0; color: #c9d2ee; }
    [data-testid="stSidebar"] .stRadio label:has(input:checked) { background: linear-gradient(90deg, #5b21e6, #3630c9); color: #fff; }
    h1, h2, h3 { color: #f8fafc !important; }
    .brand-subtitle, .muted { color: #a8b3cf; }
    .gradient-title { background: linear-gradient(90deg, #b948ff, #437dff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .connected { color: #38e59a; font-weight: 700; }
    .offline { color: #fb7185; font-weight: 700; }
    [data-testid="stMetric"] { background: linear-gradient(145deg, rgba(15, 28, 53, .9), rgba(8, 17, 34, .96)); border: 1px solid #25385a; border-radius: 14px; padding: 1.15rem; }
    [data-testid="stMetricLabel"] { color: #bac6e2; }
    [data-testid="stMetricValue"] { color: #ffffff; }
    [data-testid="stTextArea"] textarea, [data-testid="stSelectbox"] div[data-baseweb="select"] > div { background: #091426 !important; border-color: #293d61 !important; color: #eef2ff !important; }
    [data-testid="stTextArea"] textarea { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; line-height: 1.55; }
    .stButton > button { border-radius: 10px; border: 1px solid #334664; background: #111d34; color: #e8edff; font-weight: 600; }
    .stButton > button[kind="primary"] { border: 0; background: linear-gradient(90deg, #7c24ee, #2563eb); color: white; }
    .panel { background: rgba(8, 19, 38, .78); border: 1px solid #263a5b; border-radius: 16px; padding: 1.25rem 1.4rem; }
    .issue-critical { border-left: 4px solid #f43f5e; } .issue-high { border-left: 4px solid #fb923c; }
    .issue-medium { border-left: 4px solid #facc15; } .issue-low { border-left: 4px solid #34d399; }
    </style>""",
    unsafe_allow_html=True,
)


def initial_report() -> dict[str, Any]:
    return {"bugs": [], "summary": "", "quality_score": None}


def counts_for(report: dict[str, Any]) -> dict[str, int]:
    counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for bug in report.get("bugs", []):
        severity = str(bug.get("severity", "")).upper()
        if severity in counts:
            counts[severity] += 1
    return counts


def highest(counts: dict[str, int]) -> str:
    return next((level for level in ("CRITICAL", "HIGH", "MEDIUM", "LOW") if counts[level]), "NONE")


def badge(severity: str) -> str:
    return {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢", "NONE": "✓"}.get(severity, "⚪")


def load_example(language: str) -> None:
    st.session_state.language_input = language
    st.session_state.code_input = EXAMPLES[language]


def clear_code() -> None:
    st.session_state.code_input = ""


def render_header(connected: bool) -> None:
    heading, status = st.columns([5, 1])
    with heading:
        st.markdown("## Welcome to <span class='gradient-title'>AI Bug Detection</span> Dashboard", unsafe_allow_html=True)
        st.markdown("<p class='brand-subtitle'>Find. Understand. Fix. — AI-powered source code analysis</p>", unsafe_allow_html=True)
    with status:
        st.markdown("<br>", unsafe_allow_html=True)
        label = "● Gemini Connected" if connected else "● Gemini Not Connected"
        css_class = "connected" if connected else "offline"
        st.markdown(f"<span class='{css_class}'>{label}</span>", unsafe_allow_html=True)


def render_metrics(report: dict[str, Any]) -> None:
    counts = counts_for(report)
    total = sum(counts.values())
    score = report.get("quality_score")
    metrics = st.columns(4)
    metrics[0].metric("🐛  Total Bugs", total, "Across this analysis")
    metrics[1].metric("❗  Critical", counts["CRITICAL"], "Needs immediate attention")
    metrics[2].metric("📈  High", counts["HIGH"], "High priority issues")
    metrics[3].metric("🛡️  Code Quality", f"{score} / 100" if isinstance(score, int) else "--", "Run analysis to score")


def run_analysis(language: str, code: str) -> None:
    if not code.strip():
        st.warning("Please enter some code.")
        return
    try:
        started = time.perf_counter()
        with st.spinner("Gemini is reviewing your code..."):
            raw_analysis = BugDetector().analyze(language, code)
        elapsed = time.perf_counter() - started
    except ValueError as error:
        st.error(str(error))
        return
    except Exception as error:
        st.error(describe_api_error(error))
        return

    report = parse_dashboard_report(raw_analysis)
    st.session_state.raw_analysis = raw_analysis
    st.session_state.report = report if report is not None else initial_report()
    st.session_state.analysis_time = elapsed
    st.session_state.last_code = code
    st.session_state.last_language = language
    counts = counts_for(st.session_state.report)
    st.session_state.history.insert(0, {
        "language": language,
        "bugs": sum(counts.values()) if report else "—",
        "severity": highest(counts) if report else "Text report",
        "time": datetime.now().strftime("%H:%M"),
    })
    st.rerun()


def render_analyzer() -> None:
    st.markdown("<div class='panel'>", unsafe_allow_html=True)
    st.markdown("### &lt;/&gt;  Analyze Your Code")
    st.markdown("<p class='muted'>Paste your source code below and let AI find the issues.</p>", unsafe_allow_html=True)
    language_col, examples_col = st.columns([1.2, 1.2])
    with language_col:
        language = st.selectbox("Programming Language", LANGUAGES, key="language_input")
    with examples_col:
        st.caption("EXAMPLES")
        buttons = st.columns(4)
        for column, example_language in zip(buttons, EXAMPLES):
            column.button(example_language, key=f"example_{example_language}", on_click=load_example, args=(example_language,))
    code = st.text_area("Source Code", height=300, placeholder="Paste your code here...", key="code_input")
    clear_column, action_column = st.columns([1, 2])
    with clear_column:
        st.button("🗑 Clear Code", key="clear_code_button", on_click=clear_code, use_container_width=True)
    with action_column:
        if st.button("🔍 Analyze Code", key="analyze_code_button", type="primary", use_container_width=True):
            run_analysis(language, code)
    st.markdown("</div>", unsafe_allow_html=True)


def render_report() -> None:
    raw_analysis = st.session_state.raw_analysis
    if not raw_analysis:
        return
    report = st.session_state.report
    parsed = parse_dashboard_report(raw_analysis)
    st.divider()
    if parsed is None:
        st.subheader("🧠 Bug Analysis")
        st.warning("Gemini returned a readable report, but not dashboard JSON. Showing the clean report instead.")
        st.markdown(raw_analysis)
        return

    counts = counts_for(report)
    st.subheader("🐛 Bug Summary")
    summary_metrics = st.columns(4)
    for column, severity in zip(summary_metrics, ("CRITICAL", "HIGH", "MEDIUM", "LOW")):
        column.metric(f"{badge(severity)} {severity.title()}", counts[severity])
    if report.get("summary"):
        st.info(str(report["summary"]))
    if not report.get("bugs"):
        st.success("No bugs detected.")
        return

    for number, bug in enumerate(report["bugs"], start=1):
        severity = str(bug.get("severity", "LOW")).upper()
        st.markdown(f"<div class='issue-{severity.lower()}'></div>", unsafe_allow_html=True)
        with st.expander(f"{badge(severity)} {severity} — {bug.get('type', 'Issue')}  ·  Bug #{number}", expanded=True):
            details, reasoning = st.columns(2)
            with details:
                st.caption("LOCATION")
                st.write(bug.get("location", "Not specified"))
                st.caption("PROBLEM")
                st.write(bug.get("problem", "Not specified"))
                st.caption("IMPACT")
                st.write(bug.get("impact", "Not specified"))
            with reasoning:
                st.caption("EXPLANATION")
                st.write(bug.get("explanation", "Not specified"))
                st.caption("SUGGESTED FIX")
                st.write(bug.get("suggested_fix", "Not specified"))
            fixed_code = bug.get("corrected_code")
            if fixed_code:
                st.markdown("#### 🛠 Suggested Fix")
                original, corrected = st.columns(2)
                with original:
                    st.caption("ORIGINAL CODE")
                    st.code(st.session_state.last_code, language=st.session_state.last_language.lower())
                with corrected:
                    st.caption("CORRECTED CODE")
                    st.code(fixed_code, language=st.session_state.last_language.lower())


for key, value in {
    "report": initial_report(), "raw_analysis": "", "analysis_time": None, "history": [],
    "code_input": "", "language_input": "Python", "last_code": "", "last_language": "Python",
}.items():
    if key not in st.session_state:
        st.session_state[key] = value

connected = is_api_key_configured()
with st.sidebar:
    st.markdown("## 🐛 AI Bug Detector")
    st.markdown("<p class='brand-subtitle'>Smart Code Analysis</p>", unsafe_allow_html=True)
    st.divider()
    page = st.radio("Navigation", ["⌂  Dashboard", "⌘  Code Analyzer", "◷  History", "⚙  Settings"], key="navigation", label_visibility="collapsed")
    st.divider()
    st.caption("AI MODEL")
    st.markdown("**Gemini 3.6 Flash**")
    st.markdown("<span class='connected'>● Connected</span>" if connected else "<span class='offline'>● Not Connected</span>", unsafe_allow_html=True)
    st.divider()
    st.caption("HELP & SUPPORT")
    st.write("Paste source code, choose its language, and run one secure AI analysis.")

if page == "◷  History":
    st.title("Recent Analyses")
    if not st.session_state.history:
        st.info("No analyses yet. Run your first code review from Code Analyzer.")
    else:
        for entry in st.session_state.history:
            st.markdown(f"<div class='panel'><b>{entry['language']}</b><br>{entry['bugs']} bugs · {entry['severity']}<br><span class='muted'>{entry['time']}</span></div><br>", unsafe_allow_html=True)
elif page == "⚙  Settings":
    st.title("Settings")
    st.subheader("Gemini Connection")
    if connected:
        st.success("Gemini API key is configured. The key is never shown in the dashboard.")
    else:
        st.warning("Google Gemini API key is not configured. Add GOOGLE_API_KEY to .env, then restart Streamlit.")
    st.caption("All analysis stays non-executing: submitted code is sent to Gemini for review and is never run locally.")
else:
    render_header(connected)
    render_metrics(st.session_state.report)
    st.markdown("<br>", unsafe_allow_html=True)
    render_analyzer()
    if page == "⌂  Dashboard" and not st.session_state.raw_analysis:
        st.markdown("<br><div class='panel'><h3>🧠 Ready to Analyze</h3><p class='muted'>Load an example or paste source code above to find bugs, security issues, and improvements.</p></div>", unsafe_allow_html=True)
    render_report()
    if page == "⌂  Dashboard":
        st.divider()
        st.subheader("◷ Recent Analyses")
        if st.session_state.history:
            for entry in st.session_state.history[:3]:
                st.write(f"**{entry['language']}** · {entry['bugs']} bugs · {entry['severity']} · {entry['time']}")
        else:
            st.caption("No analyses yet — run your first code analysis to see results here.")
