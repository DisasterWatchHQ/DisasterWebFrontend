import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, ...passwordData } = data;
    const token = request.headers.get("Authorization");

    const response = await api.post(
      `/users/${userId}/changepassword`,
      passwordData,
      {
        headers: { Authorization: token },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to change password" },
      { status: error.response?.status || 500 },
    );
  }
}
