import { NextResponse } from "next/server";
import apiClient from '@/lib/api';

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, currentPassword, newPassword } = data;

    const response = await apiClient.post(
      `/users/changepassword/${userId}`,
      { currentPassword, newPassword }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to change password" },
      { status: error.response?.status || 500 },
    );
  }
}
