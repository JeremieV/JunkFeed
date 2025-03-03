'use client'

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { _export, _import } from "@/lib/helpers";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { gridviewAtom, subscriptionsAtom } from "@/state";
import { Button, buttonVariants } from "@/components/ui/button";
// import { _export, _import } from "@/lib/helpers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { List, SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  }
})

const persister = createSyncStoragePersister({
  // storage: window.localStorage,
})

function SearchButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isSearch = pathname === "/search";

  if (isSearch) {
    return (
      <Button className="h-7 w-7" size={"icon"} variant={"ghost"} onClick={() => router.back()}>
        <X width={15} height={15} />
        <span className="sr-only">Go back</span>
      </Button>
    )
  } else {
    return (
      <Link
        href="/search"
        className={cn("h-7 w-7", buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <SearchIcon width={15} height={15} />
        <span className="sr-only">Search</span>
      </Link>
    )
  }
}

export default function AppScaffold({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="w-full max-w-6xl m-auto h-full px-4">
            <header className="flex h-16 shrink-0 items-center gap-2" >
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                {/* TODO: show this when viewing OPML folders */}
                {/* <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb> */}
              </div>
              <div className="grow" />
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              <div className="flex gap-2 items-center">
                <SearchButton />
              </div>
            </header>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PersistQueryClientProvider >
  )
}