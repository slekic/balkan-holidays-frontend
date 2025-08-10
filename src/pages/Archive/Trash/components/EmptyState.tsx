import React from "react";
import { Trash2 } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Trash is empty
      </h3>
      <p className="text-gray-600">No deleted offers found.</p>
    </div>
  );
};
