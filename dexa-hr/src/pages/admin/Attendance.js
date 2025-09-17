import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { AdminAttendance } from "../../view-models/AdminAttendance";
import Badge from "../../components/Badge";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const AttendanceAdmin = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / limit);

    const convertToDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
        return date.toLocaleDateString('en-GB', options);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await AdminAttendance.getAllAttendanceRecords(page, limit);
            setData(result.attendances || []);
            setFilteredData(result.attendances || []);
            setTotalItems(result.pagination?.totalItems || result.attendances.length || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]); 

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.employee_id?.toString().includes(searchTerm)
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.clock_in_date).toISOString().split('T')[0];
                return itemDate === dateFilter;
            });
        }

        if (statusFilter) {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredData(filtered);
    }, [searchTerm, dateFilter, statusFilter, data]);

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    const handleViewPhoto = (photoUrl) => {
        setModalMessage(`${process.env.REACT_APP_API_URL}/${photoUrl}`);
        setShowModal(true);
    };

    const getStatusCounts = () => {
        const counts = {
            total: data.length,
            present: data.filter(item => item.status === 'On Time').length,
            late: data.filter(item => item.status === 'Late').length,
            absent: data.filter(item => item.status === 'Absent').length
        };
        return counts;
    };

    const statusCounts = getStatusCounts();

    const columns = [
        { 
            title: 'Employee Name', 
            dataIndex: 'employee_name',
            render: (name, record) => (
                <div className="flex items-center  space-x-3 flex flex-col">
                        <label className="font-medium text-gray-800">{name || 'N/A'}</label>
                        <label className="text-sm text-gray-500">ID: {record.employee_id}</label>
                </div>
            )
        },
        { 
            title: 'Date', 
            dataIndex: 'clock_in_date', 
            render: (date) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-800">
                        {date ? convertToDate(date) : '-'}
                    </div>
                </div>
            )
        },
        { 
            title: 'Clock In Time', 
            dataIndex: 'clock_in_time', 
            render: (time) => (
                <div className="text-sm font-medium text-gray-800">
                    {formatTime(time)}
                </div>
            )
        },
        { 
            title: 'Status', 
            dataIndex: 'status',
            render: (status) => <Badge status={status} />
        },
        { 
            title: 'Photo', 
            dataIndex: 'clock_in_photo',
            render: (photoUrl, row) => {
                if (photoUrl) {
                    return (
                        <div className="flex items-center space-x-2">
                            <Button 
                                label="View Photo" 
                                onClick={() => handleViewPhoto(photoUrl)} 
                                variant="hyperlink"
                            />
                        </div>
                    );
                }
                return (
                    <span className="text-gray-400 text-sm">No photo</span>
                );
            }
        }
    ];

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Navbar role="ADMIN" />
            <div className="flex flex-col w-full px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Records</h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Records</p>
                                <p className="text-2xl font-bold text-gray-800">{statusCounts.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">On Time</p>
                                <p className="text-2xl font-bold text-gray-800">{statusCounts.present}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Late</p>
                                <p className="text-2xl font-bold text-gray-800">{statusCounts.late}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-rose-100 rounded-full">
                                <svg className="w-6 h-6 text-darkRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Absent</p>
                                <p className="text-2xl font-bold text-gray-800">{statusCounts.absent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Employee
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Date
                            </label>
                            <input
                                type="date"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="On Time">On Time</option>
                                <option value="Late">Late</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                    </div>
                    
                    {(searchTerm || dateFilter || statusFilter) && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing {filteredData.length} of {data.length} records
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    label="Clear Filters"
                                    variant="add"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setDateFilter('');
                                        setStatusFilter('');
                                    }}
                                    />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm flex-1">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Attendance Records</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredData.length > 0 
                                ? `Showing ${filteredData.length} of ${data.length} records`
                                : 'No records found'
                            }
                        </p>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600">Loading attendance records...</span>
                            </div>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button 
                                label="Try Again" 
                                variant="primary" 
                                onClick={fetchData}
                            />
                        </div>
                    )}

                    {!loading && !error && filteredData.length === 0 && data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Attendance Records</h3>
                            <p className="text-gray-600">No attendance data available.</p>
                        </div>
                    )}

                    {!loading && !error && filteredData.length === 0 && data.length > 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
                            <p className="text-gray-600 mb-4">
                                No attendance records match your current search criteria.
                            </p>
                            <div className="flex items-center space-x-2">

                            <Button 
                                label="Clear Filters" 
                                variant="secondary" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setDateFilter('');
                                    setStatusFilter('');
                                }}
                            />
                            </div>
                        </div>
                    )}

                    {!loading && !error && filteredData.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table columns={columns} data={filteredData} />
                            <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} entries
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => setPage(prev => Math.max(1, prev - 1))}  
                                        disabled={page === 1}
                                        className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-mandarin text-white bg-darkRed'}`}
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}  
                                        disabled={page === totalPages}
                                        className={`px-3 py-1 rounded-md ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-mandarin text-white bg-darkRed'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <Modal
                    title="Clock In Photo"
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

export default AttendanceAdmin;