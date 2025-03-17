import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("http://localhost:8080/api/test");
    return NextResponse.json({ message: response.data });
  } catch (error) {
    console.error("Error fetching API:", error);
    return NextResponse.json({ error: "Failed to fetch API" }, { status: 500 });
  }
}
