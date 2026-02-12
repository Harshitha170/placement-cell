import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', formData);
            updateUser(response.data);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="input-field bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <input
                            type="text"
                            value={user?.role}
                            disabled
                            className="input-field bg-gray-100 capitalize"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
