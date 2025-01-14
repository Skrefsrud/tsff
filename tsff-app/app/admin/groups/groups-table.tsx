"use client";

import { useEffect, useState } from "react";

type SeasonGroup = {
    id: string;
    season_id: string;
    group_name: string;
    completed: boolean;
    created_at: string;
};

interface GroupsTableProps {
    seasonId: string;
}

export function GroupsTable({ seasonId }: GroupsTableProps) {
    const [seasonGroups, setSeasonGroups] = useState<SeasonGroup[]>([]);
    const [error, setError] = useState<string | null>(null);


    console.log("Season ID:", seasonId as string);

    useEffect(() => {
        const fetchSeasonGroups = async () => {
            try {
                const response = await fetch(`/api/season-groups?seasonId=${seasonId as string}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setSeasonGroups(data);
            } catch (error: any) {
                console.error("Error fetching season groups:", error);
                setError(error.message);
            }
        };

        fetchSeasonGroups();
    }, [seasonId]);

    return (
        <div>
            <h1>Groups Table</h1>
            {error ? (
                <p>{error}</p>
            ) : seasonGroups.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Group Name</th>
                            <th>Completed</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seasonGroups.map((group) => (
                            <tr key={group.id}>
                                <td>{group.id}</td>
                                <td>{group.group_name}</td>
                                <td>{group.completed ? "Yes" : "No"}</td>
                                <td>{new Date(group.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No season groups found for this season.</p>
            )}
        </div>
    );
}
