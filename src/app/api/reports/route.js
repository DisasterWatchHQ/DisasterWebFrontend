import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Replace this with your actual API call to your backend/database
    // This is just a mock response
    const reports = [
      {
        title: "Flood Alert",
        description: "Flood reported in XYZ area. Evacuation recommended.",
        date: new Date().toISOString(),
        location: "XYZ City",
      },
      {
        title: "Earthquake Warning",
        description: "Possible aftershocks detected in ABC region.",
        date: new Date(Date.now() - 3600000).toISOString(),
        location: "ABC Region",
      },
    ];

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}
