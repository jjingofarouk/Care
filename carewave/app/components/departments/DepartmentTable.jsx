import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function DepartmentTable({ departments, onEdit, onDelete }) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'departmentType', headerName: 'Type', flex: 1 },
    {
      field: 'units',
      headerName: 'Units',
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2">
          {params.row.units?.map(unit => (
            <span key={unit.id} className="badge badge-info">
              {unit.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton
            onClick={() => onEdit(params.row)}
            className="btn btn-outline"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger"
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="table" style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={departments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        className="custom-scrollbar"
      />
    </div>
  );
}