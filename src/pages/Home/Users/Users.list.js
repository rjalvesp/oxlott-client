import React from "react";
import * as R from "ramda";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { UsersService } from "services/Users.service";
import { ConfirmModal } from "components/UI";
import * as Datatable from "utils/datatable";

const UsersList = () => {
  const service = UsersService();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [datatable, setDatatable] = React.useState();
  const [sorting, setSorting] = React.useState();
  const [filtering, setFiltering] = React.useState();
  const [page, setPage] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    service
      .search({
        skip: page * Datatable.limit,
        limit: Datatable.limit,
        ...Datatable.getSorting(sorting),
        ...R.pipe(
          R.defaultTo([]),
          Datatable.transformInvertedBoolean("disabled"),
          Datatable.getFiltering
        )(filtering),
      })
      .then(setDatatable)
      .then(() => setLoading(false));
  }, [page, sorting, filtering]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 400,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
    },
    {
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: ({ row: { id } }) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/users/${id}`)}>
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const onDelete = () => {
    service.delete(selectedId).then(() => setSelectedId(null));
  };

  if (!datatable && loading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <>
      <DataGrid
        rows={datatable.data}
        rowCount={datatable.filteredTotal || datatable.total || 0}
        columns={columns}
        pageSize={Datatable.limit}
        autoHeight
        pagination
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onFilterModelChange={({ items }) => setFiltering(items)}
        onSortModelChange={(sortingItem) => setSorting(sortingItem[0])}
        onPageChange={({ page }) => setPage(page)}
        loading={loading}
      />
      <ConfirmModal
        open={!!selectedId || false}
        title="Are you sure?"
        onClose={() => setSelectedId(null)}
        onOk={onDelete}
      />
    </>
  );
};

export default UsersList;
