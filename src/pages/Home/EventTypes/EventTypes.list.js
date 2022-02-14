import React from "react";
import * as R from "ramda";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { EventTypesService } from "services/EventTypes.service";
import { ActionRow, ConfirmModal, IconTextButton } from "components/UI";
import * as Datatable from "utils/datatable";

const EventTypesList = () => {
  const service = EventTypesService();
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
      width: 180,
    },
    {
      field: "frequency",
      headerName: "Generation Frequency",
      width: 180,
    },
    {
      field: "elements",
      headerName: "Elements",
      width: 180,
      type: "number",
    },
    {
      field: "minValue",
      headerName: "Min Value",
      width: 180,
    },
    {
      field: "maxValue",
      headerName: "Max Value",
      width: 180,
    },
    {
      field: "defaultCost",
      headerName: "Default Cost",
      type: "number",
      width: 180,
    },
    {
      field: "defaultPrize",
      headerName: "Default Prize",
      type: "number",
      width: 180,
    },
    {
      field: "disabled",
      headerName: "Enabled",
      width: 180,
      type: "boolean",
      renderCell: ({ row: { disabled } }) =>
        !disabled ? <CheckIcon /> : <ClearIcon />,
    },
    {
      field: "",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: ({ row: { id } }) => (
        <>
          <IconButton onClick={() => navigate(`/event-types/${id}`)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => setSelectedId(id)}>
            <DeleteIcon />
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
      <ActionRow>
        <IconTextButton
          variant="contained"
          color="primary"
          onClick={() => navigate("/event-types/new")}
        >
          <AddIcon /> New
        </IconTextButton>
      </ActionRow>
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

export default EventTypesList;
