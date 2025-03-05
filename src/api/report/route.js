import { NextResponse } from "next/server";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request) {
  try {
    const data = await request.json();

    const response = await api.post("/reports", data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: error.response?.data?.error || "Failed to submit report",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
