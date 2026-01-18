import { NextResponse } from 'next/server';

// Publishing functionality needs to be reimplemented for the new dedicated tables architecture.
// With the new architecture:
// - Each content type (Page, Post, News) has its own table
// - The `status` field is directly on the content record
// - Publishing = updating the status from DRAFT to PUBLISHED
// - Version history is tracked in separate PageVersion/PostVersion/NewsVersion tables

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Not implemented. Publishing will be available via /api/pages/:id/publish, /api/posts/:id/publish, /api/news/:id/publish endpoints.',
    },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        'Not implemented. Unpublishing will be available via /api/pages/:id/unpublish, /api/posts/:id/unpublish, /api/news/:id/unpublish endpoints.',
    },
    { status: 501 }
  );
}
