import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function ScheduleTable({ schedules, onEdit, onDelete }) {
  const columns = [
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      valueGetter: (params) => `${params.row.doctor?.firstName} ${params.row.doctor?.lastName}`,
    },
    { field: 'dayOfWeek', headerName: 'Day', flex: 1 },
    {
      field: 'startTime',
      headerName: 'Start Time',
      flex: 1,
      valueFormatter: ({ value }) => new Date(value).toLocaleTimeString(),
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      flex: 1,
      valueFormatter: ({ value }) => new Date(value).toLocaleTimeString(),
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
        rows={schedules}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        className="custom-scrollbar"
      />
    </div>
  );
}