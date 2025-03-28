// Schedule.tsx - Fixed Week and Month Headers
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    TimeBlock,
    validateTimeRange,
    convertScheduleToJSON,
    parseScheduleFromJSON,
    DAYS_OF_WEEK,
    MONTHS,
    formatDateToISO,
    getTodayISO,
    formatReadableDate,
    getDayOfMonth,
    getMonthName,
    getYear,
    getDayName,
    getWeekDates,
    getMonthGrid,
    addMonths,
    addWeeks
} from './ScheduleUtils';
import '../../styles/Schedule.css';

type ViewType = 'day' | 'week' | 'month';

const Schedule: React.FC = () => {
    const [schedule, setSchedule] = useState<TimeBlock[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        label: '',
        description: '',
        color: '#3B82F6',
        date: getTodayISO(),
    });
    const [error, setError] = useState<string | null>(null);
    const [viewType, setViewType] = useState<ViewType>('week');
    const [currentDate, setCurrentDate] = useState<string>(getTodayISO());
    const [weekDates, setWeekDates] = useState<string[]>(getWeekDates(getTodayISO()));
    const [monthDates, setMonthDates] = useState<string[]>([]);

    // Define hours for the day (24-hour format internally)
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Color options
    const colorOptions = [
        { color: '#3B82F6', name: 'Blue' },
        { color: '#10B981', name: 'Green' },
        { color: '#F59E0B', name: 'Yellow' },
        { color: '#EF4444', name: 'Red' },
        { color: '#8B5CF6', name: 'Purple' },
        { color: '#EC4899', name: 'Pink' },
        { color: '#6B7280', name: 'Gray' },
        { color: '#0369A1', name: 'Sky Blue' },
    ];

    // Update week and month dates when current date changes
    useEffect(() => {
        setWeekDates(getWeekDates(currentDate));

        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        setMonthDates(getMonthGrid(year, month));
    }, [currentDate]);

    // Format hour for display with AM/PM
    const formatDisplayHour = (hour: number) => {
        const displayHour = hour % 12 || 12;
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${displayHour}:00 ${period}`;
    };

    // Format time
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const selectColor = (color: string) => {
        setFormData({
            ...formData,
            color: color
        });
    };

    const resetForm = () => {
        setFormData({
            startTime: '',
            endTime: '',
            label: '',
            description: '',
            color: '#3B82F6',
            date: currentDate,
        });
        setCurrentBlock(null);
        setError(null);
    };

    const openAddModal = (hour?: number, date?: string) => {
        resetForm();

        // If a specific hour and date were clicked
        const selectedDate = date || currentDate;

        if (hour !== undefined) {
            const startHour = hour.toString().padStart(2, '0');
            const endHour = ((hour + 1) % 24).toString().padStart(2, '0');

            setFormData({
                ...formData,
                startTime: `${startHour}:00`,
                endTime: `${endHour}:00`,
                date: selectedDate,
            });
        } else {
            setFormData({
                ...formData,
                date: selectedDate,
            });
        }

        setIsEditModalOpen(true);
    };

    const openEditModal = (id: string) => {
        const blockToEdit = schedule.find(block => block.id === id);
        if (blockToEdit) {
            setCurrentBlock(blockToEdit);
            setFormData({
                startTime: blockToEdit.startTime,
                endTime: blockToEdit.endTime,
                label: blockToEdit.label,
                description: blockToEdit.description || '',
                color: blockToEdit.color || '#3B82F6',
                date: blockToEdit.date,
            });
            setIsEditModalOpen(true);
        }
    };

    const addBlock = () => {
        const { startTime, endTime, label, description, color, date } = formData;
        if (!startTime || !endTime || !label || !date) {
            setError('Title, date, and times are required');
            return;
        }

        if (!validateTimeRange(startTime, endTime)) {
            setError('Invalid time format or range');
            return;
        }

        const newBlock: TimeBlock = {
            id: uuidv4(),
            startTime,
            endTime,
            label,
            description,
            color,
            date,
        };

        setSchedule([...schedule, newBlock]);
        setIsEditModalOpen(false);
        resetForm();
    };

    const editBlock = () => {
        if (!currentBlock) return;

        const { startTime, endTime, label, description, color, date } = formData;
        if (!startTime || !endTime || !label || !date) {
            setError('Title, date, and times are required');
            return;
        }

        if (!validateTimeRange(startTime, endTime)) {
            setError('Invalid time format or range');
            return;
        }

        const updatedSchedule = schedule.map(block =>
            block.id === currentBlock.id
                ? { ...block, startTime, endTime, label, description, color, date }
                : block
        );

        setSchedule(updatedSchedule);
        setIsEditModalOpen(false);
        resetForm();
    };

    const deleteBlock = (id: string) => {
        setSchedule(schedule.filter(block => block.id !== id));
    };

    const importSchedule = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const jsonData = event.target?.result as string;
                    try {
                        const importedSchedule = parseScheduleFromJSON(jsonData);
                        setSchedule(importedSchedule);
                    } catch (error) {
                        setError('Failed to import schedule. Invalid JSON format.');
                    }
                };
                reader.readAsText(file);
            }
        };

        fileInput.click();
    };

    const exportSchedule = () => {
        const jsonData = convertScheduleToJSON(schedule);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedule.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Calculate position and dimensions for a block
    const calculateBlockPosition = (block: TimeBlock) => {
        const startHour = parseInt(block.startTime.split(':')[0]);
        const startMinute = parseInt(block.startTime.split(':')[1]);
        const endHour = parseInt(block.endTime.split(':')[0]);
        const endMinute = parseInt(block.endTime.split(':')[1]);

        // Calculate top position (in rems)
        const top = startHour * 5 + (startMinute / 60) * 5;

        // Calculate height (in rems)
        let duration = (endHour - startHour) + (endMinute - startMinute) / 60;
        if (duration <= 0) duration = 24 + duration; // Handle overnight blocks
        const height = duration * 5;

        return { top, height };
    };

    // Filter blocks for a specific date
    const getBlocksForDate = (date: string) => {
        return schedule.filter(block => block.date === date);
    };

    // Render a single day column
    const renderDayColumn = (date: string) => {
        const dayBlocks = getBlocksForDate(date);

        return (
            <div className="day-column">
                {/* Hour cells for clickable areas */}
                {hours.map(hour => (
                    <div
                        key={`${date}-${hour}`}
                        className="hour-cell"
                        onClick={() => openAddModal(hour, date)}
                    />
                ))}

                {/* Render blocks for this day */}
                {dayBlocks.map(block => {
                    const { top, height } = calculateBlockPosition(block);

                    return (
                        <div
                            key={block.id}
                            className="time-block"
                            style={{
                                top: `${top}rem`,
                                height: `${height}rem`,
                                borderLeftWidth: '4px',
                                borderLeftStyle: 'solid',
                                borderLeftColor: block.color || '#3B82F6'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(block.id);
                            }}
                        >
                            <div className="block-content">
                                <div className="block-title">{block.label}</div>
                                {block.description && (
                                    <div className="block-description">{block.description}</div>
                                )}
                                <div className="block-time">
                                    {formatTime(block.startTime)} - {formatTime(block.endTime)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Toggle between view types
    const setView = (type: ViewType) => {
        setViewType(type);
    };

    // Navigate to previous or next period
    const navigate = (direction: 'prev' | 'next') => {
        if (viewType === 'day') {
            // Navigate one day
            const date = new Date(currentDate);
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
            setCurrentDate(formatDateToISO(newDate));
        } else if (viewType === 'week') {
            // Navigate one week
            setCurrentDate(addWeeks(currentDate, direction === 'next' ? 1 : -1));
        } else if (viewType === 'month') {
            // Navigate one month
            setCurrentDate(addMonths(currentDate, direction === 'next' ? 1 : -1));
        }
    };

    // Navigate to today
    const goToToday = () => {
        setCurrentDate(getTodayISO());
    };

    // Get the current view's title text
    const getCurrentViewTitle = () => {
        if (viewType === 'day') {
            return formatReadableDate(currentDate);
        } else if (viewType === 'week') {
            const startDate = weekDates[0];
            const endDate = weekDates[6];
            const startMonth = getMonthName(startDate);
            const endMonth = getMonthName(endDate);
            const startDay = getDayOfMonth(startDate);
            const endDay = getDayOfMonth(endDate);
            const year = getYear(currentDate);

            if (startMonth === endMonth) {
                return `${startMonth} ${startDay}-${endDay}, ${year}`;
            } else {
                return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
            }
        } else {
            const month = getMonthName(currentDate);
            const year = getYear(currentDate);
            return `${month} ${year}`;
        }
    };

    // Render day tabs for day view
    const renderDayTabs = () => {
        return (
            <div className="day-tabs">
                {weekDates.map(date => (
                    <div
                        key={date}
                        className={`day-tab ${currentDate === date ? 'day-tab-active' : ''}`}
                        onClick={() => setCurrentDate(date)}
                    >
                        {getDayName(date)}, {getMonthName(date).substr(0, 3)} {getDayOfMonth(date)}
                    </div>
                ))}
            </div>
        );
    };

    // Render the month grid view
    const renderMonthView = () => {
        return (
            <>
                {/* Days of week header */}
                <div className="month-header-row">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={`header-${day}`} className="month-header-cell">
                            {day.substring(0, 3)}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="month-grid">
                    {monthDates.map((date, index) => {
                        const isCurrentMonth = getMonthName(date) === getMonthName(currentDate);
                        const isToday = date === getTodayISO();
                        const dayEvents = getBlocksForDate(date);

                        return (
                            <div
                                key={date}
                                className={`month-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                                onClick={() => {
                                    setCurrentDate(date);
                                    if (dayEvents.length === 0) {
                                        openAddModal(undefined, date);
                                    }
                                }}
                            >
                                <div className="day-number">{getDayOfMonth(date)}</div>
                                <div className="month-events">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <div
                                            key={event.id}
                                            className="month-event"
                                            style={{ backgroundColor: event.color || '#3B82F6' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(event.id);
                                            }}
                                        >
                                            {event.label}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="month-event" style={{ backgroundColor: '#94a3b8' }}>
                                            +{dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    // Render the week view
    const renderWeekView = () => {
        return (
            <div className="week-grid-container">
                {/* Week header row */}
                <div className="week-header-row">
                    {/* Time column header */}
                    <div className="day-header">
                        <div className="day-title">Time</div>
                    </div>

                    {/* Day headers */}
                    {weekDates.map(date => (
                        <div
                            key={date}
                            className="day-header"
                            onClick={() => {
                                setCurrentDate(date);
                                setView('day');
                            }}
                        >
                            <div className="day-title">{getDayName(date)}</div>
                            <div className="day-date">{getMonthName(date).substr(0, 3)} {getDayOfMonth(date)}</div>
                        </div>
                    ))}
                </div>

                {/* Week content grid */}
                <div className="week-container">
                    {/* Time column */}
                    <div className="time-column">
                        {hours.map(hour => (
                            <div key={hour} className="time-slot">
                                {formatDisplayHour(hour)}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDates.map(date => renderDayColumn(date))}
                </div>
            </div>
        );
    };

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h1 className="schedule-title">Schedule</h1>
                <div className="button-group">
                    <div className="view-selector">
                        <div
                            className={`view-option ${viewType === 'day' ? 'active' : ''}`}
                            onClick={() => setView('day')}
                        >
                            Day
                        </div>
                        <div
                            className={`view-option ${viewType === 'week' ? 'active' : ''}`}
                            onClick={() => setView('week')}
                        >
                            Week
                        </div>
                        <div
                            className={`view-option ${viewType === 'month' ? 'active' : ''}`}
                            onClick={() => setView('month')}
                        >
                            Month
                        </div>
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={importSchedule}
                    >
                        Import
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={exportSchedule}
                    >
                        Export
                    </button>
                    <button
                        className="btn btn-purple"
                        onClick={() => openAddModal()}
                    >
                        Add Event
                    </button>
                </div>
            </div>

            <div className="schedule-card">
                {/* Navigation header */}
                <div className="calendar-navigation">
                    <div className="nav-arrows">
                        <div className="nav-arrow" onClick={() => navigate('prev')}>
                            &lt;
                        </div>
                        <div className="nav-arrow" onClick={goToToday}>
                            Today
                        </div>
                        <div className="nav-arrow" onClick={() => navigate('next')}>
                            &gt;
                        </div>
                    </div>
                    <div className="current-view-text">
                        {getCurrentViewTitle()}
                    </div>
                </div>

                {viewType === 'day' && (
                    <>
                        {renderDayTabs()}
                        <div className="schedule-layout">
                            {/* Time column */}
                            <div className="time-column">
                                {hours.map(hour => (
                                    <div key={hour} className="time-slot">
                                        {formatDisplayHour(hour)}
                                    </div>
                                ))}
                            </div>

                            {/* Single day column */}
                            {renderDayColumn(currentDate)}
                        </div>
                    </>
                )}

                {viewType === 'week' && renderWeekView()}

                {viewType === 'month' && renderMonthView()}
            </div>

            {/* Edit/Add Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">
                            {currentBlock ? 'Edit Event' : 'Add Event'}
                        </h2>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="label-input" className="form-label">Title</label>
                            <input
                                id="label-input"
                                type="text"
                                name="label"
                                value={formData.label}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Meeting, Workout, etc."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description-input" className="form-label">Description</label>
                            <textarea
                                id="description-input"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Add details here..."
                                rows={2}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date-input" className="form-label">Date</label>
                            <input
                                id="date-input"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="form-date"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="start-time-input" className="form-label">Start Time</label>
                                <input
                                    id="start-time-input"
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    aria-label="Start time"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="end-time-input" className="form-label">End Time</label>
                                <input
                                    id="end-time-input"
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    aria-label="End time"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <div className="color-grid">
                                {colorOptions.map(option => (
                                    <div
                                        key={option.color}
                                        onClick={() => selectColor(option.color)}
                                        className={`color-option ${formData.color === option.color ? 'color-selected' : ''}`}
                                        style={{ backgroundColor: option.color }}
                                        title={option.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    resetForm();
                                }}
                                className="btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={currentBlock ? editBlock : addBlock}
                                className="btn btn-primary"
                            >
                                {currentBlock ? 'Save' : 'Add'}
                            </button>
                            {currentBlock && (
                                <button
                                    onClick={() => {
                                        deleteBlock(currentBlock.id);
                                        setIsEditModalOpen(false);
                                        resetForm();
                                    }}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;