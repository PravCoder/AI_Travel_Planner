// ScheduleItem.tsx
import React from 'react';
import { TimeBlock } from './ScheduleUtils';

interface ScheduleItemProps {
    item: TimeBlock;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ item, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-3 mb-2 bg-white rounded shadow" >
            <div className="flex-1" >
                <div className="font-semibold" > {item.label} </div>
                < div className="text-sm text-gray-600" >
                    {item.startTime} - {item.endTime}
                </div>
            </div>
            < div className="flex gap-2" >
                <button
                    onClick={() => onEdit(item.id)}
                    className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
                >
                    Edit
                </button>
                < button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ScheduleItem;
