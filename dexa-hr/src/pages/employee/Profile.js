import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import { EmployeeEmployee } from "../../view-models/EmployeeEmployee";

const Profile = () => {
    const [data, setData] = useState(null);
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
        start_date: '',
        end_date: '',
        status: '1'
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const profile = await EmployeeEmployee.getProfile();
            setData(profile);
            setFormData(profile);
        } catch (error) {
            console.error("Error fetching employee profile:", error);
            setModalTitle('Error');
            setModalMessage('Failed to load profile data.');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const convertToDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
        setIsLoading(true);
        try {
            const updatedData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                address: formData.address,
                phone_number: formData.phone_number,
                birth_date: formatDateForAPI(formData.birth_date)
            };

            const result = await EmployeeEmployee.updateProfile(updatedData);
            setData(result);
            setFormData(result);
            setModalTitle('Success');
            setModalMessage('Profile updated successfully!');
            setShowModal(true);
        } catch (error) {
            console.error("Error updating profile:", error);
            setModalTitle('Error');
            setModalMessage('Failed to update profile. Please try again.');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(data || {});
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMessage('');
        setModalTitle('');
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading && !data) {
        return (
            <div className="flex flex-row">
                <Navbar role="user" />
                <div className="flex flex-col w-full px-12 py-10 gap-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row">
            <Navbar role="user" />
            <div className="flex flex-col w-full px-12 py-10 gap-6">
                <div className="bg-gradient-to-r from-red to-yellow text-white p-6 rounded-t-lg flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <div className="space-x-2">
                        <Button 
                            label={isLoading ? "Saving..." : "Save Changes"} 
                            onClick={handleSave} 
                            variant="red-button" 
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className='flex flex-row justify-between gap-8'>
                    <div className="flex-1">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Personal Information
                            </h2>
                        </div>

                        <div className='flex flex-col mb-4 '>
                            <label className="font-semibold">Employee ID</label>
                            <input 
                                type="text" 
                                value={formData.id || ''} 
                                className="ml-2 border p-2 rounded bg-gray-100" 
                                readOnly
                            />
                        </div>

                        <div className='flex flex-row gap-4'>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">First Name</label>
                                <input 
                                    type="text" 
                                    value={formData.first_name || ''} 
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Last Name</label>
                                <input 
                                    type="text" 
                                    value={formData.last_name || ''} 
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold">Email</label>
                            <input 
                                type="email" 
                                value={formData.email || ''} 
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className='flex flex-row gap-4'>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Address</label>
                                <input 
                                    type="text" 
                                    value={formData.address || ''} 
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={formData.phone_number || ''} 
                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                    className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold">Birth Date</label>
                            <input 
                                type="date" 
                                value={convertToDate(formData.birth_date) || ''} 
                                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                className="ml-2 border p-2 rounded bg-white border-blue-300 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Company Information Section */}
                    <div className="flex-1">
                         <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                                </svg>
                                Work Information
                            </h2>
                        </div>
                        
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Department</label>
                                <input 
                                    type="text" 
                                    value={formData.department || ''} 
                                    className="ml-2 border p-2 rounded bg-gray-100" 
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Position</label>
                                <input 
                                    type="text" 
                                    value={formData.position || ''} 
                                    className="ml-2 border p-2 rounded bg-gray-100" 
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className='flex flex-row gap-4'>
                            <div className="flex flex-col mb-4 flex-1">
                                <label className="font-semibold">Date Joined</label>
                                <input 
                                    type="date" 
                                    value={convertToDate(formData.start_date) || ''} 
                                    className="ml-2 border p-2 rounded bg-gray-100" 
                                    readOnly
                                />
                            </div>
                            {formData.end_date && formData.end_date !== '' && (
                                <div className="flex flex-col mb-4 flex-1">
                                    <label className="font-semibold">End Date</label>
                                    <input 
                                        type="date" 
                                        value={convertToDate(formData.end_date) || ''} 
                                        className="ml-2 border p-2 rounded bg-gray-100" 
                                        readOnly
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold">Employment Status</label>
                            <input 
                                type="text" 
                                value={formData.is_active === '1' || formData.is_active === 1 ? 'Active' : 'Inactive'} 
                                className="ml-2 border p-2 rounded bg-gray-100" 
                                readOnly
                            />
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                            <h3 className="font-semibold text-blue-800 mb-2">Note:</h3>
                            <p className="text-sm text-blue-700">
                                Company information such as department, position, and employment dates 
                                can only be updated by HR administrators. You can modify your personal 
                                information on the left and click "Save Changes" to update your profile.
                            </p>
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
        </div>
    );
};

export default Profile;