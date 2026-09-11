export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicDossier } from '@/lib/api/mockData';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const caseRef = body.case_ref || 'NCRP-2026-DEL-89210';

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(26000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend compile dossier failed, checking local synthesis', err);
    }
  }

  // Generate dynamic dossier with metadata
  const dossier = generateDynamicDossier(caseRef, body.trace || body.trace_data, {
    victimName: body.victim_name,
    firNumber: body.fir_number,
    policeUnit: body.police_unit,
    ioName: body.io_name,
    amount: body.amount,
  });

  // If local Ollama is directly available on port 11434 and backend didn't respond
  try {
    const prompt = `Draft a formal 2-sentence court synopsis under Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023 for Indian Cyber Police. Case details: FIR ${dossier.firNumber}, Complainant ${dossier.victimName || 'Complainant'}, Amount ${dossier.traceData.totalValueStolen}, Hops: ${dossier.traceData.totalHops}, Topology: ${dossier.traceData.typology}, Terminal VASP: ${dossier.assignedVASP.name} (${dossier.assignedVASP.fiuRegNumber}), Confidence: ${Math.round(dossier.traceData.confidence <= 1 ? dossier.traceData.confidence * 100 : dossier.traceData.confidence)}%. Directly output the 2-sentence formal synopsis without any intro or preamble.`;
    const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: prompt,
        stream: false,
        keep_alive: '1h',
        options: { temperature: 0.1, num_predict: 60 }
      }),
      signal: AbortSignal.timeout(22000),
    });
    if (ollamaRes.ok) {
      const ollamaData = await ollamaRes.json();
      if (ollamaData.response) {
        let cleanText = ollamaData.response.replace(/^(Here is|Here's|Synopsis:|Summary:|In summary:).*?\n+/i, '').trim();
        cleanText = cleanText.replace(/^"|"$/g, '').trim();
        if (cleanText) {
          dossier.synopsisEn = cleanText;
          dossier.llmModel = 'Ollama (Llama 3 8B)';
        }
      }
    }
  } catch {
    // Falls back to sovereign synthesis gracefully
  }

  return NextResponse.json(dossier);
}
