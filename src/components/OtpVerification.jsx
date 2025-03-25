import React, { useState, useRef, useEffect } from "react";

const OTPEntry = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Ensure only numbers are entered
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move focus to next input
      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move focus back
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate OTP (all fields must be filled)
    const isComplete = otp.every((digit) => digit !== "");

    if (isComplete) {
      // Here you would typically send the OTP to your backend for verification
      console.log("OTP Submitted:", otp.join(""));
      setError("");
      // Add your verification logic here
    } else {
      setError("Please enter the complete OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
          <p className="text-gray-600 mt-2">
            Please enter the 6-digit code sent to your mobile number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border-2 border-gray-300 
                           rounded-lg focus:outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="text-center text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg 
                         hover:bg-blue-600 transition-colors duration-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 
                         focus:ring-opacity-50"
            >
              Verify OTP
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?
            <button
              className="text-blue-500 ml-1 hover:underline focus:outline-none"
              onClick={() => {
                // Add resend OTP logic here
                console.log("Resend OTP");
              }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPEntry;
