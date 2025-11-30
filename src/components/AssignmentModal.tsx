import React from 'react';
import { Assignment } from '../types';

interface AssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export function AssignmentModal({ assignment, onClose }: AssignmentModalProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{assignment.title}</h2>
        <p className="text-gray-700 mb-4">{assignment.description}</p>
        <p className="text-gray-600">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
}