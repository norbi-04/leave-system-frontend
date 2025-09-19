import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/Login.tsx"),
    route("/home","pages/Home.tsx"),
    route("/users","pages/Users.tsx")

] satisfies RouteConfig;
 