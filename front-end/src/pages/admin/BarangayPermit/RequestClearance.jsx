import { useEffect, useState } from "react";

export default function RequestClearance() {
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Request Clearance</h1>
        <ul className="list-disc list-inside">
          <li>Clearance Type: Barangay Clearance</li>
          <li>Status: Pending</li>
          <li>Date Requested: 2023-09-15</li>
        </ul>
    </div>
  );
}