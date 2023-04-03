import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../css/UserProfile.css';
import { NavLink } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch the user data from the server
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token:', accessToken);

    fetch('https://localhost:3001/user/entity', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then((data) => {
        console.log('Received user data:', data); // Log the user data
        setUser(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);


  const validationSchema = Yup.object({
    nickname: Yup.string()
      .max(50, 'Must be 50 characters or less')
      .required('Required'),
    occupation: Yup.string()
      .max(100, 'Must be 100 characters or less')
      .required('Required'),
    var1: Yup.string().max(100, 'Must be 100 characters or less'),
    var2: Yup.string().max(100, 'Must be 100 characters or less'),
    var3: Yup.string().max(100, 'Must be 100 characters or less'),
    var4: Yup.string().max(100, 'Must be 100 characters or less'),
    var5: Yup.string().max(100, 'Must be 100 characters or less'),
    var6: Yup.string().max(100, 'Must be 100 characters or less'),
  });

  return (
    <div className="user-profile bg-gray-100 h-screen">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <p>ID: {user.linkedinId}</p>
        <p>Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <img className="w-1/4 mx-auto mt-4" src={user.photo} alt="Profile photo" />
  
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Complete your profile</h2>
          <Formik
            initialValues={{
              nickname: '',
              occupation: '',
              var1: '',
              var2: '',
              var3: '',
              var4: '',
              var5: '',
              var6: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              const accessToken = localStorage.getItem('accessToken');
              fetch('https://localhost:3001/user/profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ ...values, userId: user.id }),
              })
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error('Error saving user profile data');
                  }
                })
                .then((data) => {
                  console.log('User profile data saved:', data);
                  setSubmitting(false); 
                  resetForm(); 
                })
                .catch((error) => {
                  console.error('Error:', error);
                  setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="user-profile-form bg-white p-4 rounded-lg shadow-md">
                <div className="form-group mb-4">
                  <label htmlFor="nickname" className="block text-gray-700 font-bold mb-2">Nickname:</label>
                  <Field type="text" id="nickname" name="nickname" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="nickname" component="p" className="text-red-500 text-xs italic" />
                </div>
  
                <div className="form-group mb-4">
                  <label htmlFor="occupation" className="block text-gray-700 font-bold mb-2">Occupation:</label>
                  <Field type="text" id="occupation" name="occupation" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="occupation" component="p" className="text-red-500 text-xs italic" />
                </div>
  
                {/* Additional form fields */}
                <div className="form-group mb-4">
                  <label htmlFor="var1" className="block text-gray-700 font-bold mb-2">Var1:</label>
                  <Field type="text" id="var1" name="var1" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var1" component="p" className="text-red-500 text-xs italic" />
                </div>
  
                <div className="form-group mb-4">
                  <label htmlFor="var2" className="block text-gray-700 font-bold mb-2">Var2:</label>
                  <Field type="text" id="var2" name="var2" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var2" component="p" className="text-red-500 text-xs italic" />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="var3" className="block text-gray-700 font-bold mb-2">Var3:</label>
                  <Field type="text" id="var3" name="var3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var3" component="p" className="text-red-500 text-xs italic" />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="var4" className="block text-gray-700 font-bold mb-2">Var4:</label>
                  <Field type="text" id="var4" name="var4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var4" component="p" className="text-red-500 text-xs italic" />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="var5" className="block text-gray-700 font-bold mb-2">Var5:</label>
                  <Field type="text" id="var5" name="var5" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var5" component="p" className="text-red-500 text-xs italic" />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="var6" className="block text-gray-700 font-bold mb-2">Var6:</label>
                  <Field type="text" id="var6" name="var6" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <ErrorMessage name="var6" component="p" className="text-red-500 text-xs italic" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </Form>
              )}
            </Formik>
            
            </div>
        </div>
        <NavLink to="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Back to homepage
            </NavLink>
      </div>
      
); 
};

export default UserProfile;
           
