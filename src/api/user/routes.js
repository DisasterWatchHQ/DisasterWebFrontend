import { NextResponse } from "next/server"
import axios from "axios"

const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const token = request.headers.get('Authorization')

    const response = await api.get(`/users/${userId}`, {
      headers: { Authorization: token }
    })

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to fetch user profile" },
      { status: error.response?.status || 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()
    const { userId, ...updateData } = data
    const token = request.headers.get('Authorization')

    const response = await api.put(`/users/${userId}`, updateData, {
      headers: { Authorization: token }
    })

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to update user" },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const token = request.headers.get('Authorization')

    const response = await api.delete(`/users/${userId}`, {
      headers: { Authorization: token }
    })

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to delete user" },
      { status: error.response?.status || 500 }
    )
  }
}