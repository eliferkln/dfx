import { useState, useEffect } from "react";
import {
  Typography,
  Dialog,
  TextField,
  Pagination,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Navbar from "../components/Navbar";
import { useData } from "../context/DataContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import {
  PageContainer,
  ActionButton,
  DataGridContainer,
  DialogContent,
  HeaderContainer,
  PaginationContainer,
} from "../styles/StyledComponents";
import { validateDataForm, ValidationError } from "../utils/validation";

interface DataItem {
  id: number;
  title: string;
  body: string;
}

export default function Dashboard() {
  const { data, isLoading, addItem, updateItem, deleteItem } = useData();
  const [selectedRow, setSelectedRow] = useState<DataItem | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ title: string; body: string }>({
    title: "",
    body: "",
  });
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [modalData, setModalData] = useState<DataItem | null>(null);

  useEffect(() => {
    if (modalData) {
      setFormData({
        title: modalData.title,
        body: modalData.body,
      });
      setSelectedRow(modalData);
      setIsDialogOpen(true);
      setModalData(null);
    }
  }, [modalData]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleAdd = async () => {
    const validationErrors = validateDataForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    await addItem(formData);
    setIsDialogOpen(false);
    setFormData({ title: "", body: "" });
    setErrors([]);
  };

  const handleEdit = async () => {
    if (selectedRow) {
      const validationErrors = validateDataForm(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      await updateItem({ ...selectedRow, ...formData });
      setIsDialogOpen(false);
      setSelectedRow(undefined);
      setFormData({ title: "", body: "" });
      setErrors([]);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(undefined);
    setSelectedId(undefined);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      minWidth: 70,
    },
    {
      field: "title",
      headerName: "Başlık",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "body",
      headerName: "Mesaj",
      flex: 3,
      minWidth: 300,
    },
    {
      field: "actions",
      headerName: "İşlemler",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedId === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setModalData(params.row);
                handleMenuClose();
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Güncelle
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleDelete(params.row.id);
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Sil
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <PageContainer>
        <HeaderContainer>
          <Typography variant="h5">Hazır Mesajlar</Typography>
          <ActionButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(undefined);
              setFormData({ title: "", body: "" });
              setIsDialogOpen(true);
            }}
          >
            Mesaj Ekle
          </ActionButton>
        </HeaderContainer>

        <DataGridContainer>
          <DataGrid
            rows={paginatedData}
            columns={columns}
            loading={isLoading}
            hideFooter
            autoHeight
            disableRowSelectionOnClick
          />
        </DataGridContainer>

        <PaginationContainer>
          <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </PaginationContainer>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">
                {selectedRow ? "Mesaj Güncelle" : "Yeni Mesaj Tanımla"}
              </Typography>
              <IconButton onClick={() => setIsDialogOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Mesaj başlığı"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.some((e) => e.field === "title")}
              helperText={errors.find((e) => e.field === "title")?.message}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mesaj İçeriği"
              multiline
              rows={4}
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              error={errors.some((e) => e.field === "body")}
              helperText={errors.find((e) => e.field === "body")?.message}
              required
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <ActionButton
                variant="outlined"
                fullWidth
                onClick={() => setIsDialogOpen(false)}
              >
                İptal
              </ActionButton>
              <ActionButton
                variant="contained"
                fullWidth
                onClick={selectedRow ? handleEdit : handleAdd}
              >
                {selectedRow ? "Güncelle" : "Kaydet"}
              </ActionButton>
            </Box>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </>
  );
}
