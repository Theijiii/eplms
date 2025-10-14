
import React, { useState } from "react";

export default function ProfessionalRegistration() {
  const professions = {
    Architect: ["Designer of Record", "Interior Design Consultant", "Landscape Designer", "Consultant"],
    "Civil Engineer": ["Designer of Record", "Structural Designer", "Inspector / Supervisor", "Contractor"],
    "Structural Engineer": ["Structural Designer", "Inspector / Supervisor", "Consultant"],
    "Electrical Engineer": ["Electrical Designer", "Inspector / Supervisor", "Consultant"],
    "Mechanical Engineer": ["Mechanical Designer", "Consultant"],
    "Electronics Engineer": ["Electronics Designer", "Consultant"],
    "Sanitary Engineer": ["Sanitary / Plumbing Designer", "Consultant"],
    "Master Plumber": ["Plumbing Designer", "Consultant"],
    "Geodetic Engineer": ["Surveyor"],
    "Interior Designer": ["Interior Design Consultant"],
    "Landscape Architect": ["Landscape Designer"],
    "Environmental Planner": ["Environmental Consultant"],
    "Fire Protection Engineer": ["Fire Safety Consultant"],
    Contractor: ["Contractor"],
  };

  const steps = [
    { id: 1, title: "Personal Information", description: "Basic personal details" },
    { id: 2, title: "Professional Credentials", description: "License and credentials" },
    { id: 3, title: "Specialization", description: "Profession and role" },
    { id: 4, title: "Uploads", description: "Required documents" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    suffix: "",
    birth_date: "",
    contact_number: "",
    email: "",
    prc_license: "",
    prc_expiry: "",
    ptr_number: "",
    tin: "",
    profession: "",
    role: "",
    attachments: [],
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, attachments: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const e = {};
      if (!formData.first_name || formData.first_name.trim() === '') e.first_name = 'First name is required';
      if (!formData.last_name || formData.last_name.trim() === '') e.last_name = 'Last name is required';
      if (!formData.birth_date) e.birth_date = 'Birth date is required';
      if (!formData.contact_number || formData.contact_number.trim() === '') e.contact_number = 'Contact number is required';
      if (!formData.email || formData.email.trim() === '') e.email = 'Email is required';
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setErrors({});
    }

    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus({ type: "success", message: "Registration submitted successfully!" });
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <NameFields formData={formData} handleChange={handleChange} errors={errors} required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Date of Birth *</label>
                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Contact Number *</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Professional Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">PRC License Number *</label>
                <input type="text" name="prc_license" value={formData.prc_license} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">PRC Expiry Date *</label>
                <input type="date" name="prc_expiry" value={formData.prc_expiry} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">PTR Number *</label>
                <input type="text" name="ptr_number" value={formData.ptr_number} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block mb-2 font-medium">TIN *</label>
                <input type="text" name="tin" value={formData.tin} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Specialization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Profession *</label>
                <select name="profession" value={formData.profession} onChange={(e) => { handleChange(e); setFormData((prev) => ({ ...prev, role: "" })); }} className="w-full p-3 border rounded-lg" required>
                  <option value="">Select profession</option>
                  {Object.keys(professions).map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Role in Project *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border rounded-lg" required disabled={!formData.profession}>
                  <option value="">Select role</option>
                  {formData.profession && professions[formData.profession].map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Upload PRC ID / PTR / Signature *</label>
                <input type="file" name="attachments" onChange={handleChange} className="w-full p-3 border rounded-lg" multiple required />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 rounded-lg min-h-screen" style={{ background: '#fbfbfb', color: '#222' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#4a90e2' }}>Professional / Engineer Registration</h1>
          <p className="mt-2" style={{ color: '#9aa5b1' }}>
            Register as a licensed professional or engineer to be accredited for building projects.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full border-2"
                style={{
                  background: currentStep >= step.id ? '#4a90e2' : '#fff',
                  borderColor: currentStep >= step.id ? '#4a90e2' : '#9aa5b1',
                  color: currentStep >= step.id ? '#fff' : '#9aa5b1',
                }}
              >
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium" style={{ color: currentStep >= step.id ? '#4a90e2' : '#9aa5b1' }}>{step.title}</p>
                <p className="text-xs" style={{ color: '#9aa5b1' }}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 mx-4" style={{ background: currentStep > step.id ? '#4a90e2' : '#9aa5b1' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {submitStatus && (
        <div className="p-4 mb-6 rounded" style={{ background: submitStatus.type === 'success' ? '#e6f9ed' : '#fdecea', color: submitStatus.type === 'success' ? '#4caf50' : '#e53935', border: `1px solid ${submitStatus.type === 'success' ? '#4caf50' : '#e53935'}` }}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#9aa5b1', color: '#fff' }}>
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button type="button" onClick={nextStep} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#4a90e2', color: '#fff' }}>
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg font-semibold" style={{ background: isSubmitting ? '#9aa5b1' : '#4caf50', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
