import { NextResponse } from 'next/server';
import { getRecipes } from '@/lib/recipes';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export async function GET() {
  try {
    const recipes = await getRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}