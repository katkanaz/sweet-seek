import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Results from "./pages/Results";
import ResultDetail from "./pages/ResultDetail";
import Docs from "./pages/Docs";
import Stats from "./pages/Stats";

const rootRoute = createRootRoute({
    component: () => (
        <>
            <NavBar />
            <Outlet />
        </>
    ),
})

export const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
})

export type ResultsSearch = {
    sugar?: number[]
    plddt?: [number, number]
    organism?: number[]
    pdbStructure?: number
    page: number
    count?: number
}

export const resultsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/results",
    validateSearch: (search: Record<string, unknown>): ResultsSearch => {
        return {
            sugar: (search.sugar as number[]) ?? undefined,
            plddt: (search.plddt as [number, number]) ?? undefined,
            organism: (search.organism as number[]) ?? undefined,
            pdbStructure: (search.pdbStructure as number) ?? undefined,
            page: (search.page as number) ?? 1,
            count: (search.count as number) ?? undefined,
        }
    },
    component: Results,
})

export const resultDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/results/$afId",
    component: ResultDetail,
})

export const statsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/stats",
    component: Stats,
})

export const docsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/docs",
    component: Docs,
})

const routeTree = rootRoute.addChildren([homeRoute, resultsRoute, resultDetailRoute, docsRoute, statsRoute])

export const router = createRouter({ routeTree })


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
