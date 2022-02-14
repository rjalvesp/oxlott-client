import * as R from "ramda";
import axios from "axios";

export const CreateInstance = (entity) => {
  const instance = axios.create({
    baseUrl: process.env.REACT_APP_SERVER_URI,
    timeout: 90000,
  });

  instance.all = () => instance.get(`${entity}`).then(R.propOr([], "data"));
  instance.search = (search) =>
    instance
      .post(`${entity}/datatable`, search)
      .then(R.propOr({}, "data"))
      .then(
        R.over(
          R.lensProp("data"),
          R.pipe(
            R.defaultTo([]),
            R.map((value) => ({ ...value, id: value._id.split(":")[1] }))
          )
        )
      );
  instance.getById = (id) =>
    instance
      .get(`${entity}/${id}`)
      .then(R.propOr(null, "data"))
      .then(R.unless(R.isNil, R.omit(["_id", "_rev", "type", "createdAt"])));
  instance.create = (body) =>
    instance.post(`${entity}`, body).then(R.propOr(null, "data"));
  instance.update = (id, body) =>
    instance.put(`${entity}/${id}`, body).then(R.propOr(null, "data"));
  instance.delete = (id) =>
    instance.delete(`${entity}/${id}`).then(R.propOr(null, "data"));

  instance.updateToken = () => {
    instance.defaults.baseURL = process.env.REACT_APP_SERVER_URI;
    instance.defaults.headers.common[
      "Authorization"
      // eslint-disable-next-line no-undef
    ] = `Bearer ${localStorage.getItem("token")}`;
  };

  instance.updateToken();

  return instance;
};
