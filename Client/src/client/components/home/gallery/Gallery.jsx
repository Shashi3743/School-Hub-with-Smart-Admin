import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../../environment';

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools] = useState([]);

  const handleOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/school/all`)
      .then((resp) => {
        const data = resp?.data?.data || []; // fallback if undefined
        setSchools(data);
      })
      .catch((e) => {
        console.error("ERROR fetching schools:", e);
        setSchools([]); // fallback
      });
  }, []);

  return (
    <>
      <ImageList
        variant="standard"
        cols={3}
        gap={12}
        sx={{ padding: 2 }}
      >
        {Array.isArray(schools) && schools.map((school, i) => (
          <ImageListItem
            key={i}
            sx={{
              cursor: "pointer",
              "&:hover": { opacity: 0.85 },
            }}
            onClick={() => handleOpen(school)}
          >
            <img
              src={school.school_image}
              alt={school.school_name}
              loading="lazy"
              style={{
                height: "250px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                display: "block",
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                mt: 1,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {school.school_name}
            </Typography>
          </ImageListItem>
        ))}
      </ImageList>

      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            outline: "none",
            p: 2,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box position="relative">
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "grey.500" }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {selectedSchool?.school_name}
            </Typography>
            <img
              src={selectedSchool?.school_image}
              alt={selectedSchool?.school_name}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                borderRadius: 8,
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Gallery;
