import React, { useState, useEffect } from 'react';
import axios from 'axios';

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};


const List = () => {

  const today = new Date().toISOString().split('T')[0];

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');


//Get all User
  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);


  //Edit user
  const handleEdit = (user, index) => {
   
    
    setFormData(user);
    setFormData((prev) => ({
      ...prev,
      newname: prev.first + " " + prev.last,
      age: (calculateAge(new Date(prev.dob)))
    }));

    setOriginalData(user);
    setOriginalData((prev) => ({
      ...prev,
      newname: prev.first + " " + prev.last,
      age: calculateAge(new Date(prev.dob))
    }));

    const age = calculateAge(new Date(user.dob));
    if (age < 18) {
      alert('User must be an adult to edit.');
      return;
    }
    setEditId(user.id);
  };


  //Taking input 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };





  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

// Save Changes
  const handleSave = (userFullName) => {
var updatedUsers = users.map((user) => (user.id === editId ? formData : user));
    
    const nameParts = formData.newname.split(' ');
    if (nameParts.length > 1) {
      setFirstName(nameParts[0]);  
      setLastName(nameParts.slice(1).join(' ')); 
      
    } else {
      setFirstName(nameParts[0]);
      setLastName('');
    }
  
    setFormData(() => ({
     
      first: firstName,
      last: lastName  
    }));
    
  
  var updatedUsers = users.map((user) => (user.id === editId ? formData : user));

    setUsers(updatedUsers);
    setFormData({});


    setEditId(null);
    axios.put(`http://localhost:3000/users/${userId}`, formData)
      .then(response => {
               
      })
      .catch(error => {
      });
  };

  const [userId, setuserId] = useState(null);
  

//delete User
  const handleDelete = () => {
    
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    axios.delete(`http://localhost:3001/users/${userId}`, updatedUsers)
      .then(response => {
       
      })
      .catch(error => {
      });
    handleClick(editId);
  }

// Cencel Edit
  const handleCancel = (ab) => {
    setEditId(null);
    handleClick(ab);
    setFormData(originalData);
  };

  //Check input validation
  const isFormValid = () => {
    const { newname, age, country, description } = formData;
    return (
      newname.trim() !== '' &&
      description.trim() !== '' &&
      country.trim() !== '' &&
      // /^[0-9]+$/.test(age) &&
      /^[a-zA-Z\s]+$/.test(country)
    );
  };


