import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  fields: {
    name: string;
    label: string;
    type: string;
    value: string;
  }[];
  onChange: (name: string, value: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg w-full max-w-[500px] max-h-[500px] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/80">
          <h2 className="text-xl font-medium text-[#1B3A4B]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-sm text-[#78909C] block mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-full border border-gray-300/80 rounded-md p-2.5 bg-white/80 focus:outline-none focus:ring-1 focus:ring-[#1B3A4B] focus:border-[#1B3A4B]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/80 flex justify-end space-x-3">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#1B3A4B] text-white rounded-md hover:bg-[#152c39] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal; 