import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/Login.tsx"),
    route("/home","pages/Home.tsx"),
    route("/users","pages/Users.tsx"),
    route("/reporting","pages/Reporting.tsx"),
    route("/my-leave","pages/MyLeave.tsx"),
    route("/pending-leave","pages/PendingLeave.tsx"),

] satisfies RouteConfig;
 