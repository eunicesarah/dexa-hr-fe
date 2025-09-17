import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { EmployeeAttendance } from "../../view-models/EmployeeAttendance";
import Button from "../../components/Button";
import AttendanceCard from "../../components/AttendanceCard";
import { useNavigate } from "react-router-dom";

const MyAttendance = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const myAttendances = await EmployeeAttendance.getMyAttendance();
            setData(myAttendances || []);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setError("Failed to load attendance records. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAttendance = () => {
        navigate('/today-attendance');
    };

    const getAttendanceStats = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthAttendance = data.filter(attendance => {
            const attendanceDate = new Date(attendance.clock_in_date);
            return attendanceDate.getMonth() === currentMonth && 
                   attendanceDate.getFullYear() === currentYear;
        });

        const totalDaysThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const workingDaysThisMonth = Math.floor(totalDaysThisMonth * (5/7)); // Rough estimate
        const presentDays = thisMonthAttendance.length;
        const attendanceRate = workingDaysThisMonth > 0 ? ((presentDays / workingDaysThisMonth) * 100).toFixed(1) : 0;

        return {
            totalRecords: data.length,
            thisMonthPresent: presentDays,
            attendanceRate: attendanceRate
        };
    };

    const stats = getAttendanceStats();

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Navbar role={"user"} />
            <div className="flex flex-col w-full px-8 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h1>
                            <p className="text-gray-600">Track your attendance history and statistics</p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                label="+ Mark Today's Attendance" 
                                variant="red-button" 
                                onClick={handleMarkAttendance}
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Records</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalRecords}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.thisMonthPresent}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Attendance Rate</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.attendanceRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Attendance History</h2>
                    </div>
                    {!isLoading && !error && data.length > 0 && (
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-1">Note:</h4>
                                    <p className="text-sm text-blue-700">
                                        Attendance records are automatically saved when you mark your attendance. 
                                        Make sure to mark your attendance daily before the deadline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600">Loading attendance records...</span>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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

                    {/* Empty State */}
                    {!isLoading && !error && data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Attendance Records</h3>
                            <p className="text-gray-600 mb-4">You haven't marked any attendance yet. Start by marking today's attendance.</p>
                            <Button 
                                label="Mark Attendance" 
                                variant="red-button" 
                                onClick={handleMarkAttendance}
                            />
                        </div>
                    )}

                    {!isLoading && !error && data.length > 0 && (
                        <div>
                            <AttendanceCard data={data} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAttendance;