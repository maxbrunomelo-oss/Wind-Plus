"use client";

import { PlacementQuestion } from "@/lib/placement/cefrQuestions";

type Props = {
  question: PlacementQuestion;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
};

export default function QuestionCard({ question, selectedOption, onSelect }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {question.context && (
        <div className="mb-4 p-4 bg-[#E30613]/5 border-l-4 border-[#E30613] rounded-r-lg text-sm text-gray-700 italic">
          {question.context}
        </div>
      )}
      <p className="text-gray-900 font-medium text-base md:text-lg mb-6 leading-relaxed">
        {question.prompt}
      </p>
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm md:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#E30613]/40 focus:ring-offset-1 ${
                isSelected
                  ? "border-[#E30613] bg-[#E30613]/5 text-[#111111] font-medium"
                  : "border-gray-200 bg-white text-gray-800 hover:border-[#E30613]/40 hover:bg-[#E30613]/5"
              }`}
              aria-pressed={isSelected}
            >
              <span className={`font-semibold mr-2 ${isSelected ? "text-[#E30613]" : "text-gray-400"}`}>
                {opt.id.toUpperCase()}.
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
