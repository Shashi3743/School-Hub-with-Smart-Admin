import { Box, Button, CardMedia, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/registerSchema";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import './Register.css';

export default function Register() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    setImageUrl(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: ""
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      if (!file) {
        setMessage("Please Provide An Image.");
        setType("error");
        return;
      }

      const fd = new FormData();
      fd.append("image", file); // Must be named 'image' to match req.file
      fd.append("school_name", values.school_name);
      fd.append("email", values.email);
      fd.append("owner_name", values.owner_name);
      fd.append("password", values.password);

      axios
        .post(`${baseUrl}/school/register`, fd)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
          setFile(null);
          setImageUrl(null);
          Formik.resetForm();
        })
        .catch((e) => {
          const errMsg = e?.response?.data?.message || "Registration failed";
          setMessage(errMsg);
          setType("error");
          console.log("Error in register submit", errMsg);
        });
    }
  });

  return (
    <Box sx={{
      width: "100%",
      minHeight: "80vh",
      background: "url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
      backgroundSize: "cover"
    }}>
      <Box sx={{ padding: '40px', maxWidth: "700px", margin: "auto" }}>
        {message && <CustomizedSnackbars reset={resetMessage} type={type} message={message} />}
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h3">Register School</Typography>
        </Box>
        <Paper sx={{ padding: "20px", margin: "10px", minWidth: '320px' }}>
          <Box component="form" noValidate autoComplete="off" onSubmit={Formik.handleSubmit}>

            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
              <Typography style={{ marginRight: "50px" }} variant="h4">Add School Picture</Typography>
              <TextField
                sx={{ marginTop: "10px" }}
                variant="outlined"
                type="file"
                name="image"
                onChange={addImage}
              />
              {file && (
                <Box sx={{ position: "relative" }}>
                  <CardMedia component="img" image={imageUrl} height={'240px'} />
                </Box>
              )}
            </Box>

            <TextField
              fullWidth sx={{ marginTop: "10px" }}
              label="School Name"
              variant="outlined"
              name="school_name"
              value={Formik.values.school_name}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.school_name && Formik.errors.school_name && (
              <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.school_name}</p>
            )}

            <TextField
              fullWidth sx={{ marginTop: "10px" }}
              label="Email"
              variant="outlined"
              name="email"
              value={Formik.values.email}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.email && Formik.errors.email && (
              <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.email}</p>
            )}

            <TextField
              fullWidth sx={{ marginTop: "10px" }}
              label="Your Name"
              variant="outlined"
              name="owner_name"
              value={Formik.values.owner_name}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.owner_name && Formik.errors.owner_name && (
              <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.owner_name}</p>
            )}

            <TextField
              fullWidth sx={{ marginTop: "10px" }}
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              value={Formik.values.password}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.password && Formik.errors.password && (
              <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.password}</p>
            )}

            <TextField
              fullWidth sx={{ marginTop: "10px" }}
              label="Confirm Password"
              type="password"
              variant="outlined"
              name="confirm_password"
              value={Formik.values.confirm_password}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.confirm_password && Formik.errors.confirm_password && (
              <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.confirm_password}</p>
            )}

            <Box sx={{ marginTop: "10px" }}>
              <Button type="submit" sx={{ marginRight: "10px" }} variant="contained">Submit</Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
