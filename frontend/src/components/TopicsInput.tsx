import { useState, useEffect } from "react";

interface TopicsInputProps {
  onChange: (topics: string[]) => void;
  initialTopics?: string[];
}

export const TopicsInput: React.FC<TopicsInputProps> = ({ onChange, initialTopics = [] }) => {
  const [value, setValue] = useState<string>(initialTopics.join(", "));

  useEffect(() => {
    // Notify parent about initial topics
    onChange(initialTopics);
  }, [initialTopics, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const topics = e.target.value.split(",").map((topic) => topic.trim());
    onChange(topics);
  };

  return (
    <div className="mt-6">
      <label className="block text-gray-700 font-medium mb-2">Enter Topics (comma-separated):</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="e.g., Technology, AI, React"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};
