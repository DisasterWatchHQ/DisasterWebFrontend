import { NextResponse } from "next/server";
import apiClient from "@/lib/api";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const token = request.headers.get("Authorization");

    const response = await apiClient.get(`/users/${userId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.response?.data?.message || "Failed to fetch user profile",
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    const { userId, ...updateData } = data;

    const response = await apiClient.patch(`/users/${userId}`, updateData);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to update user" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    const response = await apiClient.delete(`/users/${userId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to delete user" },
      { status: error.response?.status || 500 },
    );
  }
}
