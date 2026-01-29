import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Combobox,
	ComboboxTrigger,
	ComboboxInput,
	ComboboxContent,
	ComboboxItem,
} from "@/components/ui/combobox";
import { useState } from "react";

export default function Home() {
	const [darkMode, setDarkMode] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<div className={`${darkMode ? "dark" : ""}`}>
			<header className="w-full py-6 bg-white dark:bg-gray-900 shadow-sm">
				<div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Weather Dashboard</h1>
						<p className="text-sm text-muted-foreground">Track multiple cities at a glance</p>
					</div>
					<div className="flex items-center gap-3">
						<Badge>v1</Badge>
						<Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
							Toggle Theme
						</Button>
					</div>
				</div>
			</header>

			<main className="flex min-h-screen items-start justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
				<Card className="w-full max-w-4xl mx-auto">
					<CardHeader>
						<CardTitle>Overview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="mb-4">
							<p className="text-sm text-muted-foreground">Add cities to begin monitoring current weather and a short forecast.</p>
						</div>

						{/* Commit 3: location input + combobox */}
						<form className="flex gap-2 mb-4" onSubmit={(e) => e.preventDefault()}>
							<Combobox>
								<ComboboxTrigger className="flex-1">
									<ComboboxInput placeholder="Search city or select" />
								</ComboboxTrigger>
								<ComboboxContent>
									<ComboboxItem value="London">London</ComboboxItem>
									<ComboboxItem value="New York">New York</ComboboxItem>
									<ComboboxItem value="Tokyo">Tokyo</ComboboxItem>
								</ComboboxContent>
							</Combobox>
							<Input placeholder="Or type new city" className="w-64" />
						</form>

						{/* Commit 4: add/search button */}
						<div className="flex gap-2 mb-6">
							<Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} aria-label="Search city">
								Search
							</Button>
							<Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} aria-label="Add city">
								Add City
							</Button>
						</div>

						{/* Commit 5: loading skeleton state example */}
						<div>
							<p className="text-sm mb-2">Example loading state:</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<Card className="p-4">
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-1/2 mb-2" />
									<Skeleton className="h-12 w-full" />
								</Card>
								<Card className="p-4">
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-1/2 mb-2" />
									<Skeleton className="h-12 w-full" />
								</Card>
								<Card className="p-4">
									<Skeleton className="h-6 w-3/4 mb-2" />
									<Skeleton className="h-4 w-1/2 mb-2" />
									<Skeleton className="h-12 w-full" />
								</Card>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}

