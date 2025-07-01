/* eslint-disable react/prop-types */
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from "@mui/material";

export default function TeacherCardAdmin({
  handleEdit,
  teacher,
  handleDelete,
}) {
  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const dateNu = date.getDate();
    const month = +date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dateNu}/${month}/${year}`;
  };

  return (
    <Card
      sx={{
        width: 345,
        height: 400, // Total height of the card
        margin: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        sx={{
          height: "50%",
          objectFit: "cover",
        }}
        image={teacher.teacher_image}
        alt={teacher.name}
      />

      {/* Content */}
      <CardContent
        sx={{
          flex: "1 1 auto",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {teacher.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Email:</b> {teacher.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Age:</b> {teacher.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Gender:</b> {teacher.gender}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Qualification:</b> {teacher.qualification}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date of Join:</b> {convertDate(teacher.createdAt)}
        </Typography>
      </CardContent>

      {/* Buttons pinned to bottom */}
      <CardActions
        sx={{
          justifyContent: "flex-end",
          marginTop: "auto", // this pushes CardActions to the bottom
          paddingX: 1,
          paddingY: 1,
          borderTop: "1px solid #eee",
        }}
      >
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
          sx={{ background: "gold", color: "#222" }}
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
