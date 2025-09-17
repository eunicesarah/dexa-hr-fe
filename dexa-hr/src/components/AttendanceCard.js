import React, { useState } from 'react';
import Modal from './Modal';
import Badge from './Badge';

const AttendanceCard = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const time = new Date(`1970-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    const handleViewPhoto = (photoUrl) => {
        setModalMessage(`${process.env.REACT_APP_API_URL}/${photoUrl}`);
        setShowModal(true);
    };

    return (
        <div className="w-full">
            {data.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-600 text-lg font-medium">No attendance records found</p>
                    <p className="text-gray-500 text-sm">Your attendance history will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Records</h3>
                        <span className="text-sm text-gray-500">{data.length} record{data.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((record, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span className="font-semibold text-gray-800">{formatDate(record.clock_in_date)}</span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                                        {<Badge status={record.status} />}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 mb-4">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-gray-600 text-sm">Clock In: {formatTime(record.clock_in_time)}</span>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Photo</span>
                                    </div>
                                    
                                    {record.clock_in_photo ? (
                                        <div className="relative group">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200">
                                                <img 
                                                    src={`${process.env.REACT_APP_API_URL}/${record.clock_in_photo}`} 
                                                    alt="Clock In" 
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                                                    onClick={() => { 
                                                        setModalMessage(`${process.env.REACT_APP_API_URL}/${record.clock_in_photo}`); 
                                                        setShowModal(true); 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
             {showModal && (
                <Modal
                    title="Attendance Photo"
                    message={
                        <div className="max-w-lg mx-auto">
                            <img 
                                src={modalMessage} 
                                alt="Clock In" 
                                className="w-full h-auto rounded-lg shadow-lg"
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.png';
                                    e.target.alt = 'Image not available';
                                }}
                            />
                        </div>
                    }
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AttendanceCard;