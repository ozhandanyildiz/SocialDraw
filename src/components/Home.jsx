import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikes, toggleLike } from '../redux/drawingsSlice';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogTitle,Box} from '@mui/material';

const Home = () => {
    const dispatch = useDispatch();
    const likes = useSelector((state) => state.drawings.likes);
    const userLiked = useSelector((state) => state.drawings.userLiked);
    const [searchTerm, setSearchTerm] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [drawingToDelete, setDrawingToDelete] = useState(null);

    let drawings = JSON.parse(localStorage.getItem('drawings')) || [];

    useEffect(() => {
        dispatch(fetchLikes());
    }, [dispatch]);

    const handleLike = (id) => {
        dispatch(toggleLike({ id }));
    };

    const openDeleteConfirmation = (id) => {
        setDrawingToDelete(id);
        setOpenConfirmDialog(true);
    };

    const confirmDelete = () => {
        const updatedDrawings = drawings.filter(drawing => drawing.id !== drawingToDelete);
        localStorage.setItem('drawings', JSON.stringify(updatedDrawings));
        setOpenConfirmDialog(false);
        window.location.reload();
    };

    const cancelDelete = () => {
        setOpenConfirmDialog(false);
    };

    const deleteDrawing = (id) => {
        openDeleteConfirmation(id);
    };

    const downloadDrawing = (drawing) => {
        const link = document.createElement('a');
        link.download = `${drawing.title || 'drawing'}.png`;
        link.href = drawing.image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredDrawings = drawings.filter(drawing =>
        drawing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    margin: '20px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '180px',
                    height: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                }}
            />
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {filteredDrawings.map((drawing, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} style={{ padding: '10px' }}>
                        <Paper elevation={3} style={{ padding: '10px', textAlign: 'center', margin: '10px' }}>
                            <Typography variant="subtitle1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {drawing.title}
                            </Typography>
                            <img src={drawing.image} alt={drawing.title} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                            <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                                <Button variant="contained" color="primary" onClick={() => handleLike(drawing.id)}>
                                    {userLiked[drawing.id] ? 'Unlike' : 'Like'}
                                </Button>
                                <span>{likes[drawing.id] || 0}</span>
                                <Button variant="contained" color="secondary" onClick={() => deleteDrawing(drawing.id)}>
                                    Delete
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => downloadDrawing(drawing)}>
                                    Download
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={openConfirmDialog}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this drawing?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Home;
