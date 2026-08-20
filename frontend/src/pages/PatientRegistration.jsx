import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { createPatient } from '../api/patients';

const initialForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  registrationDate: '',
};

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export default function PatientRegistration({ toast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else if (isNaN(Date.parse(form.dateOfBirth))) newErrors.dateOfBirth = 'Invalid date format';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (form.registrationDate && isNaN(Date.parse(form.registrationDate)))
      newErrors.registrationDate = 'Invalid date format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.registrationDate) delete payload.registrationDate;
      await createPatient(payload);
      toast.success('Patient Registered', `${form.firstName} ${form.lastName} has been successfully registered.`);
      setForm(initialForm);
      setErrors({});
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      toast.error('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          Add a new patient to the system. All fields marked with <span className="text-danger-500">*</span> are required.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="e.g. John"
              required
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="e.g. Doe"
              required
            />
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />
            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={form.gender}
              onChange={handleChange}
              error={errors.gender}
              options={genderOptions}
              required
            />
            <FormField
              label="Registration Date"
              name="registrationDate"
              type="date"
              value={form.registrationDate}
              onChange={handleChange}
              error={errors.registrationDate}
              helpText="Defaults to today if left empty"
              className="sm:col-span-2"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={() => { setForm(initialForm); setErrors({}); }}>
              Reset
            </Button>
            <Button type="submit" loading={loading}>
              Register Patient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
