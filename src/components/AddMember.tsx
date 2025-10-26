import { useState } from 'react';
import './AddMember.css';
import { addMemberToSheet, type NewMemberData } from '../services/googleSheetsService';

interface FamilyMember {
  name: string;
  age: string;
  businessJob: string;
}

interface MemberFormData {
  name: string;
  mobile: string;
  village: string;
  currentAddress: string;
  member2: FamilyMember;
  member3: FamilyMember;
  member4: FamilyMember;
  member5: FamilyMember;
  member6: FamilyMember;
  remark: string;
}

const initialFormData: MemberFormData = {
  name: '',
  mobile: '',
  village: '',
  currentAddress: '',
  member2: { name: '', age: '', businessJob: '' },
  member3: { name: '', age: '', businessJob: '' },
  member4: { name: '', age: '', businessJob: '' },
  member5: { name: '', age: '', businessJob: '' },
  member6: { name: '', age: '', businessJob: '' },
  remark: '',
};

interface AddMemberProps {
  onBack: () => void;
  onMemberAdded?: () => void; // Callback to refresh data after adding member
}

function AddMember({ onBack, onMemberAdded }: AddMemberProps) {
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [showFamilyMembers, setShowFamilyMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        if (!/^[a-zA-Z\s.]+$/.test(value)) return 'Name can only contain letters, spaces, and dots';
        return null;
      
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[0-9]{10}$/.test(value.trim())) return 'Mobile number must be exactly 10 digits';
        if (!/^[6-9]/.test(value.trim())) return 'Mobile number must start with 6, 7, 8, or 9';
        return null;
      
      case 'village':
        if (!value.trim()) return 'Village is required';
        if (value.trim().length < 2) return 'Village name must be at least 2 characters';
        if (value.trim().length > 100) return 'Village name must be less than 100 characters';
        return null;
      
      case 'currentAddress':
        if (!value.trim()) return 'Current address is required';
        if (value.trim().length < 5) return 'Address must be at least 5 characters';
        if (value.trim().length > 500) return 'Address must be less than 500 characters';
        return null;
      
      case 'remark':
        if (value.trim().length > 500) return 'Remark must be less than 500 characters';
        return null;
      
      default:
        return null;
    }
  };

  const validateFamilyMember = (field: keyof FamilyMember, value: string): string | null => {
    switch (field) {
      case 'name':
        if (value.trim() && value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        if (value.trim() && !/^[a-zA-Z\s.]+$/.test(value)) return 'Name can only contain letters, spaces, and dots';
        return null;
      
      case 'age':
        if (value.trim() && (!/^[0-9]+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 150)) {
          return 'Age must be a valid number between 0 and 150';
        }
        return null;
      
      case 'businessJob':
        if (value.trim().length > 100) return 'Business/Job must be less than 100 characters';
        return null;
      
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate and update errors
    const error = validateField(field, value);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleFamilyMemberChange = (
    memberKey: 'member2' | 'member3' | 'member4' | 'member5' | 'member6',
    field: keyof FamilyMember,
    value: string
  ) => {
    // Update form data
    setFormData(prev => ({
      ...prev,
      [memberKey]: {
        ...prev[memberKey],
        [field]: value
      }
    }));

    // Validate family member field
    const error = validateFamilyMember(field, value);
    const errorKey = `${memberKey}.${field}`;
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields
    const errors: {[key: string]: string} = {};
    
    const nameError = validateField('name', formData.name);
    if (nameError) errors.name = nameError;
    
    const mobileError = validateField('mobile', formData.mobile);
    if (mobileError) errors.mobile = mobileError;
    
    const villageError = validateField('village', formData.village);
    if (villageError) errors.village = villageError;
    
    const addressError = validateField('currentAddress', formData.currentAddress);
    if (addressError) errors.currentAddress = addressError;

    const remarkError = validateField('remark', formData.remark);
    if (remarkError) errors.remark = remarkError;

    // Validate family members
    const familyMembers: Array<'member2' | 'member3' | 'member4' | 'member5' | 'member6'> = 
      ['member2', 'member3', 'member4', 'member5', 'member6'];
    
    familyMembers.forEach(memberKey => {
      const member = formData[memberKey];
      if (member.name || member.age || member.businessJob) {
        const nameErr = validateFamilyMember('name', member.name);
        if (nameErr) errors[`${memberKey}.name`] = nameErr;
        
        const ageErr = validateFamilyMember('age', member.age);
        if (ageErr) errors[`${memberKey}.age`] = ageErr;
        
        const businessErr = validateFamilyMember('businessJob', member.businessJob);
        if (businessErr) errors[`${memberKey}.businessJob`] = businessErr;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix all validation errors before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      // Prepare data for Google Sheets
      const newMemberData: NewMemberData = {
        name: formData.name,
        mobile: formData.mobile,
        village: formData.village,
        currentAddress: formData.currentAddress,
        member2Name: formData.member2.name,
        member2Age: formData.member2.age,
        member2Business: formData.member2.businessJob,
        member3Name: formData.member3.name,
        member3Age: formData.member3.age,
        member3Business: formData.member3.businessJob,
        member4Name: formData.member4.name,
        member4Age: formData.member4.age,
        member4Business: formData.member4.businessJob,
        member5Name: formData.member5.name,
        member5Age: formData.member5.age,
        member5Business: formData.member5.businessJob,
        member6Name: formData.member6.name,
        member6Age: formData.member6.age,
        member6Business: formData.member6.businessJob,
        remark: formData.remark,
      };

      console.log('=== SENDING TO GOOGLE SHEETS ===');
      console.log('Name:', newMemberData.name);
      console.log('Mobile:', newMemberData.mobile);
      console.log('Village:', newMemberData.village);
      console.log('Current Address:', newMemberData.currentAddress);
      console.log('Full data object:', JSON.stringify(newMemberData, null, 2));

      // Add to Google Sheet
      await addMemberToSheet(newMemberData);
      
      console.log('Member added successfully:', newMemberData);
      setSuccess(true);
      
      // Notify parent component to refresh data
      if (onMemberAdded) {
        onMemberAdded();
      }
      
      // Reset form after 2 seconds and go back to search
      setTimeout(() => {
        setFormData(initialFormData);
        setSuccess(false);
        setShowFamilyMembers(false);
        onBack(); // Return to search page
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
      console.error('Error adding member:', errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setShowFamilyMembers(false);
    setSuccess(false);
    setError(null);
    setValidationErrors({});
  };

  return (
    <div className="add-member-container">
      <div className="add-member-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Search
        </button>
        <h1>➕ Add New Member</h1>
        <p>Fill in the details to add a new community member</p>
      </div>

      {success && (
        <div className="success-banner">
          ✅ Member added successfully! Redirecting to search...
        </div>
      )}

      {error && (
        <div className="error-banner">
          ❌ Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="member-form">
        {/* Primary Information */}
        <div className="form-section">
          <h2>📋 Primary Information</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
                className={`form-input ${validationErrors.name ? 'input-error' : ''}`}
              />
              {validationErrors.name && (
                <span className="error-text">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="mobile">
                Mobile <span className="required">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Enter 10 digit mobile number"
                pattern="[0-9]{10}"
                required
                maxLength={10}
                className={`form-input ${validationErrors.mobile ? 'input-error' : ''}`}
              />
              {validationErrors.mobile && (
                <span className="error-text">{validationErrors.mobile}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="village">
                Village <span className="required">*</span>
              </label>
              <input
                id="village"
                type="text"
                value={formData.village}
                onChange={(e) => handleInputChange('village', e.target.value)}
                placeholder="Enter native village"
                required
                className={`form-input ${validationErrors.village ? 'input-error' : ''}`}
              />
              {validationErrors.village && (
                <span className="error-text">{validationErrors.village}</span>
              )}
            </div>

            <div className="form-field full-width">
              <label htmlFor="currentAddress">
                Current Address <span className="required">*</span>
              </label>
              <textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                placeholder="Enter current residential address"
                rows={3}
                required
                className={`form-input ${validationErrors.currentAddress ? 'input-error' : ''}`}
              />
              {validationErrors.currentAddress && (
                <span className="error-text">{validationErrors.currentAddress}</span>
              )}
            </div>
          </div>
        </div>

        {/* Family Members Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>👨‍👩‍👧‍👦 Family Members (Optional)</h2>
            <button
              type="button"
              onClick={() => setShowFamilyMembers(!showFamilyMembers)}
              className="toggle-btn"
            >
              {showFamilyMembers ? '▼ Hide' : '▶ Show'} Family Details
            </button>
          </div>

          {showFamilyMembers && (
            <div className="family-members">
              {(['member2', 'member3', 'member4', 'member5', 'member6'] as const).map((memberKey, idx) => (
                <div key={memberKey} className="family-member-card">
                  <h3>Member {idx + 2}</h3>
                  <div className="form-grid-family">
                    <div className="form-field">
                      <label htmlFor={`${memberKey}-name`}>Name</label>
                      <input
                        id={`${memberKey}-name`}
                        type="text"
                        value={formData[memberKey].name}
                        onChange={(e) => handleFamilyMemberChange(memberKey, 'name', e.target.value)}
                        placeholder="Name"
                        className={`form-input ${validationErrors[`${memberKey}.name`] ? 'input-error' : ''}`}
                      />
                      {validationErrors[`${memberKey}.name`] && (
                        <span className="error-text">{validationErrors[`${memberKey}.name`]}</span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor={`${memberKey}-age`}>Age</label>
                      <input
                        id={`${memberKey}-age`}
                        type="number"
                        value={formData[memberKey].age}
                        onChange={(e) => handleFamilyMemberChange(memberKey, 'age', e.target.value)}
                        placeholder="Age"
                        min="0"
                        max="150"
                        className={`form-input ${validationErrors[`${memberKey}.age`] ? 'input-error' : ''}`}
                      />
                      {validationErrors[`${memberKey}.age`] && (
                        <span className="error-text">{validationErrors[`${memberKey}.age`]}</span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor={`${memberKey}-businessJob`}>Business/Job</label>
                      <input
                        id={`${memberKey}-businessJob`}
                        type="text"
                        value={formData[memberKey].businessJob}
                        onChange={(e) => handleFamilyMemberChange(memberKey, 'businessJob', e.target.value)}
                        placeholder="Business or Job"
                        className={`form-input ${validationErrors[`${memberKey}.businessJob`] ? 'input-error' : ''}`}
                      />
                      {validationErrors[`${memberKey}.businessJob`] && (
                        <span className="error-text">{validationErrors[`${memberKey}.businessJob`]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Remark Section */}
        <div className="form-section">
          <h2>📝 Additional Information</h2>
          <div className="form-field">
            <label htmlFor="remark">Remark</label>
            <textarea
              id="remark"
              value={formData.remark}
              onChange={(e) => handleInputChange('remark', e.target.value)}
              placeholder="Add any additional notes or remarks..."
              rows={4}
              className={`form-input ${validationErrors.remark ? 'input-error' : ''}`}
            />
            {validationErrors.remark && (
              <span className="error-text">{validationErrors.remark}</span>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={submitting}
          >
            🔄 Reset Form
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '⏳ Saving...' : '✓ Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMember;
