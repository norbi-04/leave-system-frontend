import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("/users","routes/users/index.tsx"),
    route("/users/new","routes/users/new.tsx"),
    route("/users/:id","routes/users/show.tsx"),
    route("/users/:id/edit","routes/users/edit.tsx"),


] satisfies RouteConfig;
 