//Open and Close accordion
  const [openIndex, setOpenIndex] = useState(null);
  const handleClick = (userid,index) => {
    setuserId(userid)
   
    
    if (editId !== null) return;
    setOpenIndex(openIndex === index ? null : index);
  };


  //Filter user
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      window.location.reload()
      setUsers(users);
      return;
    }

    const filtered = users.filter(entry =>
      entry.first.toLowerCase().includes(term) ||
      entry.last.toLowerCase().includes(term) ||
      entry.gender.toLowerCase().includes(term) ||
      entry.country.toLowerCase().includes(term)
    );
    setUsers(filtered);
  };


  return (
    <div>
      <div className="accordion">
        <div class="d-flex form-inputs search-inputs">
          <i class="bi bi-search"></i>
          <input value={searchTerm}
            onChange={handleSearch} class="form-control search-control ps-5" type="text" placeholder="Search User" />
        </div>

        {users.map((item, index) => (
          <div key={item.id} className="accordion-item rounded-4">
            {editId === item.id ? (
              <>
                <div className='inner-acc rounded-4 px-2 pb-2' >
                  <div className="accordion-header px-3 py-2  "
                    onClick={() => handleClick(item.id,index)}
                  >
                    <div className='d-flex' >
                       <img src={item.picture} className="user-avatar me-3 " />
                      <input
                        type="text"
                        name="newname"
                        value={formData.newname}
                        onChange={handleInputChange}
                        class="form-control rounded-4 fs-4 fw-500 input-boder name-input"
                      />
                    </div>
                  </div>
                  <div className="accordion-content">
                    <div className='d-flex justify-content-between gap-4 ' >
                      <div className='' >
                        <span className='light-gray fw-500 mb-1' >Age</span>
                        <br /> 
                        <span className='fw-500 '>

                        <div class="input-group mb-3 rounded-4 input-boder" type="date">
                          <input name="dob"
                            value={formData.age}
                            onChange={handleInputChange} type="date"
                            max={today}
                             class="form-control  age-input  rounded-start-4" placeholder="age"
                              />
                          <span class="input-group-text age-style  rounded-end-4"   >Years</span>
                        </div>
                        </span>
                      </div>

                      <div className=''><span className='light-gray fw-500 lh-2'>Gender</span>
                      <br />
                       <span className='fw-500 lh-1'>
                        <select onChange={handleInputChange} name='gender' class="form-control input-boder form-select rounded-4" id="floatingSelect" aria-label="Floating label select example">
                          <option selected>{formData.gender}</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                          <option value="Rather not say">Rather not say</option>
                          <option value="Other">Other</option>
                        </select>

                      </span>
                      </div>
                      <div className=''>
                        <span className='light-gray fw-500 lh-1'>Country</span>
                        <br /> 
                        <span className='fw-500 lh-1'> 
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        class="form-control rounded-4 input-boder"
                      />
                      </span>
                      </div>
                    </div>


                    <div className='mt-3 form-floating'>
                      <span className='light-gray fw-500 lh-1'>Description</span>
                      <p >

                        <textarea name="description"
                          value={formData.description}
                          onChange={handleInputChange} class="form-control rounded-4 input-boder" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: '120px' }}></textarea>
                      </p>
                    </div>
                    <div className="accordion-actions text-end">
                      <i onClick={() => handleCancel(index)} className="bi bi-x-circle me-3 fs-4 red curser"></i>
                      <button onClick={() => handleSave(item.newname)} disabled={!isFormValid() || JSON.stringify(formData) === JSON.stringify(originalData)} className="bi bi-check-circle fs-4 green curser save"></button>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <>
                <div className='inner-acc rounded-4 p-2  pb-2' >
                  <div
                    className="accordion-header px-3 py-2 "
                    onClick={() => handleClick(item.id,index)}
                  >
                    <div className='pt-1'> 
                      <img src={item.picture} className="user-avatar me-4 " />
                      <span className='fs-4 fw-500  ' >{item.first}</span>
                      <span className='ps-1 fs-4 fw-500 ' >{item.last}</span>

                    </div>

                    <span className="accordion-toggle fs-5">
                      {openIndex === index ? '-' : '+'}
                    </span>
                  </div>
                  {openIndex === index && (

                    <div className="accordion-content ">

                      <div className='d-flex justify-content-between' >
                        <div className='ms-2' ><span className='light-gray fw-500 lh-1' >Age</span><br /> <span className='fw-500 lh-1'>{calculateAge(new Date(item.dob))} Year</span></div>
                        <div className=''><span className='light-gray fw-500 lh-1'>Gender</span><br /> <span className='fw-500 lh-1'>{item.gender}</span></div>
                        <div className='me-5 pe-4'><span className='light-gray fw-500 lh-1'>Country</span><br /> <span className='fw-500 lh-1'>{item.country}</span></div>
                      </div>


                      <div className='ms-2 mt-2'>
                        <span className='light-gray fw-500 lh-1'>Description</span>
                        <div className='' >{item.description}</div>
                      </div>



                      <div className="accordion-actions text-end mt-2">
                        <i  data-bs-toggle="modal" data-bs-target="#exampleModal" class="bi bi-trash3 me-3 fs-4 red curser"></i>
                        <i onClick={() => handleEdit(item, index)} class="bi bi-pencil fs-4 blue curser"></i>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        ))}
      </div>




      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <p class="modal-title " id="exampleModalLabel">Are you sure you want to delete?</p>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-footer mt-3" >
              <button type="button" class="btn btn-light modal-button modal-cancel" data-bs-dismiss="modal">Close</button>
              <button onClick={() => handleDelete()} type="button" data-bs-dismiss="modal" class="btn btn-danger modal-button">Delete</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default List
