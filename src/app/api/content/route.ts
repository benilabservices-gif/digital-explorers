import { NextResponse } from 'next/server';
import { WORLDS, BADGES, DIGITAL_BRIDGES } from '@/data/content';

export async function GET() {
  return NextResponse.json({
    worlds: WORLDS.map(w => ({
      id: w.id,
      slug: w.slug,
      name: w.name,
      icon: w.icon,
      description: w.description,
      phase: w.phase,
      adventureCount: w.adventures?.length || 0,
    })),
    badges: BADGES,
    bridges: DIGITAL_BRIDGES,
    totalAdventures: WORLDS.reduce((sum, w) => sum + (w.adventures?.length || 0), 0),
  });
}

export async function POST(req: Request) {
  const { worldSlug, adventureSlug } = await req.json();
  
  const world = WORLDS.find(w => w.slug === worldSlug);
  if (!world) return NextResponse.json({ error: 'World not found' }, { status: 404 });
  
  const adventure = world.adventures?.find(a => a.slug === adventureSlug);
  if (!adventure) return NextResponse.json({ error: 'Adventure not found' }, { status: 404 });
  
  return NextResponse.json({
    id: adventure.id,
    slug: adventure.slug,
    title: adventure.title,
    description: adventure.description,
    story: adventure.story,
    xp_reward: adventure.xp_reward,
    world: { slug: world.slug, name: world.name, icon: world.icon },
  });
}
