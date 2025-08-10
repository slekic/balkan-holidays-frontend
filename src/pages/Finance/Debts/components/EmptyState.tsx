import React from "react";
import { Euro } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <Euro className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nema neizmirenih dugovanja
      </h3>
      <p className="text-gray-600">
        Sve ponude su u potpunosti plaćene ili nijedna ne odgovara zadatim
        kriterijumima.
      </p>
    </div>
  );
}
