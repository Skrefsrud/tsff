"use client"

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define the type for our array items
type ArrayItem = {
  id: string
  year_label: string
  start_date: string
  end_date: string
  created_at: string
}

// Define props for our component
interface ArrayTableProps {
  items: ArrayItem[]
}

export default function ArrayTable({ items }: ArrayTableProps) {
  // If there are no items, display a message
  if (items.length === 0) {
    return <p>No items to display</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Year Label</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.year_label}</TableCell>
            <TableCell>{item.start_date}</TableCell>
            <TableCell>{item.end_date}</TableCell>
            <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

