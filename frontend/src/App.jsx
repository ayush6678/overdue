import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', { name, amount, email });
      setName('');
      setAmount('');
      setEmail('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='app'>
      <h1 className='heading'>Over-Due</h1>

      <form onSubmit={addUser} className="input">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='input1'
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='input1'

        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input1'

        />
        <button type="submit" className='button'>Add User</button>
      </form>
      <h1 className='heading1'>Payment Pending:</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} className='list'>
            {user.name} - ₹{user.amount} - {user.email}
            <button onClick={() => deleteUser(user._id)} className='button' style={{ marginLeft: "50px" }}>Delete</button>
          </li>
        ))}
      </ul>
      <p className='luv'>
        made by ayyushh
      </p>
    </div>
  );
}

export default App;