import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle>Weather App — Fresh Start</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Initializing app skeleton...</p>
					<Skeleton className="h-8 w-1/2 mt-4" />
				</CardContent>
			</Card>
		</main>
	);
}

