/* eslint-disable react/prop-types */

import { Button, Typography, Card, CardActions, CardContent, CardMedia } from "@mui/material";

export default function TeacherCardAdmin({ handleEdit, teacher, handleDelete }) {
  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const dateNu = date.getDate();
    const month = +date.getMonth() + 1;
    const year = date.getFullYear();

    return `${dateNu}/${month}/${year}`;
  };

  return (
    <Card sx={{ maxWidth: 545, margin: 2 }}>
      <CardMedia
        component="img"
        alt="Teacher Image"
        height="340"
        image={teacher.teacher_image}
      />
      <CardContent>
        <Typography component="div" variant="h5">
          <b>Name:</b> <span>{teacher.name}</span>
        </Typography>
        <Typography component="div" variant="h5">
          <b>Email:</b> {teacher.email}
        </Typography>
        <Typography component="div" variant="h5">
          <b>Age:</b> {teacher.age}
        </Typography>
        <Typography component="div" variant="h5">
          <b>Gender:</b> {teacher.gender}
        </Typography>
        <Typography component="div" variant="h5">
          <b>Qualification:</b> {teacher.qualification}
        </Typography>
        <Typography component="div" variant="body1">
          <b>Date of Join:</b> <span>{convertDate(teacher.createdAt)}</span>
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          sx={{ background: "red", color: "#fff" }}
          onClick={() => handleDelete(teacher._id)}
        >
          Delete
        </Button>
        <Button
          size="small"
          variant="contained"
          sx={{ background: "gold", color: "#222222" }}
          onClick={() => {
            handleEdit(teacher._id);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
