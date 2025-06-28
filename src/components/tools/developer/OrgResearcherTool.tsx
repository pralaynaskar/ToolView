'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Search, FileJson, HelpCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export default function OrgResearcherTool() {
  const [parentOrg, setParentOrg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [allowNoParent, setAllowNoParent] = useState(false);
  const [forceOverwrite, setForceOverwrite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Placeholder for search history and results
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!githubToken) {
      toast({
        variant: 'destructive',
        title: 'GitHub Token Required',
        description: 'Please provide a GitHub Personal Access Token to perform a search.',
      });
      return;
    }
    if (!searchTerm) {
      toast({
        variant: 'destructive',
        title: 'Search Term Required',
        description: 'Please enter a search term.',
      });
      return;
    }
    if (!parentOrg && !allowNoParent) {
        toast({
            variant: 'destructive',
            title: 'Parent Organization Required',
            description: 'Please enter a parent organization or allow searching without one.',
        });
        return;
    }

    setIsLoading(true);
    // TODO: Implement the actual API call to a backend flow
    // For now, we'll simulate a network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Search Complete (Simulated)',
      description: 'In a real app, results would be displayed here.',
    });
    setResults({ simulated: true, searchTerm, parentOrg });
    setIsLoading(false);
  };
  
  const handleExport = () => {
    if (!results) {
        toast({
            title: "No data to export",
            description: "Please perform a search first.",
        });
        return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(results, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `github-org-research-${searchTerm}.json`;
    link.click();
    toast({ title: 'Exported as JSON!' });
  };
  
  const handleClearHistory = () => {
    setSearchHistory([]);
    toast({ title: 'Search history cleared.' });
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
            <p className="text-muted-foreground max-w-3xl mx-auto">
                A tool to more easily find and verify authenticity of GitHub accounts owned by large companies who don't list all their official accounts anywhere.
            </p>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="text-muted-foreground text-xs">
                        <HelpCircle className="mr-1 h-4 w-4" />
                        What is this for?
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p>Large companies often have dozens of GitHub organizations for different projects, but don't publicly list them all. This tool helps you discover potential associated accounts by searching for organizations whose members are also part of a known 'parent' organization.</p>
                </TooltipContent>
            </Tooltip>
        </div>
        
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="parent-org">Parent Organization</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-secondary text-muted-foreground sm:text-sm">
                                github.com/
                            </span>
                            <Input
                                id="parent-org"
                                placeholder="e.g., adobe"
                                value={parentOrg}
                                onChange={e => setParentOrg(e.target.value)}
                                className="rounded-l-none"
                                disabled={allowNoParent}
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                         <Label htmlFor="search-term">Search Term</Label>
                         <Input 
                            id="search-term" 
                            placeholder="e.g., google"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                         />
                      </div>
                </div>
              <div className="space-y-2">
                <Label htmlFor="github-token" className="flex justify-between items-center">
                    <span>GitHub Token (Required)</span>
                     <Tooltip>
                        <TooltipTrigger asChild>
                             <Link href="https://github.com/settings/tokens/new?scopes=read:org" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                (Get a token)
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>A token with 'read:org' scope is recommended for full access.</p>
                        </TooltipContent>
                      </Tooltip>
                </Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="Your Personal Access Token"
                  value={githubToken}
                  onChange={e => setGithubToken(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="no-parent" checked={allowNoParent} onCheckedChange={(checked) => setAllowNoParent(checked as boolean)} />
                <Label htmlFor="no-parent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Allow search without a parent organization
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="force-overwrite" checked={forceOverwrite} onCheckedChange={(checked) => setForceOverwrite(checked as boolean)} />
                <Label htmlFor="force-overwrite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Force overwrite previous result
                </Label>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <Button onClick={handleSearch} disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
              <Button onClick={handleExport} variant="secondary" size="lg">
                <FileJson className="mr-2 h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6">
                 <Label className="text-base font-semibold">Search History</Label>
                 <div className="flex gap-2 mt-4 mb-4">
                    <Button variant="outline" size="sm" onClick={handleClearHistory} disabled={searchHistory.length === 0}>Clear All</Button>
                    <Button variant="outline" size="sm" disabled>Refresh Members Lists</Button>
                </div>
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-md">
                    <p>Search history will appear here.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
