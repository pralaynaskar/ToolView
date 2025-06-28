'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, GitFork, Trash2, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface CachedData {
  [key: string]: {
    repos: Repo[];
    timestamp: number;
  };
}

const FullFetchTool = ({ onFetchComplete }: { onFetchComplete: (username: string, repos: Repo[]) => void }) => {
  const [username, setUsername] = useState('facebook');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllRepos = async () => {
    if (!username) {
      toast({
        variant: 'destructive',
        title: 'Username/Organization required',
        description: 'Please enter a GitHub username or organization name.',
      });
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError(null);

    const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
    if (apiKey) {
      headers['Authorization'] = `token ${apiKey}`;
    }

    try {
      const userTypeResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!userTypeResponse.ok) {
        const errorData = await userTypeResponse.json();
        throw new Error(errorData.message || 'Could not find user or organization.');
      }
      const userData = await userTypeResponse.json();
      const type = userData.type.toLowerCase();
      
      const reposUrl = type === 'organization' 
        ? `https://api.github.com/orgs/${username}/repos?type=public&per_page=100&page=`
        : `https://api.github.com/users/${username}/repos?type=public&per_page=100&page=`;
      
      let allRepos: Repo[] = [];
      let page = 1;
      
      while (true) {
        const response = await fetch(reposUrl + page, { headers });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `An error occurred: ${response.statusText}`);
        }
        
        const data: Repo[] = await response.json();
        if (data.length === 0) {
          break;
        }
        allRepos = [...allRepos, ...data];
        page++;
      }

      setResults(allRepos);
      onFetchComplete(username.toLowerCase(), allRepos);
      toast({ title: "Success!", description: `Fetched ${allRepos.length} repositories for '${username}'.`})

    } catch (e: any) {
      setError(e.message || 'Failed to fetch repositories.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: e.message || 'Failed to fetch repositories. Check the name and API key.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Fetch all public repositories for a GitHub user or organization. This data will be cached in your browser.
        </p>
        <div className="space-y-2">
          <Label htmlFor="username">GitHub User/Org Name</Label>
          <Input 
            id="username"
            placeholder="e.g., 'microsoft'" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">Optional: GitHub API Key (PAT)</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="api-key"
              type="password"
              placeholder="ghp_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)} 
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                    Get token
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Using a token increases the API rate limit.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Button onClick={fetchAllRepos} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Fetch All Repositories
        </Button>
        <div className="pt-4">
            {isLoading && <p>Fetching... this may take a moment for large organizations.</p>}
            {error && <p className="text-destructive">{error}</p>}
            {!isLoading && !results && !error && <p className="text-muted-foreground">The results of the full fetch will appear in the 'Cached Repositories' tab.</p>}
        </div>
      </CardContent>
    </Card>
  );
};


const repoColumns: ColumnDef<Repo>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <a href={row.original.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
        {row.original.name}
      </a>
    ),
  },
  {
    accessorKey: "stargazers_count",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stars
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.stargazers_count.toLocaleString()}</div>,
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => <div>{row.original.language || "N/A"}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => <div>{format(new Date(row.original.created_at), "P")}</div>,
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => <div>{format(new Date(row.original.updated_at), "P")}</div>,
  },
  {
    accessorKey: "pushed_at",
    header: "Pushed",
    cell: ({ row }) => <div>{format(new Date(row.original.pushed_at), "P")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="text-sm text-muted-foreground max-w-[300px] truncate">{row.original.description}</div>,
  },
];

const CachedRepos = ({ cachedData, setCachedData }: { cachedData: CachedData, setCachedData: (data: CachedData) => void }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const clearCacheForUser = (user: string) => {
    const newData = { ...cachedData };
    delete newData[user];
    setCachedData(newData);
    if(selectedUser === user) setSelectedUser(Object.keys(newData)[0] || null);
  }

  const users = Object.keys(cachedData);

  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    } else if (selectedUser && !users.includes(selectedUser)) {
      setSelectedUser(users[0] || null);
    }
  }, [users, selectedUser]);
  
  const selectedRepos = useMemo(() => selectedUser ? cachedData[selectedUser]?.repos : [], [cachedData, selectedUser]);

  const languages = useMemo(() => {
    if (!selectedRepos) return [];
    const langSet = new Set(selectedRepos.map(repo => repo.language).filter(Boolean));
    return Array.from(langSet).sort();
  }, [selectedRepos]);

  const table = useReactTable({
    data: selectedRepos,
    columns: repoColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  if (users.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No repositories cached yet. Use the 'Full Fetch Tool' to get started.</p>
  }

  const lastUpdated = selectedUser ? new Date(cachedData[selectedUser]?.timestamp).toLocaleString() : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-2 space-y-2">
            <Button disabled className="w-full">Update All</Button>
            <Button disabled variant="outline" className="w-full">Import Cache</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 space-y-1">
            <h3 className="font-semibold text-center text-sm p-2">Cached Users</h3>
            {users.map(user => (
              <Button
                key={user}
                variant={selectedUser === user ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3 space-y-4">
        {selectedUser && (
          <>
            <Card>
              <CardContent className="p-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold mr-2">Actions for {selectedUser}:</span>
                <Button size="sm" disabled>Update</Button>
                <Button size="sm" disabled>Fetch Releases</Button>
                <Button size="sm" disabled>Export</Button>
                <Button size="sm" variant="destructive" onClick={() => clearCacheForUser(selectedUser)}>Delete</Button>
              </CardContent>
            </Card>

            <div className="text-sm text-green-500">
                Displaying {table.getRowModel().rows.length} cached repos. Last updated: {lastUpdated}
            </div>

            <div className="bg-card p-2 rounded-lg border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2">
                    <Input
                        placeholder="Filter by name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                    />
                    <Select
                        value={(table.getColumn("language")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) => table.getColumn("language")?.setFilterValue(value === "all" ? "" : value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Languages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Languages</SelectItem>
                            {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                </TableHead>
                                )
                            })}
                            </TableRow>
                        ))}
                        </TableHeader>
                        <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={repoColumns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
};

export default function RepoExplorer() {
  const [cachedData, setCachedData] = useLocalStorage<CachedData>('repo-explorer-cache', {});

  const handleFetchComplete = (username: string, repos: Repo[]) => {
    const newCacheEntry = {
      repos,
      timestamp: Date.now(),
    };
    setCachedData({ ...cachedData, [username.toLowerCase()]: newCacheEntry });
  };

  return (
    <Tabs defaultValue="cached" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cached">Cached Repositories</TabsTrigger>
        <TabsTrigger value="full-fetch">Full Fetch Tool</TabsTrigger>
      </TabsList>
      <TabsContent value="cached" className="pt-4">
        <CachedRepos cachedData={cachedData} setCachedData={setCachedData} />
      </TabsContent>
      <TabsContent value="full-fetch" className="pt-4">
        <FullFetchTool onFetchComplete={handleFetchComplete} />
      </TabsContent>
    </Tabs>
  );
}
