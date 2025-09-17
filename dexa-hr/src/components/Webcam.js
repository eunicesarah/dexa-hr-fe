import { useCallback, useRef } from "react";
import Webcam from 'react-webcam';
import Button from "./Button";


const WebcamCapture = ({ onCapture }) => {
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    }, [webcamRef, onCapture]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={350}
                height={350}
                videoConstraints={{
                    width: 350,
                    height: 350,
                    facingMode: "user"
                }}
            />
            <Button label="Capture Photo" onClick={capture} variant="red-button" />
        </div>
    );
}

export default WebcamCapture;