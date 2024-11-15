"use client";

import { FC, useState, useEffect } from "react";

type Status = "not_started" | "prioritized" | "doing" | "paused" | "completed";
type Section = "PERSONAL" | "PROJECT" | "OUTCOMES";

interface Stage {
  id: string;
  name: string;
  status: Status;
  type?: "paper";
}

interface Stages {
  PERSONAL: Stage[];
  PROJECT: Stage[];
  OUTCOMES: Stage[];
}

const INITIAL_STAGES: Stages = {
  PERSONAL: [
    { id: "aiea", name: "AI/EA Progress Tracking App", status: "doing" },
    { id: "iosapp", name: "iOS App co-built by AI", status: "doing" },
    { id: "agency", name: "High-level Agency", status: "not_started" },
    { id: "financial", name: "Financial Security", status: "not_started" },
  ],
  PROJECT: [
    {
      id: "infra",
      name: "Basic Infrastructure (AI-OS Demo)",
      status: "not_started",
    },
    { id: "labs", name: "Continuous Labs/Events", status: "not_started" },
    { id: "memo", name: "Memo Paper", status: "not_started", type: "paper" },
    {
      id: "conference",
      name: "Wisdom & AI Conference Stockholm",
      status: "not_started",
    },
    {
      id: "presentation",
      name: "Presentation Paper",
      status: "not_started",
      type: "paper",
    },
    {
      id: "partners",
      name: "Business Partners Alignment",
      status: "not_started",
    },
    {
      id: "blueprint",
      name: "Blueprint Paper: Prediction is all you need",
      status: "not_started",
      type: "paper",
    },
    { id: "funding", name: "Project Funding", status: "not_started" },
    { id: "community", name: "Community Building", status: "not_started" },
    { id: "os", name: "Open Source AI-augmented OS", status: "not_started" },
    {
      id: "tokenpaper",
      name: "Token Paper",
      status: "not_started",
      type: "paper",
    },
    {
      id: "token",
      name: "River Funding via $RIVR Token",
      status: "not_started",
    },
  ],
  OUTCOMES: [
    { id: "school", name: "Neo in Regenerative School", status: "not_started" },
    {
      id: "village",
      name: "Family in Regenerative Village",
      status: "not_started",
    },
  ],
};

const ProgressionTracker: FC = () => {
  const [stages, setStages] = useState<Stages>(INITIAL_STAGES);

  useEffect(() => {
    const savedStages = localStorage.getItem("progressionStages");
    if (savedStages) {
      setStages(JSON.parse(savedStages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("progressionStages", JSON.stringify(stages));
  }, [stages]);

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case "not_started":
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

  const getNextStatus = (status: Status): Status => {
    const sequence: Status[] = [
      "not_started",
      "prioritized",
      "doing",
      "paused",
      "completed",
    ];
    const currentIndex = sequence.indexOf(status);
    return sequence[(currentIndex + 1) % sequence.length];
  };

  const toggleStatus = (section: Section, id: string): void => {
    setStages((prev) => {
      const newStages = { ...prev };
      const item = newStages[section].find((item) => item.id === id);
      if (item) {
        item.status = getNextStatus(item.status);
      }
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
            className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <button
                onClick={() =>
                  toggleStatus(title.toUpperCase() as Section, item.id)
                }
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
        <h1 className="text-2xl font-bold">Future Progression Tracker</h1>
        <button
          onClick={resetProgress}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          Reset Progress
        </button>
      </div>
      {renderSection("Personal", stages.PERSONAL)}
      {renderSection("Project", stages.PROJECT)}
      {renderSection("Outcomes", stages.OUTCOMES)}
    </div>
  );
};

export default ProgressionTracker;
