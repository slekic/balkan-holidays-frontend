import React from "react";
import { X, Plus } from "lucide-react";
import { Slide, SlideType, slideTypeLabels } from "../utils/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (type: SlideType) => void;
  newSlideType: SlideType;
  setNewSlideType: (t: SlideType) => void;
};

export default function AddSlideModal({ open, onClose, onAdd, newSlideType, setNewSlideType }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dodaj novi slajd</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip slajda</label>
              <select value={newSlideType} onChange={(e) => setNewSlideType(e.target.value as SlideType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="general">Opšti slajd</option>
                <option value="what-to-expect">What to Expect</option>
                <option value="day">Dan slajd</option>
                <option value="hotel">Hotel slajd</option>
                <option value="restaurant">Restoran slajd</option>
                <option value="gift">Poklon slajd</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {newSlideType === "general" && "Kreiraj prilagođeni slajd sa naslovom, opisom i logoom"}
                {newSlideType === "what-to-expect" && "Fiksni šablon slajda sa informacijama o uslugama kompanije"}
                {newSlideType === "day" && "Slajd sa planom putovanja po danima, slikama i opisom"}
                {newSlideType === "hotel" && "Slajd sa informacijama o hotelu, pogodnostima i slikama"}
                {newSlideType === "restaurant" && "Prikaz restorana sa opisom kuhinje i ambijenta"}
                {newSlideType === "gift" && "Detalji poklon paketa sa cenom i sadržajem"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Otkaži</button>
          <button onClick={() => onAdd(newSlideType)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Dodaj slajd</button>
        </div>
      </div>
    </div>
  );
}


