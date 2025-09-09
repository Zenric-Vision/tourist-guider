'use client';

import { useState } from 'react';
import { User, VerificationProgress } from '@/types';
import { guidesAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface GuideVerificationProgressProps {
  guide: User;
  onUpdate: (guide: User) => void;
}

export default function GuideVerificationProgress({ guide, onUpdate }: GuideVerificationProgressProps) {
  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<VerificationProgress>({
    basicDetailsCompleted: guide.basicDetailsCompleted || false,
    videoRecordingCompleted: guide.videoRecordingCompleted || false,
    eSignDeclarationCompleted: guide.eSignDeclarationCompleted || false,
    approvalCompleted: guide.approvalCompleted || false,
    companyName: guide.companyName || '',
    foundingDate: guide.foundingDate ? new Date(guide.foundingDate) : undefined,
    websiteUrl: guide.websiteUrl || '',
    socialMediaProfile: guide.socialMediaProfile || '',
    ownVehicle: guide.ownVehicle || false,
    vehicleDescription: guide.vehicleDescription || '',
    isExperienced: guide.isExperienced || false,
    experienceDetails: guide.experienceDetails || '',
    languagesKnown: guide.languagesKnown || [],
    governmentDocument: guide.governmentDocument || '',
    officeAddressProof: guide.officeAddressProof || '',
    videoRecording: guide.videoRecording || '',
    eSignDeclaration: guide.eSignDeclaration || '',
  });

  const progressBars = [
    { id: 1, title: 'Basic Details', completed: guide.basicDetailsCompleted },
    { id: 2, title: 'Video Recording', completed: guide.videoRecordingCompleted },
    { id: 3, title: 'E-Sign Declaration', completed: guide.eSignDeclarationCompleted },
    { id: 4, title: 'Approval', completed: guide.approvalCompleted },
  ];

  const handleUpdateProgress = async (progressData: Partial<VerificationProgress>) => {
    setIsLoading(true);
    try {
      const updatedGuide = await guidesAPI.updateVerificationProgress(guide._id, progressData);
      onUpdate(updatedGuide);
      toast.success('Progress updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicDetailsSubmit = async () => {
    const data = {
      ...formData,
      basicDetailsCompleted: true,
    };
    await handleUpdateProgress(data);
  };

  const handleVideoRecordingSubmit = async () => {
    const data = {
      ...formData,
      videoRecordingCompleted: true,
    };
    await handleUpdateProgress(data);
  };

  const handleESignDeclarationSubmit = async () => {
    const data = {
      ...formData,
      eSignDeclarationCompleted: true,
    };
    await handleUpdateProgress(data);
  };

  const handleApprovalSubmit = async () => {
    const data = {
      ...formData,
      approvalCompleted: true,
    };
    await handleUpdateProgress(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Progress</h2>
      
      {/* Progress Bars */}
      <div className="flex space-x-2 mb-8">
        {progressBars.map((bar) => (
          <div key={bar.id} className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                bar.completed 
                  ? 'bg-green-500 text-white' 
                  : activeTab === bar.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {bar.completed ? '✓' : bar.id}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{bar.title}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  bar.completed ? 'bg-green-500' : activeTab === bar.id ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: bar.completed ? '100%' : activeTab === bar.id ? '50%' : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Content */}
      <div className="space-y-6">
        {/* Progress Bar 1: Basic Details */}
        <div className={`border rounded-lg p-4 ${activeTab === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
            <button
              onClick={() => setActiveTab(1)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {activeTab === 1 ? 'Active' : 'Open'}
            </button>
          </div>
          
          {activeTab === 1 && (
            <div className="space-y-4">
              {guide.guiderType === 'Agency' ? (
                // Agency fields
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter full legal company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Founding Date</label>
                    <input
                      type="date"
                      value={formData.foundingDate ? formData.foundingDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, foundingDate: new Date(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website URL</label>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://www.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Social Media Profile</label>
                    <input
                      type="url"
                      value={formData.socialMediaProfile}
                      onChange={(e) => setFormData({ ...formData, socialMediaProfile: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Facebook, Instagram, or LinkedIn profile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Government Document *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Office Address Proof *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </>
              ) : (
                // Professional fields
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Languages Known *</label>
                    <div className="mt-2 space-y-2">
                      {['Hindi', 'English', 'Spanish'].map((lang) => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.languagesKnown?.includes(lang) || false}
                            onChange={(e) => {
                              const current = formData.languagesKnown || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, languagesKnown: [...current, lang] });
                              } else {
                                setFormData({ ...formData, languagesKnown: current.filter(l => l !== lang) });
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Social Media Profile</label>
                    <input
                      type="url"
                      value={formData.socialMediaProfile}
                      onChange={(e) => setFormData({ ...formData, socialMediaProfile: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Facebook, Instagram, or LinkedIn profile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Own Vehicle</label>
                    <select
                      value={formData.ownVehicle?.toString()}
                      onChange={(e) => setFormData({ ...formData, ownVehicle: e.target.value === 'true' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  {formData.ownVehicle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle Description</label>
                      <input
                        type="text"
                        value={formData.vehicleDescription}
                        onChange={(e) => setFormData({ ...formData, vehicleDescription: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Toyota Innova, up to 5 seats"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Are You Experienced?</label>
                    <select
                      value={formData.isExperienced?.toString()}
                      onChange={(e) => setFormData({ ...formData, isExperienced: e.target.value === 'true' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  {formData.isExperienced && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience Details</label>
                      <textarea
                        value={formData.experienceDetails}
                        onChange={(e) => setFormData({ ...formData, experienceDetails: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 2 years guiding Taj Mahal"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Government Document *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </>
              )}
              
              <button
                onClick={handleBasicDetailsSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Mark as Complete'}
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar 2: Video Recording */}
        <div className={`border rounded-lg p-4 ${activeTab === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Video Recording</h3>
            <button
              onClick={() => setActiveTab(2)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {activeTab === 2 ? 'Active' : 'Open'}
            </button>
          </div>
          
          {activeTab === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Record a short video (1-2 minutes) about your business and achievements.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Video Recording</label>
                <input
                  type="file"
                  accept="video/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">MP4 format, maximum 2 minutes, 50MB</p>
              </div>
              
              <button
                onClick={handleVideoRecordingSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Mark as Complete'}
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar 3: E-Sign Declaration */}
        <div className={`border rounded-lg p-4 ${activeTab === 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">E-Sign Declaration</h3>
            <button
              onClick={() => setActiveTab(3)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {activeTab === 3 ? 'Active' : 'Open'}
            </button>
          </div>
          
          {activeTab === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                E-sign a compliance declaration agreeing to terms.
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  "I confirm that all details provided are true and accurate. I agree to comply with all applicable laws and regulations."
                </p>
              </div>
              
              <button
                onClick={handleESignDeclarationSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'E-Sign Declaration'}
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar 4: Approval */}
        <div className={`border rounded-lg p-4 ${activeTab === 4 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Approval</h3>
            <button
              onClick={() => setActiveTab(4)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {activeTab === 4 ? 'Active' : 'Open'}
            </button>
          </div>
          
          {activeTab === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                System reviews your documents, video, and e-signature (3-5 days).
              </p>
              {guide.isVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Verification Complete!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Your account has been verified and you can now accept bookings.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        Under Review
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your verification is being reviewed. This usually takes 3-5 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!guide.isVerified && (
                <button
                  onClick={handleApprovalSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Submit for Approval'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
