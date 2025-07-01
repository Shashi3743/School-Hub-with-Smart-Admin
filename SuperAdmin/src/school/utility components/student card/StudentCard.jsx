/* eslint-disable react/prop-types */
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from "@mui/material";

export default function StudentCardAdmin({
  handleEdit,
  student,
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
        height: 400, // total card height
        margin: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        image={student.student_image}
        alt={student.name}
        sx={{
          height: "50%", // top half image
          objectFit: "cover",
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          flex: "1 1 auto",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {student.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Class:</b>{" "}
          {student.student_class?.class_text || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Age:</b> {student.age}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Gender:</b> {student.gender}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Guardian:</b> {student.guardian}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Guardian Phone:</b> {student.guardian_phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date of Admission:</b> {convertDate(student.createdAt)}
        </Typography>
      </CardContent>

      {/* Buttons */}
      <CardActions
        sx={{
          justifyContent: "flex-end",
          paddingX: 1,
          paddingY: 1,
          borderTop: "1px solid #eee",
        }}
      >
        <Button
          size="small"
          variant="contained"
          sx={{ background: "red", color: "#fff" }}
          onClick={() => handleDelete(student._id)}
        >
          Delete
        </Button>
        <Button
          size="small"
          variant="contained"
          sx={{ background: "gold", color: "#222" }}
          onClick={() => {
            handleEdit(student._id);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
