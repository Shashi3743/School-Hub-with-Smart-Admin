import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { studentSchema } from "../../../yupSchema/studentSchema";
import StudentCardAdmin from "../../utility components/student card/StudentCard";

export default function Students() {
  const [studentClass, setStudentClass] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    student_class: "",
    gender: "",
    age: "",
    guardian: "",
    guardian_phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const fileInputRef = useRef(null);
  const [params, setParams] = useState({});


  const handleSearch = (e) => {
      let newParam;
      if (e.target.value !== "") {
        newParam = { ...params, search: e.target.value };
      } else {
        newParam = { ...params };
        delete newParam["search"];
      }
  
      setParams(newParam);
    };

  const resetMessage = () => setMessage("");

  const fetchStudentClass = () => {
    axios.get(`${baseUrl}/class/fetch-all`).then((resp) => setStudentClass(resp.data.data));
  };

  const fetchStudents = () => {
    axios.get(`${baseUrl}/student/fetch-with-query`, { params }).then((resp) => setStudents(resp.data.data));
  };

  useEffect(() => {
    fetchStudents();
    fetchStudentClass();
  }, [message, params]);

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
    setImageUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/student/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response?.data?.message || "Delete failed");
          setType("error");
        });
    }
  };

  const handleEdit = (id) => {
    setEdit(true);
    axios.get(`${baseUrl}/student/fetch-single/${id}`).then((resp) => {
      const data = resp.data.data;
      setFormData({
        email: data.email,
        name: data.name,
        student_class: data.student_class?._id || "",
        gender: data.gender,
        age: data.age,
        guardian: data.guardian,
        guardian_phone: data.guardian_phone,
        password: "",
      });
      setImageUrl(data.student_image);
      setFile(null);
      setEditId(data._id);
    });
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      student_class: "",
      gender: "",
      age: "",
      guardian: "",
      guardian_phone: "",
      password: "",
    });
    handleClearFile();
    setErrors({});
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered");
    console.log("Form Data:", formData);
    console.log("Is Edit Mode:", isEdit);
    console.log("Editing ID:", editId);

    let schemaToUse = studentSchema;

  // 👉 If editing, make a modified schema that doesn't require password
  if (isEdit) {
    schemaToUse = studentSchema.shape({
      password: studentSchema.fields.password.notRequired(),
    });
  }

  try {
    await schemaToUse.validate(formData, { abortEarly: false });
    setErrors({});
  } catch (validationError) {
    const formatted = {};
    validationError.inner.forEach((err) => {
      formatted[err.path] = err.message;
    });
    setErrors(formatted);
    return;
  }

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (!(isEdit && key === "password" && formData[key] === "")) {
        fd.append(key, formData[key]);
      }
    });
    if (file) fd.append("image", file);
    console.log("tried")
    const api = isEdit
      ? axios.patch(`${baseUrl}/student/update/${editId}`, fd)
      : axios.post(`${baseUrl}/student/register`, fd);
      
      

    api
      .then((resp) => {
        setMessage(resp.data.message);
        setType("success");
        cancelEdit();
      })
      .catch((e) => {
        setMessage(e.response?.data?.message || "Submission failed.");
        setType("error");
      });
  };

  return (
    <>
      {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}
      <Box sx={{ padding: "40px 10px 20px 10px" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h2">Students</Typography>
        </Box>

        <Box sx={{ padding: "40px" }}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center" }}>
              {isEdit ? "Edit Student" : "Add New Student"}
            </Typography>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Typography sx={{ marginRight: "50px" }} variant="h4">
                  Student Pic
                </Typography>
                <TextField type="file" name="file" onChange={handleImageChange} inputRef={fileInputRef} />
                {imageUrl && (
                  <Box sx={{ position: "relative", marginLeft: 2 }}>
                    <CardMedia component="img" image={imageUrl} height="240" sx={{ objectFit: "cover" }} />
                  </Box>
                )}
              </Box>

              {["email", "name", "age", "guardian", "guardian_phone"].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                  name={field}
                  variant="outlined"
                  value={formData[field]}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                  error={Boolean(errors[field])}
                  helperText={errors[field]}
                />
              ))}

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Class</InputLabel>
                <Select
                  name="student_class"
                  value={formData.student_class}
                  onChange={handleChange}
                  onBlur={handleChange}
                  label="Class"
                >
                  {studentClass.map((cls) => (
                    <MenuItem key={cls._id} value={cls._id}>
                      {cls.class_text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleChange}
                  label="Gender"
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              {!isEdit && (
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              )}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                {isEdit ? "Update Student" : "Register Student"}
              </Button>
              {isEdit && (
                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </form>
          </Paper>
          
           
        </Box>

         <Box
            sx={{
              padding: "5px",
              minWidth: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
           
           
  
            <TextField
              id=""
              label="Search Name  .. "
              onChange={handleSearch}
            />
          </Box>

        <Box sx={{ padding: "40px", display: "flex", flexWrap: "wrap" }}>
          {students.map((student, i) => (
            <StudentCardAdmin
              key={i}
              student={student}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}
