import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import { EmployeeAttendance } from "../../view-models/EmployeeAttendance";
import WebcamCapture from "../../components/Webcam";
import Modal from "../../components/Modal";

const TodayAttendance = () => {
    const [isAttended, setIsAttended] = useState(false);
    const [image, setImage] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const handleAttendance = async () => {
        setIsChecking(true);
        try {
            const attend = await EmployeeAttendance.getTodayAttendance();
            if (attend) {
                setIsAttended(true);
            } else {
                setIsAttended(false);
            }
        } catch (error) {
            console.error("Error checking attendance:", error);
            setModalMessage("Failed to check attendance status.");
            setShowModal(true);
        } finally {
            setIsChecking(false);
        }
    };

    const markAttendance = async () => {
        if (image) {
            setIsLoading(true);
            try {
                await EmployeeAttendance.markAttendance(image);
                setModalMessage("Attendance marked successfully!");
                setShowModal(true);
                setIsAttended(true);
            } catch (error) {
                console.error("Error marking attendance:", error);
                setModalMessage("Failed to mark attendance. Please try again.");
                setShowModal(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setModalMessage("No image captured. Please capture a photo first.");
            setShowModal(true);
        }
    };

    useEffect(() => {
        handleAttendance();
    }, []);

    const handleCapture = (imageUrl) => {
        setImage(imageUrl);
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (isChecking) {
        return (
            <div className="flex flex-row">
                <Navbar role="EMPLOYEE" />
                <div className="flex flex-col w-full px-12 py-10 gap-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl">Checking attendance status...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Navbar role="EMPLOYEE" />
            <div className="flex flex-col w-full px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Today's Attendance</h1>
                            <p className="text-gray-600">{getCurrentDate()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Time</p>
                            <p className="text-xl font-semibold text-blue-600">{getCurrentTime()}</p>
                        </div>
                    </div>
                </div>
            

                <div className="flex-1">
                    {isAttended ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-600 mb-2">Attendance Marked!</h2>
                                <p className="text-gray-600 text-lg">You have successfully marked your attendance for today.</p>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-green-700">
                                    <span className="font-semibold">Status:</span> Present
                                </p>
                                <p className="text-green-700">
                                    <span className="font-semibold">Date:</span> {getCurrentDate()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-red-600 mb-2">Attendance Required</h2>
                                <p className="text-gray-600 text-lg">Please capture your photo to mark attendance for today.</p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    {!image && (
                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                                    <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
                                    <ol className="text-sm text-blue-700 space-y-1">
                                        <li>1. Position yourself in front of the camera</li>
                                        <li>2. Click "Capture photo" when ready</li>
                                        <li>3. Review your photo in the preview</li>
                                        <li>4. Click "Mark Attendance" to submit</li>
                                    </ol>
                                </div>
                            )}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Capture Your Photo</h3>
                                        <div className="flex justify-center">
                                            <WebcamCapture onCapture={handleCapture} />
                                        </div>
                                        <div className="mt-4 text-sm text-gray-600 text-center">
                                            <p>• Make sure you're clearly visible</p>
                                            <p>• Ensure good lighting</p>
                                            <p>• Look directly at the camera</p>
                                        </div>
                                    </div>
                                </div>

                                {image && (
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Photo Preview</h3>
                                            <div className="text-center">
                                                <div className="inline-block bg-white p-2 rounded-lg shadow-sm mb-4">
                                                    <img 
                                                        src={image} 
                                                        alt="Captured" 
                                                        className="w-64 h-64 object-cover border rounded-lg" 
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-green-600 font-medium mb-4">
                                                        ✓ Photo captured successfully!
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                        <Button 
                                                            label={isLoading ? "Marking..." : "Mark Attendance"} 
                                                            variant="red-button" 
                                                            onClick={markAttendance}
                                                            disabled={isLoading}
                                                        />
                                                        <Button 
                                                            label="Retake Photo" 
                                                            variant="add" 
                                                            onClick={() => setImage(null)}
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {showModal && (
                    <Modal
                        title="Attendance Status"
                        message={modalMessage}
                        onClose={() => {
                            setShowModal(false);
                            if (modalMessage === "Attendance marked successfully!") {
                                handleAttendance();
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default TodayAttendance;