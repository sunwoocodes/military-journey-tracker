import React, { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import AppLayout from '@/components/layout/AppLayout';
import { Calendar as CalendarIcon, Plus, Trash2, Tent, Umbrella } from 'lucide-react';

// Custom styles for DayPicker to match our theme
const css = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #2A2A2A;
    --rdp-background-color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: var(--rdp-accent-color);
    color: white;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: var(--rdp-background-color);
  }
  .rdp-day_today {
    font-weight: bold;
    color: #000;
  }
`;

type RecordType = 'vacation' | 'training';

interface DayRecord {
    id: string;
    dateStr: string; // YYYY-MM-DD
    type: RecordType;
    note: string;
}

const TOTAL_VACATION_DAYS = 28;

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [records, setRecords] = useState<DayRecord[]>([
        { id: '1', dateStr: format(new Date(), 'yyyy-MM-dd'), type: 'training', note: '유격 훈련' },
    ]);
    const [newNote, setNewNote] = useState('');
    const [newType, setNewType] = useState<RecordType>('vacation');

    const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const currentRecords = records.filter(r => r.dateStr === selectedDateStr);

    const usedVacationDays = records.filter(r => r.type === 'vacation').length;
    const remainingVacationDays = Math.max(0, TOTAL_VACATION_DAYS - usedVacationDays);

    const handleAddRecord = () => {
        if (!selectedDate || !newNote.trim()) return;
        const newRecord: DayRecord = {
            id: Date.now().toString(),
            dateStr: selectedDateStr,
            type: newType,
            note: newNote.trim(),
        };
        setRecords([...records, newRecord]);
        setNewNote('');
    };

    const handleDelete = (id: string) => {
        setRecords(records.filter(r => r.id !== id));
    };

    // Helper to mark days with events on the calendar
    const modifiers = {
        hasVacation: (date: Date) => records.some(r => r.dateStr === format(date, 'yyyy-MM-dd') && r.type === 'vacation'),
        hasTraining: (date: Date) => records.some(r => r.dateStr === format(date, 'yyyy-MM-dd') && r.type === 'training'),
    };

    const modifiersStyles = {
        hasVacation: { borderBottom: '2px solid #3b82f6' },
        hasTraining: { borderBottom: '2px solid #ef4444' }
    };

    return (
        <AppLayout>
            <style>{css}</style>
            <div className="flex flex-col min-h-screen px-5 pt-10 pb-24 space-y-6">

                {/* Header */}
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-white/50 rounded-2xl shadow-sm backdrop-blur-md border border-white/60">
                        <CalendarIcon size={28} className="text-gray-800" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#2A2A2A] tracking-wider font-display">일정 관리</h1>
                        <p className="text-xs text-gray-600 font-semibold">휴가 및 훈련 일정을 기록하세요</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4 flex flex-col justify-center items-center text-center">
                        <span className="text-xs text-gray-500 font-bold mb-1">총 휴가 일수</span>
                        <div className="text-3xl font-black text-gray-800 font-display">{TOTAL_VACATION_DAYS}<span className="text-lg font-bold ml-1">일</span></div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full blur-2xl -mr-8 -mt-8 opacity-60"></div>
                        <span className="text-xs text-gray-500 font-bold mb-1 tracking-tight">남은 휴가</span>
                        <div className="text-3xl font-black text-blue-600 font-display text-glow">{remainingVacationDays}<span className="text-lg font-bold ml-1 text-gray-600">일</span></div>
                    </div>
                </div>

                {/* Calendar UI */}
                <div className="glass-panel p-6 flex justify-center shadow-md border border-white/80">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={ko}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        className="font-sans m-0 text-sm sm:text-base font-semibold"
                    />
                </div>

                {/* Selected Date Details */}
                {selectedDate && (
                    <div className="glass-panel p-5 mt-4 space-y-4 animate-in fade-in zoom-in-95 duration-300 border border-white/80 shadow-md">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300/50 pb-2">
                            {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })} 일정
                        </h2>

                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {currentRecords.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6 font-medium bg-white/30 rounded-xl border border-white/50">등록된 일정이 없습니다.</p>
                            ) : (
                                currentRecords.map(record => (
                                    <div key={record.id} className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-white/80 shadow-sm">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-xl ${record.type === 'vacation' ? 'bg-blue-100/80 text-blue-600' : 'bg-red-100/80 text-red-600'}`}>
                                                {record.type === 'vacation' ? <Umbrella size={18} /> : <Tent size={18} />}
                                            </div>
                                            <div>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider ${record.type === 'vacation' ? 'text-blue-500' : 'text-red-500'}`}>
                                                    {record.type === 'vacation' ? 'VACATION' : 'TRAINING'}
                                                </p>
                                                <p className="text-sm font-bold text-gray-800 leading-tight">{record.note}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(record.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Record Form */}
                        <div className="mt-4 pt-4 border-t border-gray-300/40">
                            <div className="flex space-x-2 mb-3 bg-white/40 p-1 rounded-xl border border-white/60">
                                <button
                                    onClick={() => setNewType('vacation')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${newType === 'vacation' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    휴가
                                </button>
                                <button
                                    onClick={() => setNewType('training')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${newType === 'training' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    훈련
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="일정을 입력하세요..."
                                    className="flex-1 bg-white/70 border border-white/80 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium placeholder:text-gray-400 text-gray-800 shadow-inner"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddRecord()}
                                />
                                <button
                                    onClick={handleAddRecord}
                                    disabled={!newNote.trim()}
                                    className="p-3 bg-gray-800 text-white rounded-xl disabled:opacity-50 hover:bg-gray-700 transition-all hover:shadow-md disabled:hover:shadow-none active:scale-95 flex items-center justify-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </AppLayout>
    );
}
