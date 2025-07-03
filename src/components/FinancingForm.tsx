/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCountries } from "@/context/CountryProvider";
import { submitRequest } from "@/services/api";
import { OPEC_COUNTRIES } from "@/utli/constant";
import { formatWithCommas } from "@/utli/Helper";
import { FormData } from "@/utli/types/FromTypes";
import { FormError, validateForm } from "@/utli/Validation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";



export const FinancingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    country: "",
    projectCode: "",
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    currency: "",
  });

  const countries = useCountries();
  const [errors, setErrors] = useState<FormError>({});
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      | HTMLFormElement
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrors({
      ...errors,
      [event.target.name]: "",
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(rawValue)) return;

    setFormData({
      ...formData,
      amount: rawValue,
    });

    setDisplayAmount(formatWithCommas(rawValue));
    setErrors({
      ...errors,
      amount: "",
    });
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    const isOpecMember = OPEC_COUNTRIES.includes(selectedCountry);

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      currency: isOpecMember ? "USD" : "",
    }));
    setErrors((prev) => ({
      ...prev,
      country: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await submitRequest(formData);
        setLoading(false);
        setModalType("success");

        // Reset form on success
        setFormData({
          name: "",
          country: "",
          projectCode: "",
          description: "",
          startDate: "",
          endDate: "",
          amount: "",
          currency: "",
        });
        setDisplayAmount("");

      } catch (error) {
        console.error("Submission failed:", error);
        setModalType("error");
      }
    }
  };

  useEffect(() => {
    const allFilled = Object.values(formData).every(
      (val) => val && val.toString().trim() !== ""
    );
    if (allFilled) {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
    }
  }, [formData]);

  useEffect(() => {
    if (modalType) {
      const timeout = setTimeout(() => {
        setModalType(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [modalType]);

  const isFormComplete = (): boolean => {
    const allFilled = Object.values(formData).every(
      (val) => val && val.toString().trim() !== ""
    );
    const noErrors = Object.keys(errors).length === 0;
    return allFilled && noErrors;
  };

  const getminstartdate = (): string => {
    const today = new Date();
    today.setDate(today.getDate() + 15);
    return today.toISOString().split("T")[0];
  };

  const getminenddate = (): string => {
    if (!formData.startDate) return "";
    const date = new Date(formData.startDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  };

  const getmaxendate = (): string => {
    if (!formData.startDate) return "";
    const date = new Date(formData.startDate);
    date.setFullYear(date.getFullYear() + 3);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">
          Financing Request Form
        </h2>
        <p className="text-blue-200 mt-1">
          Submit your project for financing consideration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiInfo className="mr-2 text-blue-600" />
                Applicant Information
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name & Surname
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none "
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Information Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiInfo className="mr-2 text-blue-600" />
                Project Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="projectCode"
                  value={formData.projectCode}
                  onChange={handleChange}
                  placeholder="ABCD-1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.projectCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.projectCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (max 150 chars)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={150}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief project description..."
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {formData.description.length}/150
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiInfo className="mr-2 text-blue-600" />
              Project Timeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity Start Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                min={getminstartdate()}
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Minimum 15 days from today
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity End Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                min={getminenddate()}
                max={getmaxendate()}
                value={formData.endDate}
                onChange={handleChange}
                disabled={!formData.startDate}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.startDate ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                1-3 years from start date
              </div>
            </div>
          </div>
        </div>

        {/* Financial Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiInfo className="mr-2 text-blue-600" />
              Financial Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  name="amount"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  placeholder="1,000,000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="USD, EUR, etc."
                disabled={OPEC_COUNTRIES.includes(formData.country)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  OPEC_COUNTRIES.includes(formData.country)
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />
              {OPEC_COUNTRIES.includes(formData.country) && (
                <div className="text-xs text-gray-500 mt-1">
                  USD required for OPEC countries
                </div>
              )}
              {errors.currency && (
                <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={!isFormComplete()}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
              isFormComplete()
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
            <FiCheckCircle className="ml-2" />
          </button>
        </div>
      </form>

      {/* Enhanced Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
          <div
            className={`bg-white rounded-xl shadow-2xl transform transition-all duration-300 w-full max-w-md overflow-hidden ${
              modalType ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div
              className={`p-6 ${
                modalType === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="flex items-center">
                {modalType === "success" ? (
                  <FiCheckCircle className="text-green-600 text-3xl mr-3" />
                ) : (
                  <FiXCircle className="text-red-600 text-3xl mr-3" />
                )}
                <h3 className="text-xl font-bold text-gray-800">
                  {modalType === "success"
                    ? "Request Submitted"
                    : "Submission Failed"}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                {modalType === "success"
                  ? "Your financing request has been successfully submitted. Our team will review your application and contact you shortly."
                  : "We encountered an issue processing your request. Please verify your information and try again."}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setModalType(null)}
                  className={`px-5 py-2 rounded-lg font-medium ${
                    modalType === "success"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancingForm;
