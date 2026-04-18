import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { dept, hostel } = await req.json();

    if (!dept || !hostel) {
      return NextResponse.json(
        { error: "Dept and Hostel are required" },
        { status: 400 }
      );
    }

    const prompt = `Roast this OAU student.
    Department: ${dept}
    Location/Hostel: ${hostel}
    
    Instruction: Generate a savage roast based on these specific student details.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roast = response.text();

    return NextResponse.json({ roast });
  } catch (error) {
    console.error("Burn Error:", error);
    return NextResponse.json(
      { error: "The roaster had a brain freeze. Try again." },
      { status: 500 }
    );
  }
}
