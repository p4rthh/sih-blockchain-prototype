import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: { caseRef: string } }
) {
  const caseRef = decodeURIComponent(params.caseRef || '');
  const searchParams = req.nextUrl.searchParams;
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/reports/${encodeURIComponent(caseRef)}/pdf${queryString}`);
      if (res.ok) {
        const pdfBuffer = await res.arrayBuffer();
        return new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="CHAINWATCH_Dossier_${caseRef}.pdf"`,
          },
        });
      }
    } catch (err) {
      console.warn('Backend PDF generation proxy failed', err);
    }
  }

  return NextResponse.json(
    { 
      error: 'Backend PDF generator offline', 
      message: 'Deploy the FastAPI backend to Render / Railway, or use browser print view for instant court evidence export.',
      caseRef 
    },
    { status: 503 }
  );
}
