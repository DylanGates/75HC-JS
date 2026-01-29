import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Home() {
	const [darkMode, setDarkMode] = useState(false);

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
						<Skeleton className="h-8 w-1/2 mt-2" />
					</CardContent>
				</Card>
			</main>
		</div>
	);
}

