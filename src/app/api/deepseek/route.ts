import { NextRequest, NextResponse } from 'next/server';

// DeepSeek API endpoint
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Get the API key from environment variables - using server-side env var
const API_KEY = process.env.DEEPSEEK_API_KEY;

// Function to improve the formatting of DeepSeek responses
function formatResponseText(text: string): string {
  // 1. Better structure for factual sections
  let formattedText = text
    // Convert "Fact:" or "Facts:" patterns to highlighted sections
    .replace(/\b(Fact|Facts):\s*/g, '### 📝 FACT: ')
    // Convert "Source:" or "Sources:" to highlighted sections
    .replace(/\b(Source|Sources):\s*/g, '### 🔎 SOURCE: ')
    // Convert "Evidence:" to highlighted sections
    .replace(/\b(Evidence):\s*/g, '### 📊 EVIDENCE: ')
    // Convert "Conclusion:" to highlighted sections
    .replace(/\b(Conclusion):\s*/g, '### ✅ CONCLUSION: ')
    // Convert "Assessment:" to highlighted sections
    .replace(/\b(Assessment|Analysis):\s*/g, '### 🧐 ASSESSMENT: ')
    // Convert "Truth Rating:" to highlighted sections
    .replace(/\b(Truth Rating|Rating|Verdict):\s*/g, '### ⚖️ VERDICT: ');
    
  // 2. Convert standard title formats to markdown headings
  formattedText = formattedText
    // Convert "Title:" patterns to markdown headings
    .replace(/^([A-Z][A-Za-z\s]+):(\s*)/gm, '## $1\n')
    // Convert "TITLE:" patterns to markdown headings
    .replace(/^([A-Z][A-Z\s]+):(\s*)/gm, '# $1\n');
  
  // 3. Format lists for better readability
  formattedText = formattedText
    // Convert numbered lists with periods to proper markdown lists
    .replace(/^(\d+)\.(\s+)([^\n]+)/gm, '$1.$2$3')
    // Convert dash lists to bullet points
    .replace(/^(\s*)-(\s+)([^\n]+)/gm, '$1*$2$3')
    // Convert plus lists to bullet points
    .replace(/^(\s*)\+(\s+)([^\n]+)/gm, '$1*$2$3');
  
  // 4. Format code blocks
  formattedText = formattedText
    // Look for code blocks and format them properly
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '```$1\n$2\n```');
  
  // 5. Add spacing between paragraphs if not already present
  formattedText = formattedText
    .replace(/([^\n])\n([^\n#*\d\-`])/g, '$1\n\n$2');
  
  // 6. Improve blockquote formatting
  formattedText = formattedText
    .replace(/^>(\s*)(.*)/gm, '> $2');
  
  // 7. Highlight important information
  formattedText = formattedText
    // Bold important notes
    .replace(/\b(Note|Important|Warning|Caution):/g, '**$1:**')
    // Bold key terms in definitions
    .replace(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b:\s/g, '**$1:** ');
    
  // 8. Highlight factual qualifiers
  formattedText = formattedText
    // Emphasize truth statements
    .replace(/\b(True|False|Mostly True|Mostly False|Partially True|Misleading|Unverified)\b/g, '**$1**')
    // Emphasize certainty qualifiers
    .replace(/\b(Confirmed|Debunked|Verified|Unconfirmed)\b/g, '**$1**');
  
  // 9. Add section dividers for better organization
  formattedText = formattedText
    // Add separator before conclusion if one doesn't exist
    .replace(/(\n\n)(### ✅ CONCLUSION:)/g, '\n\n---\n\n$2');
    
  // 10. Create callout boxes for key facts
  formattedText = formattedText
    // Convert lines with "KEY FACT:" to special callouts
    .replace(/\b(KEY FACT|IMPORTANT FACT):\s*(.*)/g, '\n> 🔑 **KEY FACT:** $2\n');
    
  // 11. Format dates and numbers consistently
  formattedText = formattedText
    // Format dates with highlighting
    .replace(/\b(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})\b/g, '`$1`')
    // Format percentages with highlighting
    .replace(/\b(\d+(\.\d+)?%)\b/g, '`$1`');
  
  return formattedText;
}

// Create a system prompt for fact-checking
const getSystemPrompt = () => {
  return `You are an expert fact-checker for FactCheck. Your role is to analyze claims, verify information, and provide evidence-based assessments. Follow these guidelines:

1. Analyze the claim or question thoroughly
2. Research and verify facts using reliable sources
3. Present evidence clearly and objectively
4. Provide a verdict on the accuracy of claims (True, False, Mostly True, Mostly False, Misleading, etc.)
5. Structure your response with clear sections: Facts, Sources, Evidence, and Conclusion
6. Always cite sources when providing information and include actual URLs to reliable sources
7. Avoid political bias and maintain neutrality
8. Be thorough but concise in your explanations

When citing sources, include the full URL in markdown format like [Source Name](https://example.com) so users can click on them.

Your goal is to help users distinguish fact from fiction with well-reasoned, evidence-based analysis.`;
};

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!API_KEY) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    // Prepare the request to DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stream: false, // Disable streaming to ensure complete responses
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get a response from DeepSeek API',
        details: errorData
      }, { status: response.status });
    }

    // Parse the response
    const data = await response.json();
    
    // Extract and format the response text
    const responseText = data.choices[0]?.message?.content || '';
    const formattedText = formatResponseText(responseText);

    // Return the formatted response
    return NextResponse.json({ 
      response: formattedText,
      model: 'DeepSeek Reasoner'
    });
  } catch (error: any) {
    // Log error for debugging
    console.error('Error calling DeepSeek API:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
} 