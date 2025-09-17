import { useEffect, useState } from 'react';
import { AdminEmployee } from '../../view-models/AdminEmployee';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const EmployeeDetail = ({ employeeId = null, mode = 'add', onSave, onCancel }) => {
    const TODAY = new Date();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        phone_number: '',
        birth_date: '',
        department: '',
        position: '',
        salary: '',
        start_date: '',
        end_date: '',
        is_active: 1
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isEditMode = mode === 'edit' && employeeId;

    const fetchData = async () => {
        if (isEditMode) {
            setIsLoading(true);
            try {
                const employee = await AdminEmployee.getEmployeeById(employeeId);
                employee.birth_date = convertFetchedDate(employee.birth_date);
                employee.start_date = convertFetchedDate(employee.start_date);
                employee.end_date = employee.end_date ? convertFetchedDate(employee.end_date) : '';
                console.info(employee);
                setFormData(employee);
            } catch (error) {
                console.error("Error fetching employee details:", error);
                setModalTitle('Error');
                setModalMessage('Failed to load employee details.');
                setShowModal(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.first_name?.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name?.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.department?.trim()) newErrors.department = 'Department is required';
        if (!formData.position?.trim()) newErrors.position = 'Position is required';
        if (!formData.start_date) newErrors.start_date = 'Start date is required';
        if (!formData.address?.trim()) newErrors.address = 'Address is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.birth_date || new Date(formData.birth_date) > new Date()) {
            newErrors.birth_date = 'Please enter a valid birth date';
        }

        if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
            newErrors.start_date = 'Start date cannot be after end date';
            newErrors.end_date = 'End date cannot be before start date';
        }
        
        if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) < 0) {
            newErrors.salary = 'Please enter a valid non-negative salary';
        }
        
        if (!formData.phone_number || !/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const convertToDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const convertFetchedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setModalTitle('Validation Error');
            setModalMessage('Check the form for errors.');
            setShowModal(true);
            return;
        }

        setIsSaving(true);
        try {
            const formattedData = {
                ...formData,
                salary: parseFloat(formData.salary),
                birth_date: formatDateForAPI(formData.birth_date),
                start_date: formatDateForAPI(formData.start_date),
                end_date: formData.end_date ? formatDateForAPI(formData.end_date) : null,
                is_active: formData.is_active === '1' || formData.is_active === 1 ? 1 : 0
            };

            let result;
            if (isEditMode) {
                result = await AdminEmployee.updateEmployee(employeeId, formattedData);
                setModalTitle('Success');
                setModalMessage('Employee updated successfully!');
            } else {
                result = await AdminEmployee.insertEmployee(formattedData);
                setModalTitle('Success');
                setModalMessage('Employee created successfully!');
            }

            setFormData(result);
            setShowModal(true);

            if (onSave) {
                onSave(result);
            }
        } catch (error) {
            console.error("Error saving employee:", error);
            setModalTitle('Error');
            setModalMessage('Failed to save employee. Please try again.');
            setShowModal(true);
        } finally {
            setIsSaving(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
        setModalTitle('');
    };

    useEffect(() => {
        if (isEditMode) {
            fetchData();
        }
    }, [employeeId, isEditMode]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading employee details...</span>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        setIsSaving(true);
        try {
            await AdminEmployee.deleteEmployee(employeeId);
            setModalTitle('Success');
            setModalMessage('Employee deleted successfully!');
            setShowModal(true);
            navigate('/employee');
        } catch (error) {
            console.error("Error deleting employee:", error);
            setModalTitle('Error');
            setModalMessage('Failed to delete employee. Please try again.');
            setShowModal(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetAdmin = async () => {
        setIsSaving(true);
        try {
            await AdminEmployee.setEmployeeAsAdmin(employeeId, 'ADMIN');
            setModalTitle('Success');
            setModalMessage('Employee has been set as Admin successfully!');
            setShowModal(true);
        } catch (error) {
            console.error("Error setting employee as admin:", error);
            setModalTitle('Error');
            setModalMessage('Failed to set employee as Admin. Please try again.');
            setShowModal(true);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm py-12">
            <div className="bg-gradient-to-r from-red to-yellow text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                    <div className='flex flex-row w'>
                        <Button 
                            label="⟨ Back"
                            onClick={() => navigate('/employee')}
                            variant="add"
                        />
                        </div>
                    <div className='flex flex-col'>
                        <h1 className="text-2xl font-bold">
                            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                        </h1>
                        <p className="text-blue-100 mt-1">
                            {isEditMode 
                                ? 'Update employee information and settings'
                                : 'Fill in the details to create a new employee record'
                            }
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button 
                            label={isSaving ? "Saving..." : (isEditMode ? 'Save' : 'Create')} 
                            onClick={handleSave} 
                            variant="red-button"
                            disabled={isSaving}
                            />
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Personal Information
                            </h2>
                        </div>

                        {isEditMode && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                <input 
                                    type="text" 
                                    value={formData.employee_id} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.first_name || ''} 
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.first_name ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter first name"
                                    disabled={isSaving}
                                />
                                {errors.first_name && (
                                    <p className="text-red text-xs mt-1">{errors.first_name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.last_name || ''} 
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.last_name ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter last name"
                                    disabled={isSaving}
                                />
                                {errors.last_name && (
                                    <p className="text-red text-xs mt-1">{errors.last_name}</p>
                                )}
                            </div>
                        </div>
                            {isEditMode && (

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email Address <span className="text-red">*</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        value={formData.email || ''} 
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 bg-gray-200 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.email ? 'border-red bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter email address"
                                        readOnly
                                        disabled={isSaving}
                                    />
                                    {errors.email && (
                                        <p className="text-red text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    value={formData.phone_number || ''} 
                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.phone_number ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter phone number"
                                    disabled={isSaving}
                                />
                                {errors.phone_number && (
                                    <p className="text-red text-xs mt-1">{errors.phone_number}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Birth Date <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    max={TODAY.toISOString().split('T')[0]}
                                    value={formData.birth_date || ''} 
                                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                        ${errors.birth_date ? 'border-red bg-red-50' : 'border-gray-300'}`}
                                    disabled={isSaving}
                                />
                                {errors.birth_date && (
                                    <p className="text-red text-xs mt-1">{errors.birth_date}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Address <span className="text-red">*</span>
                            </label>
                            <textarea 
                                value={formData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                    ${errors.address ? 'border-red bg-red-50' : 'border-gray-300'}`}
                                placeholder="Enter full address"
                                rows={3}
                                disabled={isSaving}
                            />
                            {errors.address && (
                                <p className="text-red text-xs mt-1">{errors.address}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                                </svg>
                                Work Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Department <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.department || ''} 
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.department ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter department"
                                    disabled={isSaving}
                                />
                                {errors.department && (
                                    <p className="text-red text-xs mt-1">{errors.department}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Position <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.position || ''} 
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.position ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter position"
                                    disabled={isSaving}
                                />
                                {errors.position && (
                                    <p className="text-red text-xs mt-1">{errors.position}</p>
                                )}
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Salary <span className="text-red">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">IDR</span>
                                <input 
                                    type="text"
                                    value={formData.salary} 
                                    onChange={(e) => handleInputChange('salary', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                                        ${errors.salary ? 'border-red bg-red-50' : 'border-gray-300'}`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    disabled={isSaving}
                                />
                                {errors.salary && (
                                    <p className="text-red text-xs mt-1">{errors.salary}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Start Date <span className="text-red">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    max={formData.end_date ? convertToDate(formData.end_date) : undefined}
                                    value={formData.start_date || ''} 
                                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        errors.start_date ? 'border-red bg-red-50' : 'border-gray-300'
                                    }`}
                                    disabled={isSaving}
                                />
                                {errors.start_date && (
                                    <p className="text-red text-xs mt-1">{errors.start_date}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input 
                                    type="date" 
                                    min={convertToDate(formData.start_date) || undefined}
                                    value={formData.end_date || ''} 
                                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                            <select
                                value={formData.is_active || ''}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isSaving}
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </div>
                        {
                            isEditMode && (
                                <div className="w-full justify-self-end flex flex-col md:flex-row gap-16">
                                    <Button
                                        label="Set as Admin"
                                        onClick={handleSetAdmin}
                                        variant="add"
                                        disabled={isSaving}
                                    />
                                    <Button
                                        label="Delete Employee"
                                        onClick={handleDelete}
                                        variant="red-button"
                                        disabled={isSaving}
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            label={isSaving ? "Saving..." : (isEditMode ? 'Save' : 'Create')} 
                            onClick={handleSave} 
                            variant="primary"
                            disabled={isSaving}
                        />
                        
                    </div>
                </div>
            </div>

            {showModal && (
                <Modal 
                    title={modalTitle}
                    message={modalMessage} 
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default EmployeeDetail;