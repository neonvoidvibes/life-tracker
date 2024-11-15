"use client";

import { FC, useState, useEffect } from "react";

type Status = "pending" | "prioritized" | "doing" | "paused" | "completed";
type Section =
  | "PERSONAL"
  | "PROJECT"
  | "P_OUTCOMES"
  | "NEAR_OUTCOMES"
  | "LONG_OUTCOMES";

interface Stage {
  id: string;
  name: string;
  status: Status;
  type?: "outcome";
}

interface Stages {
  PERSONAL: Stage[];
  P_OUTCOMES: Stage[];
  PROJECT: Stage[];
  NEAR_OUTCOMES: Stage[];
  LONG_OUTCOMES: Stage[];
}

const INITIAL_STAGES: Stages = {
  PERSONAL: [
    { id: "aiea", name: "AI/EA Progress Tracking App", status: "doing" },
    { id: "iosapp", name: "iOS App co-built by AI", status: "doing" },
  ],
  P_OUTCOMES: [
    {
      id: "agency",
      name: "High-level Agency",
      status: "pending",
      type: "outcome",
    },
    {
      id: "financial",
      name: "Financial Security",
      status: "pending",
      type: "outcome",
    },
  ],
  PROJECT: [
    {
      id: "infra",
      name: "Basic Infrastructure (AI-OS Demo)",
      status: "pending",
    },
    { id: "labs", name: "Continuous Labs/Events", status: "pending" },
    { id: "memo", name: "Memo Paper", status: "pending", type: "outcome" },
    {
      id: "conference",
      name: "Wisdom & AI Conference Stockholm",
      status: "pending",
    },
    {
      id: "presentation",
      name: "Presentation Paper",
      status: "pending",
      type: "outcome",
    },
    {
      id: "partners",
      name: "Business Partners Alignment",
      status: "pending",
    },
    {
      id: "tokenpaper",
      name: "Token Paper",
      status: "pending",
    },
    {
      id: "blueprint",
      name: "Blueprint Paper: Prediction is all you need",
      status: "pending",
    },
    { id: "funding", name: "Project Funding", status: "pending" },
  ],
  NEAR_OUTCOMES: [
    {
      id: "community",
      name: "Community Building",
      status: "pending",
      type: "outcome",
    },
    {
      id: "os",
      name: "Open Source AI-augmented OS",
      status: "pending",
      type: "outcome",
    },
    {
      id: "token",
      name: "River Funding via $RIVR Token",
      status: "pending",
      type: "outcome",
    },
  ],
  LONG_OUTCOMES: [
    { id: "school", name: "Neo in Regenerative School", status: "pending" },
    {
      id: "village",
      name: "Family in Regenerative Village",
      status: "pending",
    },
  ],
};

const ProgressionTracker: FC = () => {
  const [stages, setStages] = useState<Stages>(INITIAL_STAGES);

  const getTitleKey = (title: string): Section => {
    const mapping: Record<string, Section> = {
      "Personal Outcomes": "P_OUTCOMES",
      Personal: "PERSONAL",
      Project: "PROJECT",
      "Near Outcomes": "NEAR_OUTCOMES",
      "Long-Term Outcomes": "LONG_OUTCOMES",
    };
    return mapping[title];
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const VERSION = "0.2";
      const savedVersion = localStorage.getItem("progressionVersion");
      const savedStages = localStorage.getItem("progressionStages");
      if (savedStages) {
        try {
          const parsedStages = JSON.parse(savedStages);
          // Simply use the parsed stages directly to maintain order
          setStages(parsedStages);
          localStorage.setItem("progressionVersion", VERSION);
        } catch (e) {
          console.error("Error parsing saved stages:", e);
          setStages(INITIAL_STAGES);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("progressionStages", JSON.stringify(stages));
  }, [stages]);

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case "pending":
        return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
      case "prioritized":
        return "bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
      case "doing":
        return "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200";
      case "paused":
        return "bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-200";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
    }
  };

  useEffect(() => {
    console.log("Stages updated:", stages);
  }, [stages]);

  const getItemBackgroundColor = (type?: string): string => {
    return type === "outcome"
      ? "bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
      : "bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600";
  };

  const getNextStatus = (status: Status): Status => {
    const sequence: Status[] = [
      "pending",
      "prioritized",
      "doing",
      "paused",
      "completed",
    ];
    const currentIndex = sequence.indexOf(status);
    console.log("Current status index:", currentIndex);
    return sequence[(currentIndex + 1) % sequence.length];
  };

  const toggleStatus = (section: Section, id: string): void => {
    console.log("Toggling status:", { section, id });
    setStages((prev) => {
      // Create a proper deep copy using spread operator
      const newStages = {
        ...prev,
        [section]: prev[section].map((item) => {
          if (item.id === id) {
            const nextStatus = getNextStatus(item.status);
            console.log("Updating status from", item.status, "to", nextStatus);
            return { ...item, status: nextStatus };
          }
          return item;
        }),
      };

      console.log("New stages:", newStages);
      return newStages;
    });
  };

  const formatStatus = (status: Status): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderSection = (title: string, items: Stage[]) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 transform hover:scale-[1.01] ${getItemBackgroundColor(item.type)}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <button
                onClick={() => toggleStatus(getTitleKey(title), item.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(item.status)}`}
              >
                {formatStatus(item.status)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setStages(INITIAL_STAGES);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Life Tracker</h1>
        <button
          onClick={resetProgress}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          Reset Progress
        </button>
      </div>
      {renderSection("Personal", stages.PERSONAL)}
      {renderSection("Personal Outcomes", stages.P_OUTCOMES)}
      {renderSection("Project", stages.PROJECT)}
      {renderSection("Near Outcomes", stages.NEAR_OUTCOMES)}
      {renderSection("Long-Term Outcomes", stages.LONG_OUTCOMES)}
    </div>
  );
};

export default ProgressionTracker;
