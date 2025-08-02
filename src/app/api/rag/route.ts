import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { project } from "../../../db/schema";
import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { InferenceClient } from "@huggingface/inference";
import { google } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";

// --- Type Definitions ---
// Define a type for the metadata stored in Pinecone for better type safety.
// It must extend RecordMetadata to satisfy the Pinecone SDK's constraint.
interface PineconeMetadata extends RecordMetadata {
  projectName: string;
  description: string;
  languages: string; // Stored as a JSON string
  owner: string;
}

// --- Pinecone Initialization ---
// Centralized function to initialize Pinecone and get the index.
// This avoids code repetition and ensures environment variables are checked.
function getPineconeIndex() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY environment variable is not set.");
  }
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pinecone.index<PineconeMetadata>("openwave");
}

// --- HuggingFace Inference Client ---
const hf = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN!);

/**
 * Generates an embedding for a given text using a sentence-transformer model.
 * @param text The input text to embed.
 * @returns A promise that resolves to an array of numbers representing the embedding.
 *
 * NOTE: The model 'sentence-transformers/all-MiniLM-L6-v2' produces 384-dimensional vectors.
 * Your Pinecone index MUST be configured with dimension 384 to use this model.
 */
async function getEmbedding(text: string): Promise<number[]> {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // Ensure we always return a flat array of numbers
  if (Array.isArray(response)) {
    if (Array.isArray(response[0])) {
      // If we got number[][], flatten it to number[] with explicit type assertion
      return response.flat() as number[];
    }
    return response as number[];
  }
  throw new Error("Invalid embedding response format");
}

/**
 * GET handler to fetch projects from the database, generate embeddings,
 * and upsert them into the Pinecone index.
 */
// Define type for Pinecone vector
interface PineconeVector {
  id: string;
  values: number[];
  metadata: PineconeMetadata;
}

export async function GET() {
  try {
    const index = getPineconeIndex();
    const allProjects = await db.select().from(project).execute();

    // Filter projects that have a description, as it's needed for embedding.
    const projectsWithDescription = allProjects.filter(
      (p) => p.aiDescription && p.aiDescription.trim() !== ""
    );

    // Generate embeddings for each project.
    const vectors: PineconeVector[] = await Promise.all(
      projectsWithDescription.map(async (p, id) => {
        const embedding = await getEmbedding(p.aiDescription!);

        // Ensure embedding is the correct type
        if (!Array.isArray(embedding) || embedding.some(isNaN)) {
          throw new Error(`Invalid embedding for project ${p.projectName}`);
        }

        return {
          id: id.toString(),
          values: embedding,
          metadata: {
            projectName: p.projectName || "Unnamed Project",
            description: p.aiDescription!,
            languages: JSON.stringify(p.languages),
            owner: p.projectOwner || "Unknown Owner",
          },
        };
      })
    );

    if (vectors.length > 0) {
      await index.upsert(vectors);
    }

    return NextResponse.json({
      success: true,
      message: "Data successfully sent to Pinecone.",
      projectsProcessed: vectors.length,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: `Failed to process data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * POST handler to process a user query, retrieve relevant context from Pinecone,
 * and stream a response from the language model.
 */
export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const latestUserMessage = messages
      .filter((msg) => msg.role === "user")
      .pop();

    if (!latestUserMessage || typeof latestUserMessage.content !== "string") {
      return NextResponse.json(
        { error: "Invalid user message in request." },
        { status: 400 }
      );
    }

    // 1. Get embedding for the user's query.
    const queryEmbedding = await getEmbedding(latestUserMessage.content);

    // 2. Query Pinecone for relevant projects.
    const index = getPineconeIndex();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3, // Retrieve the top 3 most relevant projects.
      includeMetadata: true,
    });

    // 3. Build the context string from query results.
    const context =
      queryResponse.matches
        ?.map((match) => {
          const metadata = match.metadata!; // We know metadata is included.
          return `Project: ${metadata.projectName}\nOwner: ${
            metadata.owner
          }\nDescription: ${
            metadata.description
          }\nRelevance Score: ${match.score?.toFixed(4)}\n`;
        })
        .join("\n---\n") ?? "";

    // 4. Create the system prompt with the retrieved context.
    const systemPrompt = `You are an expert assistant for openwave, a platform connecting open-source projects with contributors.
Your task is to answer user questions based ONLY on the context provided below.

CONTEXT:
---
${context}
---

IMPORTANT INSTRUCTIONS:
1.  ONLY use the information from the CONTEXT section to answer the query.
2.  If the context does not contain the answer, you MUST state: "I don't have enough information to answer that."
3.  Do NOT use any prior knowledge or information outside of the provided context.
4.  Do NOT make up or infer details not explicitly stated.
5.  When returning a project's details, format it clearly.
`;

    // 5. Stream the response from the AI model.
    const result = await streamText({
      model: google("models/gemini-pro"), // Using a powerful model for better generation.
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler (RAG):", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: `Failed to process RAG request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
