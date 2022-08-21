import React from "react";
import * as R from "ramda";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { BillsService } from "services/Bills.service";
import { ConfirmModal } from "components/UI";
import * as Datatable from "utils/datatable";
import { Currency } from "utils/currency";

const BillsList = () => {
  const service = BillsService();
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
      field: "event.eventType.name",
      headerName: "Event",
      width: 180,
      renderCell: ({ row: { event } }) => R.pathOr("", ["name"], event),
    },
    {
      field: "user.email",
      headerName: "Email",
      width: 180,
      renderCell: ({ row: { user } }) => R.propOr("", "email", user),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: ({ row: { date } }) =>
        date ? dayjs(date).format("LLL") : "",
    },
    {
      field: "event.cost",
      headerName: "Cost",
      width: 180,
      renderCell: ({ row: { event } }) =>
        Currency(R.pathOr(0, ["cost"], event)),
    },
    {
      field: "event.prize",
      headerName: "Prize",
      width: 180,
      renderCell: ({ row: { event } }) =>
        Currency(R.pathOr(0, ["prize"], event)),
    },
    {
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: ({ row: { id } }) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/bills/${id}`)}>
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

export default BillsList;
