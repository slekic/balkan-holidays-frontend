import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  pagesPerBatch: number;
  currentBatch: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  pagesPerBatch,
  currentBatch,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // ----- Lokalni page-i unutar batch-a -----
  const totalLocalPages = Math.ceil(totalItems / itemsPerPage) - (currentBatch - 1) * pagesPerBatch;
  const localPages: number[] = [];
  for (let i = 1; i <= Math.min(pagesPerBatch, totalLocalPages); i++) {
    localPages.push(i);
  }

  // ----- Globalna numeracija -----
  const globalPageNumber = (localPage: number) =>
    (currentBatch - 1) * pagesPerBatch + localPage;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-700">
        Prikazano {startIndex + 1} do {endIndex} od ukupno {totalItems} ponuda
      </p>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prethodna
        </button>

        <div className="flex space-x-1">
          {localPages.map((localPage) => {
            const globalPage = globalPageNumber(localPage);
            return (
              <button
                key={localPage}
                onClick={() => onPageChange(globalPage)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === globalPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {globalPage}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sledeća
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
