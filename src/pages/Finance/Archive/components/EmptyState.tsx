import React from "react";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export default function EmptyState({ 
  message = "Nema pronađenih ponuda",
  description = "Pokušaj da izmeniš pretragu ili filtere."
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}
