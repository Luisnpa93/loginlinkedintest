import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch the user data from the server
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token:', accessToken);

    fetch('https://localhost:3001/auth/user', {
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
    <div className="user-profile">
      <h1>User Profile</h1>
      <p>ID: {user.linkedinId}</p>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>

      <h2>Complete your profile</h2>
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
          console.log('Form data:', values);

          // Save the form data to the server
          const accessToken = localStorage.getItem('accessToken');
          fetch('https://localhost:3001/user-profile', {
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
              setSubmitting(false); // Reset the isSubmitting state
              resetForm(); // Reset the form values
            })
            .catch((error) => {
              console.error('Error:', error);
              setSubmitting(false); // Reset the isSubmitting state
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="user-profile-form">
            <div className="form-group">
              <label htmlFor="nickname">Nickname:</label>
              <Field type="text" id="nickname" name="nickname" />
              <ErrorMessage name="nickname" />
            </div>

            <div className="form-group">
              <label htmlFor="occupation">Occupation:</label>
              <Field type="text" id="occupation" name="occupation" />
              <ErrorMessage name="occupation" />
            </div>

            {/* Additional form fields */}
            <div className="form-group">
              <label htmlFor="var1">Var1:</label>
              <Field type="text" id="var1" name="var1" />
              <ErrorMessage name="var1" />
            </div>

            <div className="form-group">
              <label htmlFor="var2">Var2:</label>
              <Field type="text" id="var2" name="var2" />
              <ErrorMessage name="var2" />
            </div>

            <div className="form-group">
              <label htmlFor="var3">Var3:</label>
              <Field type="text" id="var3" name="var3" />
              <ErrorMessage name="var3" />
            </div>

            <div className="form-group">
              <label htmlFor="var4">Var4:</label>
              <Field type="text" id="var4" name="var4" />
              <ErrorMessage name="var4" />
            </div>

            <div className="form-group">
              <label htmlFor="var5">Var5:</label>
              <Field type="text" id="var5" name="var5" />
              <ErrorMessage name="var5" />
            </div>

            <div className="form-group">
              <label htmlFor="var6">Var6:</label>
              <Field type="text" id="var6" name="var6" />
              <ErrorMessage name="var6" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserProfile;
           
