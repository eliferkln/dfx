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
import { useUsers } from "../context/UsersContext";
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
import { validateUserForm, ValidationError } from "../utils/validation";

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Users() {
  const { data, isLoading, addItem, updateItem, deleteItem } = useUsers();
  const [selectedRow, setSelectedRow] = useState<UserItem | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [modalData, setModalData] = useState<UserItem | null>(null);

  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData.name,
        email: modalData.email,
        phone: modalData.phone,
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
    const validationErrors = validateUserForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    await addItem(formData);
    setIsDialogOpen(false);
    setFormData({ name: "", email: "", phone: "" });
    setErrors([]);
  };

  const handleEdit = async () => {
    if (selectedRow) {
      const validationErrors = validateUserForm(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      await updateItem({ ...selectedRow, ...formData });
      setIsDialogOpen(false);
      setSelectedRow(null);
      setFormData({ name: "", email: "", phone: "" });
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
    setAnchorEl(null);
    setSelectedId(null);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      minWidth: 70,
    },
    {
      field: "name",
      headerName: "İsim",
      flex: 2,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      minWidth: 200,
    },
    {
      field: "phone",
      headerName: "Telefon Numarası",
      flex: 1.5,
      minWidth: 150,
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
          <Typography variant="h5">Kullanıcı Listesi</Typography>
          <ActionButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setFormData({ name: "", email: "", phone: "" });
              setIsDialogOpen(true);
            }}
          >
            Kullanıcı Ekle
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

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent sx={{ minWidth: { sm: "400px" } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "60%",
                }}
              >
                {selectedRow ? "Kullanıcı Güncelle" : "Yeni Kullanıcı Ekle"}
              </Typography>
              <IconButton onClick={() => setIsDialogOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="İsim"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.some((e) => e.field === "name")}
              helperText={errors.find((e) => e.field === "name")?.message}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.some((e) => e.field === "email")}
              helperText={errors.find((e) => e.field === "email")?.message}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Telefon Numarası"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              error={errors.some((e) => e.field === "phone")}
              helperText={errors.find((e) => e.field === "phone")?.message}
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
