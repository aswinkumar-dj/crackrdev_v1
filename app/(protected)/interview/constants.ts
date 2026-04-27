export const roleOptions = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Android",
  "Data Engineering",
  "Machine Learning",
  "Data Science",
  "DevOps",
] as const;

export const yoeOptions = ["Fresher", "1-2 years", "3-5 years", "5+"] as const;

export const difficultyOptions = [
  { label: "Easy", tintClass: "bg-green-50 text-green-700" },
  { label: "Medium", tintClass: "bg-yellow-50 text-yellow-700" },
  { label: "Hard", tintClass: "bg-red-50 text-red-700" },
] as const;

export const roleBreakdowns = [
  {
    role: "Frontend",
    easy: "JS/CSS/React basics",
    medium: "React deep dive, performance, browser internals",
    hard: "Frontend system design + DSA",
  },
  {
    role: "Backend",
    easy: "Language fundamentals, basic CRUD, OOP",
    medium: "DSA + DB design, APIs",
    hard: "System design + DSA hard",
  },
  {
    role: "Full Stack",
    easy: "Both basics",
    medium: "Both medium level",
    hard: "Both hard level",
  },
  {
    role: "Android",
    easy: "Kotlin/Java basics",
    medium: "Android internals, Jetpack",
    hard: "Architecture + DSA",
  },
  {
    role: "Data Engineering",
    easy: "SQL and pipeline basics",
    medium: "ETL, data pipelines",
    hard: "Distributed systems + DSA",
  },
  {
    role: "Machine Learning",
    easy: "Python basics, ML concepts",
    medium: "Model building, feature engineering",
    hard: "MLOps, research-level system design",
  },
  {
    role: "Data Science",
    easy: "Stats, SQL, EDA",
    medium: "Advanced SQL, ML, visualization",
    hard: "End-to-end pipelines, case studies",
  },
  {
    role: "DevOps",
    easy: "Linux, Docker, basic CI/CD",
    medium: "Kubernetes, infra design, scripting",
    hard: "Large-scale infra, SRE, system design",
  },
] as const;

export const activePillClass = "border-[#17a1a6] bg-[#e8f5f4] text-[#127d82]";

export const inactivePillClass =
  "border-[#cfe3e1] bg-white text-[#536461] hover:border-[#17a1a6] hover:text-[#127d82]";
