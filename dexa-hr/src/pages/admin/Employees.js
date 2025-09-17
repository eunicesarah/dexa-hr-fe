import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import { AdminEmployee } from '../../view-models/AdminEmployee';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const Employees = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / limit);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const employees = await AdminEmployee.getAllEmployees(page, limit);
            setData(employees.employees || []);
            setTotalItems(employees.pagination.totalItems || 0);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to load employees. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = (employeeId) => {
        navigate(`/employee/edit/${employeeId}`);
    };

    const handleAddEmployee = () => {
        navigate(`/add`);
    };

    const departments = [...new Set(data.map(emp => emp.department).filter(Boolean))];

    const filteredData = data.filter(employee => {
        const matchesSearch = searchTerm === '' || 
            employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.id?.toString().includes(searchTerm);
        
        const matchesDepartment = filterDepartment === '' || employee.department === filterDepartment;
        
        return matchesSearch && matchesDepartment;
    });

    const columns = [
        { 
            title: 'Name', 
            dataIndex: 'full_name',
            render: (name, record) => (
                <div className="flex items-center space-x-3 self-center flex flex-col">
                        <div className="font-medium text-gray-800">{name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            )
        },
        { 
            title: 'Department', 
            dataIndex: 'department',
            render: (department) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {department || 'Not Assigned'}
                </span>
            )
        },
        { 
            title: 'Position', 
            dataIndex: 'position',
            render: (position) => (
                <span className="text-gray-700 font-medium">
                    {position || 'Not Assigned'}
                </span>
            )
        },
        {
            title: 'Account Status', 
            dataIndex: 'status',
            render: (status) => <Badge status={status} />
        },
        { 
            title: 'Action', 
            dataIndex: 'action',
            render: (text, record) => (
                <div className="flex space-x-2">
                    <Button 
                        label="Edit" 
                        onClick={() => handleClick(record.id)} 
                        variant="hyperlink"
                    />
                </div>
            )
        },
    ];

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Navbar/>
            <div className="flex flex-col w-full px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Management</h1>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                variant="red-button" 
                                label="+ Add Employee" 
                                onClick={handleAddEmployee}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Employees
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow focus:border-yellow"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Department
                            </label>
                            <select
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow focus:border-yellow"
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Table Section */}
                <div className="bg-white rounded-lg shadow-sm flex-1">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Employee List</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredData.length > 0 
                                ? `Showing ${filteredData.length} of ${data.length} employees`
                                : 'No employees found'
                            }
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-gray-600">Loading employees...</span>
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
                                variant="red-button" 
                                onClick={fetchData}
                            />
                        </div>
                    )}

                    {!isLoading && !error && filteredData.length === 0 && data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Employees Found</h3>
                            <p className="text-gray-600 mb-4">Get started by adding your first employee.</p>
                            <Button 
                                label="Add Employee" 
                                variant="red-button" 
                                onClick={handleAddEmployee}
                            />
                        </div>
                    )}

                    {!isLoading && !error && filteredData.length === 0 && data.length > 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
                            <p className="text-gray-600 mb-4">
                                No employees match your current search criteria.
                            </p>
                                                        <div className="flex items-center space-x-2">

                            <Button 
                                label="Clear Filters" 
                                variant="add" 
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterDepartment('');
                                }}
                            />
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && filteredData.length > 0 && (
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
        </div>
    );
};

export default Employees;