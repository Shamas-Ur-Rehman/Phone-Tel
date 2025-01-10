import React, { useState } from "react";
import emailjs from "emailjs-com";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const Form = () => {
  const [formData, setFormData] = useState({
    campaign: "",
    firstName: "",
    lastName: "",
    ssn: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    uploadId: null,
    headshotImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.campaign) newErrors.campaign = "Campaign is required.";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.ssn.match(/^\d{9}$/)) newErrors.ssn = "SSN must be a 9-digit number.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State selection is required.";
    if (!formData.zipCode.match(/^\d{5}$/)) newErrors.zipCode = "ZIP Code must be 5 digits.";
    if (!formData.uploadId) newErrors.uploadId = "Upload ID is required.";
    if (!formData.headshotImage) newErrors.headshotImage = "Headshot image is required.";
    if (!formData.CardImage) newErrors.headshotImage = "Image Holding with Crad is required.";

    return newErrors;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "PhoneTel");
    const res = await fetch("https://api.cloudinary.com/v1_1/dvq8z9idm/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      let headshotUrl = "";
      if (formData.headshotImage) {
        headshotUrl = await uploadImage(formData.headshotImage);
      }

      let uploadIdUrl = "";
      if (formData.uploadId) {
        uploadIdUrl = await uploadImage(formData.uploadId);
      }
      let cardImageUrl = "";
      if (formData.uploadId) {
        cardImageUrl = await uploadImage(formData.CardImage);
      }

      const emailData = {
        ...formData,
        headshotImage: headshotUrl,
        uploadId: uploadIdUrl,
        CardImage: cardImageUrl,
      };

      const SERVICE_ID = "service_3yun0as";
      const TEMPLATE_ID = "template_ba5bgwx";
      const USER_ID = "umObW8a2WmDNWRv9d";

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, USER_ID);

      if (response.status === 200) {
        setSuccessMessage("Form submitted successfully!");
        setErrorMessage("");
        setFormData({
          campaign: "",
          firstName: "",
          lastName: "",
          ssn: "",
          dob: "",
          phone: "",
          email: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          uploadId: null,
          headshotImage: null,
          CardImage: null,
        });
      } else {
        setErrorMessage("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading images or sending email:", error);
      setErrorMessage("Form submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="https://res.cloudinary.com/dvq8z9idm/image/upload/v1736527106/hbunsigw2snedu55wutx.png" alt="Logo" className="h-20 rounded-full" />
          </div>
          <p className="text-gray-600 mt-2">Welcome! Please fill out the form below.</p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">New Agent Info</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="campaign" className="block text-sm font-medium text-gray-700">
                Campaign
              </label>
              <select
                id="campaign"
                name="campaign"
                value={formData.campaign}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
              >
                <option value="">Select Campaign</option>
                <option value="Safe Link">Safe Link</option>
                <option value="Starlink">Starlink</option>
                <option value="Vista">Vista</option>
                <option value="SafetyNet">SafetyNet</option>
              </select>
              {errors.campaign && <p className="text-red-500 text-sm">{errors.campaign}</p>}
            </div>

            {[
              { id: "firstName", label: "First Name", type: "text", placeholder: "Enter your first name" },
              { id: "lastName", label: "Last Name", type: "text", placeholder: "Enter your last name" },
              { id: "ssn", label: "SSN", type: "text", placeholder: "Enter your SSN (9 digits)" },
              { id: "dob", label: "Date of Birth", type: "date", placeholder: "" },
              { id: "phone", label: "Phone", type: "text", placeholder: "Enter your phone number (10 digits)" },
              { id: "email", label: "Email", type: "email", placeholder: "Enter your email address" },
              { id: "address", label: "Address", type: "text", placeholder: "Enter your address" },
              { id: "address2", label: "Address Line 2", type: "text", placeholder: "Enter additional address details" },
              { id: "city", label: "City", type: "text", placeholder: "Enter your city" },
              { id: "zipCode", label: "ZIP Code", type: "text", placeholder: "Enter your ZIP code (5 digits)" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
                />
                {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>}
              </div>
            ))}

            <div>
              <label htmlFor="uploadId" className="block text-sm font-medium text-gray-700">
                Upload ID
              </label>
              <input
                id="uploadId"
                name="uploadId"
                type="file"
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
              />
              {errors.uploadId && <p className="text-red-500 text-sm">{errors.uploadId}</p>}
            </div>

            <div>
              <label htmlFor="headshotImage" className="block text-sm font-medium text-gray-700">
                Headshot Image
              </label>
              <input
                id="headshotImage"
                name="headshotImage"
                type="file"
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
              />
              {errors.headshotImage && <p className="text-red-500 text-sm">{errors.headshotImage}</p>}
            </div>
            <div>
              <label htmlFor="CardImage" className="block text-sm font-medium text-gray-700">
                Card Holding Image
              </label>
              <input
                id="CardImage"
                name="CardImage"
                type="file"
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
              />
              {errors.headshotImage && <p className="text-red-500 text-sm">{errors.headshotImage}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>

        {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Form;
